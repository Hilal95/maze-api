const { Maze } = require('../recursiveBacktracker/Maze');
const { Cell } = require('../recursiveBacktracker/Cell');

describe('Recursive Backtracker Maze', () => {

  const h = 10;
  const w = 10;
  const maze = new Maze(h, w);

  it('makes the proper sized maze with empty cell lists', () => {
    expect(maze.h).toBe(h);
    expect(maze.w).toBe(w);
    expect(maze.cells).toEqual([]);
    expect(maze.active).toEqual([]);
    expect(maze.visited).toEqual([]);
  });

  it('makes a width x height sized array of cells', () => {

    maze.makeCells();

    expect(maze.cells.length).toBe(h);
    expect(maze.cells.flat().length).toBe(h * w);

  });

  it('findCellsByCoords finds a cell object in array', () => {


    const cell = new Cell(1, 1);
    const arr = [cell];
    const rCell = maze.findCellByCoords(arr, 1, 1);
    expect(rCell.x).toBe(1);
    expect(rCell.y).toBe(1);

  });

  it('findCellsByCoords returns undefined if cell not found', () => {

    const cell = new Cell(1, 1);
    const arr = [cell];
    const rCell = maze.findCellByCoords(arr, 2, 1);
    expect(rCell).toBeUndefined();
  });

  it('randomDirection results in an available direction', () => {

    const newMaze = new Maze(2, 2);
    newMaze.visited.push(new Cell(1, 1));
    newMaze.cells.push(new Cell(1, 1));
    newMaze.visited.push(new Cell(1, 2));
    newMaze.cells.push(new Cell(1, 2));
    newMaze.visited.push(new Cell(2, 2));
    newMaze.cells.push(new Cell(2, 2));
    newMaze.cells.push(new Cell(2, 1));


    const newCell = newMaze.randomDirection(2, 2);

    expect(newCell).toEqual({ x: 2, y: 1 });


  });

  it('randomDirection results in false when no available direction', () => {

    const newMaze = new Maze(2, 2);
    newMaze.visited.push(new Cell(1, 1));
    newMaze.cells.push(new Cell(1, 1));
    newMaze.visited.push(new Cell(1, 2));
    newMaze.cells.push(new Cell(1, 2));
    newMaze.visited.push(new Cell(2, 2));
    newMaze.cells.push(new Cell(2, 2));
    newMaze.visited.push(new Cell(2, 1));
    newMaze.cells.push(new Cell(2, 1));

    const newCell = newMaze.randomDirection(2, 1);

    expect(newCell).toBeFalsy();


  });

  it('printcells returns an array of cell objects', () => {

    const newMaze = new Maze(2, 2);
    newMaze.makeCells();
    newMaze.makeMaze();
    const results = newMaze.printCells();
    expect(results.length).toBe(4);


  });
});

describe('Cell tests', () => {

  const newMaze = new Maze(2, 2);
  newMaze.visited.push(new Cell(1, 1));
  newMaze.cells.push(new Cell(1, 1));

  it('cell.render returns coords', () => {

    expect(newMaze.cells[0].render()).toEqual({
      coordinates: { x: 1, y: 1 },
      exits: {}
    });

  });
});
