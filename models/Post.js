const { model, Schema } = require('mongoose');
const mongoose = require('mongoose');


const postSchema = new Schema({
  body: String,
  username: String,
  createdAt: String,
  betType: String,
  betAmount: String,
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'gamePre'
  },
  comments: [
    {
      body: String,
      username: String,
      createdAt: String
    }
  ],
  likes: [
    {
      username: String,
      createdAt: String
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  }
});

module.exports = model('Post', postSchema);