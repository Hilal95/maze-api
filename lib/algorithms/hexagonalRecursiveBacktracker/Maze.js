const { HexCell } = require('./Cell');

const directions = [
  'n',
  's',
  'ne', 
  'se',
  'nw', 
  'sw',
];
const directionOffsets = {
  n: { x: 0, y: +2 },
  s: { x: 0, y: -2 },
  ne: { x: +1, y: +1 }, 
  se: { x: +1, y: -1 },
  nw: { x: -1, y: +1 }, 
  sw: { x: -1, y: -1 },
};
const oppositeDirections = {
  n: 's',
  s: 'n',
  ne: 'sw',
  se: 'nw',
  nw: 'se',
  sw: 'ne',
};


class HexMaze {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.maxX = w;   /* min X index is 1 */
    this.maxY = h * 2;   /* min y index is 1 */
    this.makeCells();

    // this.active = [];
    // this.makeMaze();
  }

  makeCells() {
    this.cells = [];
    
    for(let xIndex = 1; xIndex <= this.maxX; xIndex++) {
      this.cells[xIndex] = [];

      for(let yIndex = 1; yIndex <= this.maxY; yIndex += 2) {
        const y = isEven(xIndex) ? yIndex + 1 : yIndex;
        this.cells[xIndex][y] = new HexCell(xIndex, y);
      }
    }
  }

  makeMaze() {
    const startX = Math.floor(Math.random() * this.maxX) + 1;
    const startY = Math.floor(Math.random() * this.maxY) + 1;

    let currentCell = this.getCell(startX, startY);
    if(!currentCell) currentCell = this.getCell(startX, startY + 1);
    if(!currentCell) currentCell = this.getCell(startX, startY - 1);
    if(!currentCell) throw `Exception: the starting point ${startX}, ${startY} is invalid for this maze.`;

    currentCell.visited = true;
    this.active.push(currentCell);
    this.recurseMaze();
  }

  recurseMaze() {
    while(this.active.length > 0) {
      let currentCell = this.active[this.active.length - 1];

      const potentialDirections = this.getCellDirections(currentCell.x, currentCell.y);
      const validDirections = potentialDirections.filter(dir => {
        return (this.getCell(currentCell.x + directionOffsets[dir].x, currentCell.y + directionOffsets[dir].y).visited === false);
      });

      if(validDirections.length < 1) {
        this.active.pop();
      } 
      else {
        const randomNumber = Math.floor(Math.random() * validDirections.length);
        const randomDirection = validDirections[randomNumber];
        const newCell = this.getCell(currentCell.x + directionOffsets[randomDirection].x, currentCell.y + directionOffsets[randomDirection].y);

        if(!newCell) throw 'Exception: internal error';

        currentCell.makeExit(randomDirection, newCell);
        newCell.makeExit(oppositeDirections[randomDirection], currentCell);
        newCell.visited = true;
        this.active.push(newCell);
      }

      this.recurseMaze();
    }
  }

  getCell(x, y) {
    if(!this.cells[x] || !this.cells[x][y]) return null;

    return this.cells[x][y];
  }

  getCellDirections(x, y) {
    const cell = this.getCell(x, y);
    if(!cell) return null;

    return directions.filter(dir => {
      return this.getCell(x + directionOffsets[dir].x, y + directionOffsets[dir].y);
    });

    // sample return value = {
    //   n: { x: 0, y: +2 },
    //   s: { x: 0, y: -2 },
    //   ne: { x: +1, y: +1 }, 
    //   se: { x: +1, y: -1 },
    //   nw: { x: -1, y: +1 }, 
    //   sw: { x: -1, y: -1 },
    // };
  }

  printCells() {
    let output = '';

    for(let yIndex = 2 * (this.h + 1); yIndex >= 0; yIndex--) {
      
      for(let xIndex = 0; xIndex <= this.w + 1; xIndex++) {
        const cellSW = this.getCell(xIndex, yIndex);
        const cellNE = this.getCell(xIndex + 1, yIndex + 1);
        output += (cellSW) ? cellSW.toString(this.w, this.h).topString : '';
        output += (cellNE) ? cellNE.toString(this.w, this.h).botString : '';

        // if(cellSW) console.log('top: ', cellSW.x, cellSW.y);
        // if(cellNE) console.log('bot: ', cellNE.x, cellNE.y);
        
      }
      output += '\n';
    }
    return output;
  }


  traverseCells(helper) {
    this.cells.forEach(col => col.forEach(cell => helper(cell)));
  }

}

const isEven = num => (num % 2) ? false : true;

module.exports = {
  HexMaze
};