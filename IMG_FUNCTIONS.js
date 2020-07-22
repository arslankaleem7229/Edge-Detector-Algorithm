class IMG_FUNCTIONS
{
  _IMAGE_LOAD(SOURCE, CALLBACK)
    {
      let img = new Image();
      img.src = SOURCE;
      img.onload = () =>
      {
        let IMG_DATA = null;
        let c = document.createElement('canvas');
        let ctx = c.getContext('2d');
        c.width = img.width;
        c.height = img.height;
        ctx.drawImage(img, 0, 0, c.width, c.height);
        IMG_DATA = ctx.getImageData(0, 0, c.width, c.height);
        CALLBACK(IMG_DATA);
      }
    }
    
    _APPEND_CANVAS(IMG)
    {
      let c = document.createElement('canvas');
      let ctx = c.getContext('2d');
      c.width = IMG.width;
      c.height = IMG.height;
      ctx.putImageData(IMG, 0, 0);
      document.body.append(c);
    }
    _DUPLICATE(IMG)
    {
      return (new ImageData(
        new Uint8ClampedArray(IMG.data),
        IMG.width,
        IMG.height
      ));
    }
    _GET_PIX(DATA, X, Y, index)
    {
      if(X >= DATA.width || X < 0 || Y < 0 || Y >= DATA.height)
        return 0;
      return DATA.data[DATA.width*(4*Y)+index+(4*X)];
    }
    _GET_ALL_PIX_RGB(DATA, X, Y)
    {
      if(X >= DATA.width || X < 0 || Y < 0 || Y >= DATA.height)
        return 0;     
      return  {
        R:  DATA.data[DATA.width*(4*Y)+0+(4*X)],       
        G:  DATA.data[DATA.width*(4*Y)+1+(4*X)],
        B:  DATA.data[DATA.width*(4*Y)+2+(4*X)],
      };
    }
    
    _GET_PIX_INDEX(IMG, INDEX)
    {
      let COORDS = this._GET_AXIS(IMG, INDEX);
      return this._GET_INDEX(IMG, COORDS.X, COORDS.Y, 0);
    }

    _SET_PIX(rgbs, x, y, index, val)
    {
      rgbs.data[rgbs.width*(4*y)+index+(4*x)] = val;
    }

    _SET_ALL_PIX(rgbs, x, y, val )
    {
      rgbs.data[rgbs.width*(4*y)+0+(4*x)] = val;
      rgbs.data[rgbs.width*(4*y)+1+(4*x)] = val;
      rgbs.data[rgbs.width*(4*y)+2+(4*x)] = val;
    }
    _SET_ALL_PIX_RGB(rgbs, x, y, R, G, B )
    {
      rgbs.data[rgbs.width*(4*y)+0+(4*x)] = R;
      rgbs.data[rgbs.width*(4*y)+1+(4*x)] = G;
      rgbs.data[rgbs.width*(4*y)+2+(4*x)] = B;
    }

    _GET_ALL_PIX(rgbs, x, y)
    {
      return [
        rgbs.data[rgbs.width*(4*y)+0+(4*x)],
        rgbs.data[rgbs.width*(4*y)+1+(4*x)],
        rgbs.data[rgbs.width*(4*y)+2+(4*x)],
      ];
    }

    _GET_INDEX(DATA, X, Y)
    {
      if(X >= DATA.width || X < 0 || Y < 0 || Y >= DATA.height)
        return false;
      return (DATA.width * Y + X);
    }
    _GET_NEIGHBOURS_PIX_SKIP_EDGE(DATA, _X, _Y)
    {
      let ARR = [];
      for(let Y=-1; Y<2; Y++)
      {
        for(let X=-1; X<2; X++)
        {
          if(this._GET_INDEX(DATA, _X + X, _Y + Y) === false)
            ARR.push(0);
          else
            ARR.push(this._GET_PIX(DATA, _X + X, _Y + Y, 0));
        }
      }
      return ARR;
    }
    _GET_NEIGHBOURS_PIX_SKIP_EDGE_RGB(DATA, _X, _Y)
    {
      let ARR = [];
      for(let Y=-1; Y<2; Y++)
      {
        for(let X=-1; X<2; X++)
        {
          // if(this._GET_INDEX(DATA, _X + X, _Y + Y) === false)
          //   ARR.push(
          //     {
          //       R: 0,
          //       G: 0,
          //       B: 0
          //     });
          // else
          ARR.push(this._GET_ALL_PIX_RGB(DATA, (_X+X), (_Y+Y)));
        }
      }
      return ARR;
    }
    _GET_DIRECTION(DATA, _X, _Y)
    {
      let ARR = [];
      for(let Y=-1; Y<2; Y++)
      {
        for(let X=-1; X<2; X++)
        {
          if(this._GET_INDEX(DATA, _X + X, _Y + Y) === false)
            ARR.push(0);
          else
            ARR.push(this._GET_PIX(DATA, _X + X, _Y + Y, 0));
        }
      }
      let VERTICAL = (ARR[1] + ARR[7])/2;
      let HORIZONTAL = (ARR[3] + ARR[5])/2;
      let DIAGONAL_LEFT = (ARR[0] + ARR[8])/2;
      let DIAGONAL_RIGHT = (ARR[2] + ARR[6])/2;
      let DIRECTION = { VAL: VERTICAL, D: "V", INDEX: this._GET_INDEX(DATA, _X, _Y) };

      if(HORIZONTAL > DIRECTION.VAL)
      {
        DIRECTION.VAL = HORIZONTAL;
        DIRECTION.D = "H";
      }
      if(DIAGONAL_LEFT > DIRECTION.VAL)
      {
        DIRECTION.VAL = DIAGONAL_LEFT;
        DIRECTION.D = "DL";
      }
      if(DIAGONAL_RIGHT > DIRECTION.VAL)
      {
        DIRECTION.VAL = DIAGONAL_RIGHT;
        DIRECTION.D = "DR";
      }
      return DIRECTION.D;


    }
    _GET_NEIGHBOURS_PIXEL(DATA, POINT)
    {
      let ARR = [];
      for(let Y=-1; Y<2; Y++)
      {
        for(let X=-1; X<2; X++)
        {
          if(this._GET_INDEX(DATA, POINT.X + X, POINT.Y + Y) === false)
            ARR.push(-1);
          else
            ARR.push(this._GET_INDEX(DATA, POINT.X +X, POINT.Y + Y));
        }
      }
      return ARR;
    }
    _IS_EDGE(DATA, _X , _Y)
    {
      for(let Y=-1; Y<2; Y++)
      {
        for(let X=-1; X<2; X++)
        {
          if(this._GET_PIX(DATA, X+_X, Y+_Y, 0) === 0)
            return true;
        }
      }
      return false;
    }
    _GET_AXIS(DATA, INDEX)
    {
      let PIXEL = 
      {
        X:0,
        Y:0,
        INDEX:0
      };
      PIXEL.X = INDEX%DATA.width;
      let counter = 0;
      let QUOTIENT = DATA.width;
      while(QUOTIENT <= INDEX)
      {
        QUOTIENT += DATA.width;
        counter++;
      }
      PIXEL.Y = counter;
      PIXEL.INDEX = this._GET_INDEX(DATA, PIXEL.X, PIXEL.Y);
      return PIXEL;
    }

    _IS_CORNER_PIXEL(DATA, POINT)
    {
      for(let Y=-1; Y<2; Y++)
      {
        for(let X=-1; X<2; X++)
        {
          if(this._GET_INDEX(DATA, (POINT.X + X), (POINT.Y + Y)) === false)
            return true;
        }
      }
      return false;
    }

    _IS_EDGE_PIXEL(DATA, POINT, AVG, DIFF)
    {
      for(let Y=-1; Y<2; Y++)
      {
        for(let X=-1; X<2; X++)
        {
          if(X + POINT.X < 0 || Y + POINT.Y < 0)  continue;

          let INTENSITY = this._GETPIX(DATA, X + POINT.X, Y + POINT.Y, 0);
          if(Math.abs(INTENSITY - AVG) > DIFF)
            return true;
        }
      }
      return false;
    }
    
  _INDEX_TO_PIXELS(IMG, POINT)
  {
    let PIXELS = [];
    for(let i=0; i<POINT.length; i++)
    {
      let COORDS = this._POINT_INFO(IMG, POINT[i]);
      PIXELS.push(this._GETPIX(IMG, COORDS.X, COORDS.Y, 0));
    }
    return PIXELS;
  }
  _GET_SOBEL_FILTERS()
  {
      let OBJECT = 
      {
          GX : [-1,0,+1,  -2,0,+2,  -1,0,+1],
          GY:  [-1,-2,-1,  0,0,0, +1,+2,+1],
          GA:  [0,1,2,  -1,0,+1,  -2,-1,0],
          GB:  [-2,-1,0,  -1,0,1,  0,1,2]
      }
    return OBJECT;
  }
  _MULTIPLY_ARR_ARR(ARR1, ARR2)
  {
    let VAL = 0;
    for(let i=0; i<9; i++)
    {
      VAL += (ARR1[i] * ARR2[i]);
    }
    return (VAL/9);
  }
  _MULTIPLY_OBJECT_ARR(OBJECT_ARR, ARR2)
  {
    let OBJECT =
    {
      GX: 0,
      GY: 0,
      GA: 0,
      GB: 0
    }
    for(let i=0; i<9; i++)
    {
      OBJECT.GX += (OBJECT_ARR.GX[i] * ARR2[i]);
      OBJECT.GY += (OBJECT_ARR.GY[i] * ARR2[i]);
      OBJECT.GA += (OBJECT_ARR.GA[i] * ARR2[i]);
      OBJECT.GB += (OBJECT_ARR.GB[i] * ARR2[i]);
    }
    OBJECT.GX = OBJECT.GX/9;
    OBJECT.GY = OBJECT.GY/9;
    OBJECT.GA = OBJECT.GA/9;
    OBJECT.GB = OBJECT.GB/9;

    return OBJECT;
  }
  _MULTIPLY_OBJECT_ARR_RGB(OBJECT_ARR, ARR2)
  {
    let OBJECT =
    {
      GX: { R: 0, G: 0, B: 0 },
      GY: { R: 0, G: 0, B: 0 },
      GA: { R: 0, G: 0, B: 0 },
      GB: { R: 0, G: 0, B: 0 }
    }
    for(let i=0; i<9; i++)
    {
      OBJECT.GX.R += (OBJECT_ARR.GX[i] * ARR2[i].R);
      OBJECT.GX.G += (OBJECT_ARR.GX[i] * ARR2[i].G);
      OBJECT.GX.B += (OBJECT_ARR.GX[i] * ARR2[i].B);

      OBJECT.GY.R += (OBJECT_ARR.GY[i] * ARR2[i].R);
      OBJECT.GY.G += (OBJECT_ARR.GY[i] * ARR2[i].G);
      OBJECT.GY.B += (OBJECT_ARR.GY[i] * ARR2[i].B);

      OBJECT.GA.R += (OBJECT_ARR.GA[i] * ARR2[i].R);
      OBJECT.GA.G += (OBJECT_ARR.GA[i] * ARR2[i].G);
      OBJECT.GA.B += (OBJECT_ARR.GA[i] * ARR2[i].B);

      OBJECT.GB.R += (OBJECT_ARR.GB[i] * ARR2[i].R);
      OBJECT.GB.G += (OBJECT_ARR.GB[i] * ARR2[i].G);
      OBJECT.GB.B += (OBJECT_ARR.GB[i] * ARR2[i].B);
    }
    OBJECT.GX.R = OBJECT.GX.R/9; OBJECT.GX.G = OBJECT.GX.G/9; OBJECT.GX.B = OBJECT.GX.B/9;
    OBJECT.GY.R = OBJECT.GY.R/9;  OBJECT.GY.G = OBJECT.GY.G/9;  OBJECT.GY.B = OBJECT.GY.B/9;
    OBJECT.GA.R = OBJECT.GA.R/9;  OBJECT.GA.G = OBJECT.GA.G/9;  OBJECT.GA.B = OBJECT.GA.B/9;
    OBJECT.GB.R = OBJECT.GB.R/9;  OBJECT.GB.G = OBJECT.GB.G/9;  OBJECT.GB.B = OBJECT.GB.B/9;

    return OBJECT;
  }

  _FIND_MAGNITUDE(OBJECT)
  {
    return Math.sqrt(Math.pow(OBJECT.GX, 2) + Math.pow(OBJECT.GY, 2) + Math.pow(OBJECT.GA, 2) + Math.pow(OBJECT.GB, 2) , 2);
  }
  _FIND_MAGNITUDE_ALL(OBJECT)
  {
    return Math.sqrt(Math.pow(OBJECT.GX, 2) + Math.pow(OBJECT.GY, 2) + Math.pow(OBJECT.GA, 2) + Math.pow(OBJECT.GB, 2) , 2);
  }
  _FIND_MAGNITUDE_RGB(OBJECT)
  {
    return Math.sqrt((Math.pow(OBJECT.GX.R, 2) + Math.pow(OBJECT.GY.R,2) + Math.pow(OBJECT.GA.R,2) + Math.pow(OBJECT.GB.R,2)) + 
                    (Math.pow(OBJECT.GX.G, 2) + Math.pow(OBJECT.GY.G,2) + Math.pow(OBJECT.GA.G,2) + Math.pow(OBJECT.GB.G,2)) + 
                    (Math.pow(OBJECT.GX.B, 2) + Math.pow(OBJECT.GY.B,2) + Math.pow(OBJECT.GA.B,2) + Math.pow(OBJECT.GB.B,2)) , 2);
  }
  _FIND_DIRECTION(OBJECT)
  {
    return Math.atan(OBJECT.GY / OBJECT.GX);
  }

  _FIND_MAGNITUDE__(GX, GY)
  {
    return Math.sqrt(Math.pow(GX, 2) + Math.pow(GY, 2) , 2);
  }
}