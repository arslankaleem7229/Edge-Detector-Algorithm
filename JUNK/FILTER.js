class Filter
{
    constructor() 
    {
    }
    _GRAYSCALE(ORIGINAL) 
    {
        let DUPLICATE = __P._DUPLICATE(ORIGINAL);
        let RGB = DUPLICATE.data;
        for (let i = 0; i < RGB.length; i += 4) 
        {
            let r = RGB[i];
            let g = RGB[i + 1];
            let b = RGB[i + 2];

            let v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            RGB[i] = RGB[i + 1] = RGB[i + 2] = v;
        }
        return DUPLICATE;
    }
   
    _GUSSIAN_BLUR_RGB(ORIGINAL)
    {
        let DUPLICATE = __P._DUPLICATE(ORIGINAL);
        let FILTER = [1,4,7,4,1,  4,16,26,16,4,  7,26,41,26,7,   4,16,26,16,4,  1,4,7,4,1];
        // FILTER = [1,2,1,  2,4,2,  1,2,1];
        // MEAN = 16;
        for(let Y=2; Y<ORIGINAL.height-2; Y++)
        {
            for(let X=2; X<ORIGINAL.width-2; X++)
            {
                let NEIGHBOURS = this._NEIGHBOURS_RGB(DUPLICATE, X, Y);
                let NEW_PIXEL = this._MULTIPLY_ARR_ARR_RGB(NEIGHBOURS, FILTER);
                __P._SET_ALL_PIX_RGB(DUPLICATE, X, Y, NEW_PIXEL.R, NEW_PIXEL.G, NEW_PIXEL.B);
            }
        }
        return DUPLICATE;
    }

   
    _NEIGHBOURS_RGB(DATA, _X, _Y)
    {
        let ARR = [];
        for(let Y=-2; Y<3; Y++)
        {
          for(let X=-2; X<3; X++)
          {
            // if(__P._GET_INDEX(DATA, _X + X, _Y + Y) === false)
            //   ARR.push(0);
            // else
            ARR.push(__P._GET_ALL_PIX_RGB(DATA, (_X+X), (_Y+Y)));
          }
        }
        return ARR;
    }
    _MULTIPLY_ARR_ARR_RGB(ARR1, ARR2)
    {
        let MEAN = 273;
        let VAL = 
        {
            R: 0,
            G: 0,
            B: 0,
        };
        for(let i=0; i<25; i++)
        {
        VAL.R += (ARR1[i].R * ARR2[i]);
        VAL.G += (ARR1[i].G * ARR2[i]);
        VAL.B += (ARR1[i].B * ARR2[i]);
        }
        VAL.R = VAL.R/MEAN;
        VAL.G = VAL.G/MEAN;
        VAL.B = VAL.B/MEAN;
        return (VAL);
    }

    _GUSSIAN_BLUR_RGB2(ORIGINAL)
    {
        let DUPLICATE = __P._DUPLICATE(ORIGINAL);
        let FILTER = [1,2,1,  2,4,2,  1,2,1];
        for(let Y=1; Y<ORIGINAL.height-1; Y++)
        {
            for(let X=1; X<ORIGINAL.width-1; X++)
            {
                let NEIGHBOURS = this._NEIGHBOURS_RGB2(DUPLICATE, X, Y);
                let NEW_PIXEL = this._MULTIPLY_ARR_ARR_RGB2(NEIGHBOURS, FILTER);
                __P._SET_ALL_PIX_RGB(DUPLICATE, X, Y, NEW_PIXEL.R, NEW_PIXEL.G, NEW_PIXEL.B);
            }
        }
        return DUPLICATE;
    }

   
    _NEIGHBOURS_RGB2(DATA, _X, _Y)
    {
        let ARR = [];
        for(let Y=-1; Y<2; Y++)
        {
          for(let X=-1; X<2; X++)
          {
            // if(__P._GET_INDEX(DATA, _X + X, _Y + Y) === false)
            //   ARR.push(0);
            // else
            ARR.push(__P._GET_ALL_PIX_RGB(DATA, (_X+X), (_Y+Y)));
          }
        }
        return ARR;
    }
    _MULTIPLY_ARR_ARR_RGB2(ARR1, ARR2)
    {
        let MEAN = 16;
        let VAL = 
        {
            R: 0,
            G: 0,
            B: 0,
        };
        for(let i=0; i<9; i++)
        {
        VAL.R += (ARR1[i].R * ARR2[i]);
        VAL.G += (ARR1[i].G * ARR2[i]);
        VAL.B += (ARR1[i].B * ARR2[i]);
        }
        VAL.R = VAL.R/MEAN;
        VAL.G = VAL.G/MEAN;
        VAL.B = VAL.B/MEAN;
        return (VAL);
    }
























    _GUSSIAN_BLUR(ORIGINAL)
    {
        let DUPLICATE = __P._DUPLICATE(ORIGINAL);
        let FILTER = [1,4,7,4,1,  4,16,26,16,4,  7,26,41,26,7,   4,16,26,16,4,  1,4,7,4,1];
        // FILTER = [1,2,1,  2,4,2,  1,2,1];
        let MEAN = 273;
        // MEAN = 16;
        for(let Y=2; Y<DUPLICATE.height-2; Y++)
        {
            for(let X=2; X<DUPLICATE.width-2; X++)
            {
                let NEIGHBOURS = this._NEIGHBOURS(DUPLICATE, X, Y);
                let NEW_PIXEL = this._MULTIPLY_ARR_ARR(NEIGHBOURS, FILTER, MEAN);
                __P._SET_ALL_PIX(DUPLICATE, X, Y, NEW_PIXEL);
            }
        }
        return DUPLICATE;
    }









    _MULTIPLY_ARR_ARR(ARR1, ARR2, MEAN)
    {
        let VAL = 0;
        for(let i=0; i<25; i++)
        {
        VAL += (ARR1[i] * ARR2[i]);
        }
        return (VAL/MEAN);
    }

    _NEIGHBOURS(DATA, _X, _Y)
    {
        let ARR = [];
        for(let Y=-2; Y<3; Y++)
        {
          for(let X=-2; X<3; X++)
          {
            if(__P._GET_INDEX(DATA, _X + X, _Y + Y) === false)
              ARR.push(0);
            else
              ARR.push(__P._GET_PIX(DATA, _X + X, _Y + Y, 0));
          }
        }
        return ARR;
    }





}
const FILTER = new Filter();
