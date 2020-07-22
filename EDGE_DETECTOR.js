const __P = new IMG_FUNCTIONS();
const __HTML = new HtmlRender();
const __F = new Filter();
let __O = null;
    
class EDGE_DETECTOR
{
    constructor() 
    {
        __P._IMAGE_LOAD('IMAGES/2c1f86c487b924c58d5b2f9de89efff3.jpg', (DATA) => 
        {           
            let COLOR = 
            [
                { R: 244, G:66, B:212 },
                { R: 66, G:134, B:244 },
                { R: 244, G:66, B:66 },
                { R: 232, G:244, B:66 },
                { R: 107, G:244, B:66 }

            ];
            this._DETECT_EDGES02(DATA, COLOR);
            // this._DETECT_EDGES(DATA, COLOR);
        });
    }

    _DETECT_EDGES02(DATA)
    {
        __O = __P._DUPLICATE(DATA);
        let ORIGINAL = __P._DUPLICATE(DATA);
        __P._APPEND_CANVAS(ORIGINAL);
        ORIGINAL = __F._GUSSIAN_BLUR_RGB2(ORIGINAL);
        let FILTERS = __P._GET_SOBEL_FILTERS();
        let DUPLICATE = __P._DUPLICATE(ORIGINAL);
        let SUM = 0;
        for(let Y=1; Y<ORIGINAL.height-1; Y++)
        {
            for(let X=1; X<ORIGINAL.width-1; X++)
            {
                let MATRIX = __P._GET_NEIGHBOURS_PIX_SKIP_EDGE_RGB(ORIGINAL, X, Y);
                let OBJECT = __P._MULTIPLY_OBJECT_ARR_RGB(FILTERS, MATRIX);
                let MAGNITUDE = __P._FIND_MAGNITUDE_RGB(OBJECT);
                SUM += MAGNITUDE;
                if(MAGNITUDE < 35.68538210241623)
                    __P._SET_ALL_PIX(DUPLICATE, X, Y, 0);
                else
                    __P._SET_ALL_PIX(DUPLICATE, X, Y, 255);
            }
        }        
        console.log(SUM, (SUM/ORIGINAL.data.length)*10);
        __P._APPEND_CANVAS(ORIGINAL);
        __P._APPEND_CANVAS(DUPLICATE);
        // this._THIN_EDGES(DUPLICATE);
        // __HTML._NOPARAMS(DUPLICATE, DUPLICATE);
        // this._CANNY(DUPLICATE);
        // this.B1(DUPLICATE);
    }
    _CANNY(IMG_DATA)
    {
        let DUP = __P._DUPLICATE(IMG_DATA);
        let WHITE_PIXELS =
        {
            X:[], Y: []
        };
        for(let Y=1; Y<IMG_DATA.height-1; Y++)
        {
            for(let X=1; X<IMG_DATA.width-1; X++)
            {
                if(__P._GET_PIX(IMG_DATA, X, Y, 0) == 0) continue;
                let _M = 
                {
                    _0: __P._GET_PIX(IMG_DATA, X-1, Y-1, 0),
                    _1: __P._GET_PIX(IMG_DATA, X, Y-1, 0),
                    _2: __P._GET_PIX(IMG_DATA, X+1, Y-1, 0),
                    _3: __P._GET_PIX(IMG_DATA, X-1, Y, 0),
                    _4: __P._GET_PIX(IMG_DATA, X, Y, 0),
                    _5: __P._GET_PIX(IMG_DATA, X+1, Y, 0),
                    _6: __P._GET_PIX(IMG_DATA, X-1, Y+1, 0),
                    _7: __P._GET_PIX(IMG_DATA, X, Y+1, 0),
                    _8: __P._GET_PIX(IMG_DATA, X+1, Y+1, 0)
                }; 
                if(((_M._3 >= _M._5 && _M._6 >= _M._2 && _M._7 >= _M._1) ||
                   (_M._3 <= _M._5 && _M._6 <= _M._2 && _M._7 <= _M._1)) &&
                   (_M._4 >= _M._6 && _M._4 >= _M._2))
                {
                    __P._SET_ALL_PIX(DUP, X, Y, 255)
                }
                else if(((_M._0 >= _M._8 && _M._1 >= _M._7 && _M._3 >= _M._5) ||
                         (_M._0 <= _M._8 && _M._1 <= _M._7 && _M._3 <= _M._5)) &&
                         (_M._4 >= _M._0 && _M._4 >= _M._8))
                {
                    __P._SET_ALL_PIX(DUP, X, Y, 255)
                }
                else if((_M._0 > _M._6 && _M._8 > _M._2) &&
                        (_M._4 > _M._6 && _M._4 > _M._2))
                {
                    __P._SET_ALL_PIX(DUP, X, Y, 255)
                }
                else if((_M._6 > _M._0 && _M._2 < _M._8) &&
                        (_M._4 > _M._0 && _M._4 > _M._8))
                {
                    __P._SET_ALL_PIX(DUP, X, Y, 255)
                }
                else if(((_M._0 >= _M._6 && _M._1 >= _M._7 && _M._2 >= _M._8) ||
                         (_M._0 <= _M._6 && _M._1 <= _M._7 && _M._2 <= _M._8)) &&
                         (_M._4 > _M._1 && _M._4 > _M._7))
                {
                    __P._SET_ALL_PIX(DUP, X, Y, 255);
                }
                else if(((_M._0 >= _M._2 && _M._3 >= _M._5 && _M._6 >= _M._8) ||
                        (_M._0 <= _M._2 && _M._3 <= _M._5 && _M._6 <= _M._8)) &&
                        (_M._4 > _M._3 && _M._4 > _M._5))
                {
                    __P._SET_ALL_PIX(DUP, X, Y, 255);
                }
                else
                {
                    let MAX =
                    {
                        DIR: _M._0 + _M._8,
                        LABEL: 'DL'                           
                    };
                    let DIRS =
                    [
                        {
                            DIR: _M._3 + _M._5,
                            LABEL: 'H'
                        },
                        {
                            DIR: _M._1 + _M._7,
                            LABEL: 'V'
                        },
                        {
                            DIR: _M._2 + _M._6,
                            LABEL: 'DR'
                        },
                    ];
                    for(let i=0; i<DIRS.length; i++)
                    {
                        if(DIRS[i].DIR > MAX.DIR)
                        {
                            MAX.DIR = DIRS[i].DIR;
                            MAX.LABEL = DIRS[i].LABEL;
                        }
                    }
                    let POINTS = {P1:0, P2:0};

                    if(MAX.LABEL == 'H')
                    {
                        POINTS.P1 = _M._1;
                        POINTS.P2 = _M._7;
                    }
                    else if(MAX.LABEL == 'V')
                    {
                        POINTS.P1 = _M._3;
                        POINTS.P2 = _M._5;
                    }
                    else if(MAX.LABEL == 'DL')
                    {
                        POINTS.P1 = _M._2;
                        POINTS.P2 = _M._6;
                    }
                    else if(MAX.LABEL == 'DR')
                    {
                        POINTS.P1 = _M._0;
                        POINTS.P2 = _M._8;
                    }

                    if(_M._4 > POINTS.P1 && _M._4 > POINTS.P2)
                    {
                        __P._SET_ALL_PIX(DUP, X, Y, 255);
                    }
                    else
                        __P._SET_ALL_PIX(DUP, X, Y, 0);
                }
                if(__P._GET_PIX(DUP, X, Y, 0) == 255) 
                {
                    WHITE_PIXELS.X.push(X);
                    WHITE_PIXELS.Y.push(Y);
                }

            }
        }
        // __HTML._NOPARAMS(DUP, IMG_DATA);
        __P._APPEND_CANVAS(DUP);
        let NEW_DUP = this._INITIAL_CLEAN(DUP, WHITE_PIXELS);
        let c = 1;
        let OLD_COUNT = 0, NEW_COUNT = -1;
        while(true)
        {
            OLD_COUNT = NEW_COUNT;
            NEW_DUP = this._REMOVE_NOISE(NEW_DUP.DUP, NEW_DUP.WHITE_PIX, c);
            NEW_COUNT = NEW_DUP.C;
            if(NEW_COUNT == OLD_COUNT)
                break;
            c++;    
        }
        let OBJ = 
        {
            EDGES: NEW_DUP.EDGE_PIX,
            COUNT: c,
            IMG_DATA: NEW_DUP.DUP
        }
        this._REVERT_CLEAN(OBJ);
        
    }
    _REVERT_CLEAN(OBJ)
    {
        while(OBJ.COUNT > 0)
        {
            OBJ.COUNT--;
            let NEW_EDGES = { X:[], Y: [] };
            for(let i=0; i<OBJ.EDGES.X.length; i++)
            {
                let X = OBJ.EDGES.X[i];
                let Y = OBJ.EDGES.Y[i];
                if(OBJ.COUNT == 0)
                {
                    __P._SET_PIX(OBJ.IMG_DATA, X, Y, 0, 255);
                    __P._SET_PIX(OBJ.IMG_DATA, X, Y, 1, 0);
                    __P._SET_PIX(OBJ.IMG_DATA, X, Y, 2, 0);
                }   
                else             
                    __P._SET_ALL_PIX(OBJ.IMG_DATA, X, Y, 255);
                // __P._SET_PIX(OBJ.IMG_DATA, X, Y, 0, 100);
                // __P._SET_PIX(OBJ.IMG_DATA, X, Y, 2, 0);
                let _M = 
                {
                    _0: __P._GET_PIX(OBJ.IMG_DATA, X-1, Y-1, 1),
                    _1: __P._GET_PIX(OBJ.IMG_DATA, X,   Y-1, 1),
                    _2: __P._GET_PIX(OBJ.IMG_DATA, X+1, Y-1, 1),
                    _3: __P._GET_PIX(OBJ.IMG_DATA, X-1, Y, 1),
                    _4: __P._GET_PIX(OBJ.IMG_DATA, X,   Y, 1),
                    _5: __P._GET_PIX(OBJ.IMG_DATA, X+1, Y, 1),
                    _6: __P._GET_PIX(OBJ.IMG_DATA, X-1, Y+1, 1),
                    _7: __P._GET_PIX(OBJ.IMG_DATA, X,   Y+1, 1),
                    _8: __P._GET_PIX(OBJ.IMG_DATA, X+1, Y+1, 1)
                };
                if(_M._0 == OBJ.COUNT)
                {
                    NEW_EDGES.X.push(X-1);
                    NEW_EDGES.Y.push(Y-1);
                }
                else if(_M._1 == OBJ.COUNT)
                {
                    NEW_EDGES.X.push(X);
                    NEW_EDGES.Y.push(Y-1);
                }
                else if(_M._2 == OBJ.COUNT)
                {
                    NEW_EDGES.X.push(X+1);
                    NEW_EDGES.Y.push(Y-1);
                }
                else if(_M._3 == OBJ.COUNT)
                {
                    NEW_EDGES.X.push(X-1);
                    NEW_EDGES.Y.push(Y);
                }
                else if(_M._5 == OBJ.COUNT)
                {
                    NEW_EDGES.X.push(X+1);
                    NEW_EDGES.Y.push(Y);
                }
                else if(_M._6 == OBJ.COUNT)
                {
                    NEW_EDGES.X.push(X-1);
                    NEW_EDGES.Y.push(Y+1);
                }
                else if(_M._7 == OBJ.COUNT)
                {
                    NEW_EDGES.X.push(X);
                    NEW_EDGES.Y.push(Y+1);
                }
                else if(_M._8 == OBJ.COUNT)
                {
                    NEW_EDGES.X.push(X+1);
                    NEW_EDGES.Y.push(Y+1);
                }
            }

            OBJ.EDGES = NEW_EDGES;
            console.log(OBJ.EDGES, NEW_EDGES, OBJ.COUNT, 'EDGESSS');
    
        }
        __P._APPEND_CANVAS(OBJ.IMG_DATA);
        // __HTML._NOPARAMS(OBJ.IMG_DATA, OBJ.IMG_DATA);
        for(let Y=1; Y<OBJ.IMG_DATA.height-1; Y++)
        {
            for(let X=1; X<OBJ.IMG_DATA.width-1; X++)
            {
                if(__P._GET_PIX(OBJ.IMG_DATA, X, Y, 1) == 0) continue;
                if(__P._GET_PIX(OBJ.IMG_DATA, X, Y, 1) < 255)
                    __P._SET_ALL_PIX(OBJ.IMG_DATA, X, Y, 0);
            }
        }

        let COLOR_EDGES = __P._DUPLICATE(OBJ.IMG_DATA);
        for(let Y=1; Y<OBJ.IMG_DATA.height-1; Y++)
        {
            for(let X=1; X<OBJ.IMG_DATA.width-1; X++)
            {
                if(__P._GET_PIX(OBJ.IMG_DATA, X, Y, 0) == 255) 
                {
                    let RGB = __P._GET_ALL_PIX_RGB(__O, X, Y);
                    __P._SET_ALL_PIX_RGB(COLOR_EDGES, X, Y, RGB.R, RGB.G, RGB.B);    
                }
            }
        }

        __P._APPEND_CANVAS(__O);
        __P._APPEND_CANVAS(OBJ.IMG_DATA);
        __P._APPEND_CANVAS(COLOR_EDGES);
        // __HTML._NOPARAMS(OBJ.IMG_DATA, OBJ.IMG_DATA);

    }
   
