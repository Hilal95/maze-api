const { recursiveBacktracker } = require('../algorithms/recursive-backtracker');
const { growingTree } = require('../algorithms/growing-tree');
const { prims } = require('../algorithms/prims');
const { woven } = require('../algorithms/woven');
const { finalizeMaze } = require('./maze-methods/finalize-maze');

const validAlgosByCellShape = {
  'Square': ['Recursive Backtracker', 'Growing Tree', 'Prims', 'Woven'],
  'Hexagonal': ['Recursive Backtracker', 'Growing Tree', 'Prims'],
};

class Maze {
  constructor(options) {
    this.dimensions = {
      width: options.width,
      height: options.height
    };
    this.start = {
      x: options.startX,
      y: options.startY
    };
    this.end = {
      x: options.endX,
      y: options.endY
    };
    this.numCells = options.width * options.height;
    this.numLeafCells = 0;
    this.cellShape = options.cellShape;
    this.algorithm = options.algorithm;
  }

  makeMaze() {
    if(!validAlgosByCellShape[this.cellShape].includes(this.algorithm)) throw 'Exception: the chosen algorithm is not valid in combination with the cellShape input.';

    if(this.algorithm === 'Recursive Backtracker') {
      recursiveBacktracker.bind(this)();
    }
    if(this.algorithm === 'Growing Tree') {
      growingTree.bind(this)();
    }
    if(this.algorithm === 'Prims') {
      prims.bind(this)();
    }
    if(this.algorithm === 'Woven') {
      woven.bind(this)();
    }
  }

  finalizeMaze() {
    return finalizeMaze.bind(this)();
  }

  exportMazeModel() {
    return {
      cellShape: this.cellShape,
      algorithm: this.algorithm,
      dimensions: this.dimensions,
      connectivity: this.numLeafCells / this.numCells,
      averagePathLength: this.numCells / this.numLeafCells,
      start: this.start,
      end: this.end,
      solutionLength: this.solutionLength + 1,
      averageWrongPathLength: (this.numCells - this.solutionLength) / this.numLeafCells,
      solutionPath: this.solutionPath,
      cellMap: this.formattedCells(),
      displayString: this.printCells()
    };
  }

  formattedCells() {
    return this.cells.reduce((flatCells, col) => {
      const flatCol = col
        .filter(cell => cell)
        .map(cell => {
          const formattedCell = {
            coordinates: {
              x: cell.x,
              y: cell.y
            },
            exits: cell.exits
          };
          if(this.algorithm === 'Woven')
            formattedCell.overpass = cell.overpass;
          return formattedCell;
        });
      flatCells.push(...flatCol);
      return flatCells;
    }, []);
  }

  getCell(x, y) {
    if(!this.cells[x] || !this.cells[x][y]) return null;

    return this.cells[x][y];
  }

  getCellDirections(x, y) {
    const cell = this.getCell(x, y);
    if(!cell) return null;

    return this.getDirections().filter(dir => {
      return this.getCell(x + this.getDirectionOffset(dir).x, y + this.getDirectionOffset(dir).y);
    });
  }
}

module.exports = {
  Maze,
  validAlgosByCellShape
};