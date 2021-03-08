const { model, Schema } = require('mongoose');
const mongoose = require('mongoose');


const postSchema = new Schema({
  body: String,
  username: String,
  createdAt: String,
  postType: String,
  betOdds: String,
  gameArray: [
    {
      betType: String,
      betAmount: String,
      gameId: String,
    }
  ],
  playId: String,
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
  }
});

module.exports = model('Post', postSchema);