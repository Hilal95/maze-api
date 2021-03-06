const router = require('express').Router();
const Maze = require('../models/maze');
const queryParser = require('../middleware/query-parser');
const ensureKey = require('../../lib/middleware/ensure-key');

router
  .post('/', ensureKey(), (req, res, next) => {
    Maze.create(req.body)
      .then(maze => res.json(maze))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Maze.findById(req.params.id)
      .then(maze => res.json(maze))
      .catch(next);
  })

  .get('/', queryParser(), (req, res, next) => {
    const query = req.query;
    let number = 10;
    if(query.number) {
      number = Math.min(100, Math.floor(Number(query.number)));
      delete query.number;
    }

    Maze.aggregate([
      { $match: query },
      { $sample: { size: number } }
    ])
      .then(mazes => res.json(mazes))
      .catch(next);

  });



module.exports = router;
