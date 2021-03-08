const { model, Schema } = require('mongoose');
const mongoose = require('mongoose');

const reactionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
  },
  playId: String,
  body: String,
  createdAt: String,
}, { strict: false });

module.exports = model('Reaction', reactionSchema);