    _INITIAL_CLEAN(IMG_DATA, WHITE_PIXELS)
    {
        let DUP = __P._DUPLICATE(IMG_DATA);
        let color = 0;
        let NEW_WHITE_PIXELS =
        {
            X: [], Y: []
        }
        for(let i=0; i<WHITE_PIXELS.X.length; i++)
        {
            let _M = 
            {
                _0: __P._GET_PIX(IMG_DATA, WHITE_PIXELS.X[i]-1, WHITE_PIXELS.Y[i]-1, 0),
                _1: __P._GET_PIX(IMG_DATA, WHITE_PIXELS.X[i], WHITE_PIXELS.Y[i]-1, 0),
                _2: __P._GET_PIX(IMG_DATA, WHITE_PIXELS.X[i]+1, WHITE_PIXELS.Y[i]-1, 0),
                _3: __P._GET_PIX(IMG_DATA, WHITE_PIXELS.X[i]-1, WHITE_PIXELS.Y[i], 0),
                _4: __P._GET_PIX(IMG_DATA, WHITE_PIXELS.X[i], WHITE_PIXELS.Y[i], 0),
                _5: __P._GET_PIX(IMG_DATA, WHITE_PIXELS.X[i]+1, WHITE_PIXELS.Y[i], 0),
                _6: __P._GET_PIX(IMG_DATA, WHITE_PIXELS.X[i]-1, WHITE_PIXELS.Y[i]+1, 0),
                _7: __P._GET_PIX(IMG_DATA, WHITE_PIXELS.X[i], WHITE_PIXELS.Y[i]+1, 0),
                _8: __P._GET_PIX(IMG_DATA, WHITE_PIXELS.X[i]+1, WHITE_PIXELS.Y[i]+1, 0)
            };
            let X= WHITE_PIXELS.X[i];
            let Y= WHITE_PIXELS.Y[i];
            if((_M._1 == 0 && _M._3 == 0 && _M._5 == 0 && _M._7 == 0) && ((_M._0 + _M._6 < 256) && (_M._2 + _M._8 < 256) && (_M._0 + _M._2 < 256) && (_M._6 + _M._8 < 256) && (_M._0 + _M._8 < 256) && (_M._2 + _M._6 < 256)) )
                __P._SET_ALL_PIX(DUP, X, Y, color);
                
            else if(_M._0 == 0 && _M._1 == 0 && _M._2 == 0 && _M._3 == 0 && _M._5 == 0  && _M._6 == 255 && _M._7 == 255  && _M._8 == 255)
            __P._SET_ALL_PIX(DUP, X, Y, color);
            
            else if(_M._0 == 0 && _M._1 == 0 && _M._2 == 255 && _M._3 == 0  && _M._5 == 255  && _M._6 == 0 && _M._7 == 0  && _M._8 == 255)
                __P._SET_ALL_PIX(DUP, X, Y, color);

            else if(_M._0 == 255 && _M._1 == 255 && _M._2 == 255 && _M._3 == 0 && _M._5 == 0  && _M._6 == 0 && _M._7 == 0  && _M._8 == 0)
                __P._SET_ALL_PIX(DUP, X, Y, color);

            else if(_M._0 == 255 && _M._1 == 0 && _M._2 == 0 && _M._3 == 255  && _M._5 == 0  && _M._6 == 255 && _M._7 == 0  && _M._8 == 0)
                __P._SET_ALL_PIX(DUP, X, Y, color);

            else if(_M._0 == 255 && _M._1 == 255 && _M._2 == 0 && _M._3 == 255  && _M._5 == 0  && _M._6 == 0 && _M._7 == 0  && _M._8 == 0)
                __P._SET_ALL_PIX(DUP, X, Y, color);

            else if(_M._0 == 0 && _M._1 == 255 && _M._2 == 255 && _M._3 == 0  && _M._5 == 255  && _M._6 == 0 && _M._7 == 0  && _M._8 == 0)
                __P._SET_ALL_PIX(DUP, X, Y, color);

            else if(_M._0 == 0 && _M._1 == 0 && _M._2 == 0 && _M._3 == 0  && _M._5 == 255  && _M._6 == 0 && _M._7 == 255  && _M._8 == 255)
                __P._SET_ALL_PIX(DUP, X, Y, color);

            else if(_M._0 == 0 && _M._1 == 0 && _M._2 == 0 && _M._3 == 255 && _M._5 == 0  && _M._6 == 255 && _M._7 == 255  && _M._8 == 0)
                __P._SET_ALL_PIX(DUP, X, Y, color);
            else
            {
                __P._SET_ALL_PIX(DUP, X, Y, 255);
                NEW_WHITE_PIXELS.X.push(X);
                NEW_WHITE_PIXELS.Y.push(Y);
            }
        }
        // __P._APPEND_CANVAS(DUP);
        // __HTML._NOPARAMS(DUP, IMG_DATA);
        return { DUP, WHITE_PIX: NEW_WHITE_PIXELS };
    }
    _REMOVE_NOISE(IMG_DATA, WHITE_PIXELS, c)
    {
        let DUP = __P._DUPLICATE(IMG_DATA);
        let color = c;
        let count = 0;
        let NEW_WHITE_PIXELS =
        {
            X: [], Y: []
        }
        let EDGE_PIXS =
        {
            X: [], Y: []
        }

        for(let i=0; i< WHITE_PIXELS.X.length; i++)
        {
            let _M =
            {
                _0: __P._GET_PIX(IMG_DATA, WHITE_PIXELS.X[i]-1, WHITE_PIXELS.Y[i]-1, 0),
                _1: __P._GET_PIX(IMG_DATA, WHITE_PIXELS.X[i], WHITE_PIXELS.Y[i]-1, 0),
                _2: __P._GET_PIX(IMG_DATA, WHITE_PIXELS.X[i]+1, WHITE_PIXELS.Y[i]-1, 0),
                _3: __P._GET_PIX(IMG_DATA, WHITE_PIXELS.X[i]-1, WHITE_PIXELS.Y[i], 0),
                _4: __P._GET_PIX(IMG_DATA, WHITE_PIXELS.X[i], WHITE_PIXELS.Y[i], 0),
                _5: __P._GET_PIX(IMG_DATA, WHITE_PIXELS.X[i]+1, WHITE_PIXELS.Y[i], 0),
                _6: __P._GET_PIX(IMG_DATA, WHITE_PIXELS.X[i]-1, WHITE_PIXELS.Y[i]+1, 0),
                _7: __P._GET_PIX(IMG_DATA, WHITE_PIXELS.X[i], WHITE_PIXELS.Y[i]+1, 0),
                _8: __P._GET_PIX(IMG_DATA, WHITE_PIXELS.X[i]+1, WHITE_PIXELS.Y[i]+1, 0)
            };
            let X= WHITE_PIXELS.X[i];
            let Y= WHITE_PIXELS.Y[i];

            if(this._CHECK_NOISE(_M))
            {
                __P._SET_PIX(DUP, X, Y, 1, color);
                __P._SET_PIX(DUP, X, Y, 0, 0);
                EDGE_PIXS.X.push(X);
                EDGE_PIXS.Y.push(Y);
                count++;
            }

            else
            {
                NEW_WHITE_PIXELS.X.push(X);
                NEW_WHITE_PIXELS.Y.push(Y);
            }

        }
        __P._APPEND_CANVAS(DUP);
        let OBJ =
        {
            DUP: DUP,
            ID: IMG_DATA,
            WHITE_PIX: NEW_WHITE_PIXELS,
            EDGE_PIX: EDGE_PIXS,
            C: count
        }
        console.log(count,c , NEW_WHITE_PIXELS.X.length, WHITE_PIXELS.X.length, 'PIXEL AFFECTED');
        return OBJ;
    }




