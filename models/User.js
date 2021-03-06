const {model, Schema} = require('mongoose');
var mongoose = require('mongoose');


const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
  bio: String,
  profilePicture: String,
  website: String,
  location: String,
  name: String,
  
  followers: [
    {
      followerId: mongoose.Schema.Types.ObjectId,
      createdAt: String
    }
  ],
  following: [
    {
      followeeId: mongoose.Schema.Types.ObjectId,
      createdAt: String
    }
  ],
});

module.exports = model('User', userSchema);