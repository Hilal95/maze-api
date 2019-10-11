const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const { RequiredString } = require('./required-types');

const schema = new Schema({
  email: { RequiredString },
  hash: { RequiredString },
  key: {
    type: Schema.Types.ObjectId,
    ref: 'Keys',
    required: true
  },
  roles: [String]
});

schema.virtual('password').set(function(password) {
  this.hash = bcrypt.hashSync(password, 8);
});

schema.method('comparePassword', function(password) {
  return bcrypt.compareSync(password, this.hash);
});

module.exports = mongoose.model('User', schema);