    _CHECK_NOISE(_M)
    {
        if(_M._0 == 0 && _M._1 == 0 && _M._2 == 0 && _M._3 == 0 && _M._5 == 0 && _M._7 != 0)
            return true;

        else if(_M._0 == 0 && _M._1 == 0 && _M._3 == 0 && _M._6 == 0 && _M._7 == 0 && _M._5 != 0)
            return true;
        
        else if(_M._1 == 0 && _M._2 == 0 && _M._5 == 0 && _M._7 == 0 && _M._8 == 0 && _M._3 != 0)
            return true;

        else if(_M._3 == 0 && _M._5 == 0 && _M._6 == 0 && _M._7 == 0 && _M._8 == 0 && _M._1 != 0)
            return true;

        else if(_M._0 == 0 && _M._1 == 0 && _M._2 == 0 && _M._5 == 0 && _M._8 == 0 && _M._6 != 0)
            return true;

        else if(_M._0 == 0 && _M._3 == 0 && _M._6 == 0 && _M._7 == 0 && _M._8 == 0 && _M._2 != 0)
            return true;

        else if(_M._2 == 0 && _M._5 == 0 && _M._6 == 0 && _M._7 == 0 && _M._8 == 0 && _M._0 != 0)
            return true;

        else if(_M._0 == 0 && _M._1 == 0 && _M._2 == 0 && _M._3 == 0 && _M._6 == 0 && _M._8 != 0)
            return true;

        else if(_M._0 == 0 && _M._1 == 0 && _M._2 == 0 && _M._3 == 0 && _M._5 == 0 && _M._6 == 0 && _M._7 == 0 && _M._8 == 0)
            return true;

        else if(_M._0 == 0 && _M._1 == 0 && _M._3 == 0 && _M._6 == 0 && _M._8 == 255 && _M._5 == 255 )
            return true;

        else if(_M._0 == 0 && _M._3 == 0 && _M._6 == 0 && _M._7 == 0 && _M._2 == 255  && _M._5 == 255 )
            return true;

        else if(_M._1 == 0 && _M._2 == 0 && _M._5 == 0 && _M._8 == 0 && _M._3 == 255  && _M._6 == 255 )
            return true;

        else if(_M._2 == 0 && _M._5 == 0 && _M._7 == 0 && _M._8 == 0 && _M._0 == 255  && _M._3 == 255 )
            return true;
        else 
            return false;
    }


}

const EDGE = new EDGE_DETECTOR();
