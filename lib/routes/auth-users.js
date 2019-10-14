const router = require('express').Router({ mergeParams: true });
const User = require('../models/user');
const Key = require('../models/key-model');

router

//admin roles
  .put('/:id/roles/:role', ({ params }, res, next) => {
    User.updateById(params.id, {
      $addToSet: {
        roles: params.role
      }
    })
      .then(user => res.json(user))
      .catch(next);
  })

  .delete('/:id/roles/:role', ({ params }, res, next) => {
    User.updateById(params.id, {
      $pull: {
        roles: params.role
      }
    })
      .then(user => res.json(user))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    User.find()
      .lean()
      .populate('key')
      .then((users) => res.json(users))
      .catch(next);
  })

  .delete('/:id', ({ params }, res, next) => {
    User.findOneAndRemove(params.id)
      .then(user => {
        const userInfo = user;
        return Key.findOneAndRemove(user.key)
          .then(() => {
            return res.json(userInfo);
          });
      })
      .catch(next);
  });
  

module.exports = router;