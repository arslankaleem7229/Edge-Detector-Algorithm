class HtmlRender
{
    constructor()
    {

    }
    _NOPARAMS(IMG, ORGINAL)
    {
      let COUNTER = 0;
      let TEXT = "";
      TEXT += "<tr>";
      for(let y=0; y<IMG.height; y++)
      {
        for(let x=0; x<IMG.width; x++)
        {
          let R = __P._GET_PIX(IMG, x, y, 0);
          let G = __P._GET_PIX(IMG, x, y, 1);
          let B = __P._GET_PIX(IMG, x, y, 2);
          let VAL = __P._GET_PIX(ORGINAL, x, y, 0);
          let VAL1 = __P._GET_PIX(ORGINAL, x, y, 1);
          let VAL2 = __P._GET_PIX(ORGINAL, x, y, 2);
          let COLOR = `rgb(${R},${G},${B})`;

          // TEXT += `<td style=background-color:${COLOR}>${VAL} <br>${x}, ${y} (${COUNTER})</td>`;
          // TEXT += `<td style=background-color:${COLOR}>${VAL1} <br>${x}, ${y} </td>`;
          // TEXT += `<td style=background-color:${COLOR}>${MAIN._AVGFINDER([R, G, B])} <br>${x}, ${y} ${COUNTER}</td>`;
          // TEXT += `<td style=background-color:${COLOR}>${MAIN._AVGFINDER([R, G, B])}</td>`;
          TEXT += `<td style=background-color:${COLOR}>${VAL1}</td>`;
          COUNTER++;  
        }
        TEXT += "</tr><tr>";
      }
      TEXT += "</tr>";
      this._CREATEELEM(TEXT);
    }
    _DIRECTIONS(IMG, ORGINAL, DIRECTIONS)
    {
      let COUNTER = 0;
      let TEXT = "";
      TEXT += "<tr>";
      for(let y=0; y<IMG.height; y++)
      {
        for(let x=0; x<IMG.width; x++)
        {
          let R = __P._GET_PIX(IMG, x, y, 0);
          let G = __P._GET_PIX(IMG, x, y, 1);
          let B = __P._GET_PIX(IMG, x, y, 2);
          let VAL = __P._GET_PIX(ORGINAL, x, y, 1);
          let COLOR = `rgb(${R},${G},${B})`;

          // TEXT += `<td style=background-color:${COLOR}>${VAL}</td>`;
          TEXT += `<td style=background-color:${COLOR}>${VAL} <br>${x}, ${y} (${COUNTER}) ${DIRECTIONS[COUNTER]}</td>`;
          COUNTER++;  
        }
        TEXT += "</tr><tr>";
      }
      TEXT += "</tr>";
      this._CREATEELEM(TEXT);
    }

    _DIRECTIONS_TWO(IMG, ORGINAL, DIRECTIONS, DIRECTIONS_GRAYSCALE)
    {
      let COUNTER = 0;
      let TEXT = "";
      TEXT += "<tr>";
      for(let y=0; y<IMG.height; y++)
      {
        for(let x=0; x<IMG.width; x++)
        {
          let R = __P._GET_PIX(IMG, x, y, 0);
          let G = __P._GET_PIX(IMG, x, y, 1);
          let B = __P._GET_PIX(IMG, x, y, 2);
          let VAL = __P._GET_PIX(ORGINAL, x, y, 1);
          let COLOR = `rgb(${R},${G},${B})`;

          // TEXT += `<td style=background-color:${COLOR}>${VAL}</td>`;
          TEXT += `<td style=background-color:${COLOR}>${VAL} <br>${x}, ${y} (${COUNTER}) ${DIRECTIONS[COUNTER]}, ${DIRECTIONS_GRAYSCALE[COUNTER]}</td>`;
          COUNTER++;  
        }
        TEXT += "</tr><tr>";
      }
      TEXT += "</tr>";
      this._CREATEELEM(TEXT);
    }

    _CREATEELEM(DATA) 
    {
      let TABLE = document.getElementById('OUTPUT');
      TABLE.innerHTML = DATA;
      document.body.appendChild(TABLE);
    }
}