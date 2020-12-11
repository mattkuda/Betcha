const { model, Schema } = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  body: String,
  username: String,
  createdAt: String,
  betType: String,
  betAmount: Number,
  ganeId: String,
  gamePre: mongoose.Mixed,
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