const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const { createWriteStream } = require("fs");
const express = require("express");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");
const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");
const checkAuth = require("../../util/check-auth");

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "23h" }
  );
}

const gc = new Storage({
  keyFilename: path.join(
    __dirname,
    "../../loyal-oath-304300-96ccd330b866.json"
  ),
  projectId: "loyal-oath-304300",
});

const gc2 = new Storage({
  keyFilename: "../../loyal-oath-304300-96ccd330b866.json"
});

gc.getBuckets().then((x) =>
  console.log("These a buckets: " + JSON.stringify(x))
);

const imagesBucket = gc.bucket("betcha-sports-images");

module.exports = {
  Query: {
    async getUser(_, { username }) {
      try {
        const user = await User.findOne({ username });

        if (user) {
          console.log("this is user: " + user);
          return user;
        } else {
          throw new Error("User not found");
        }
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
    async getAllUsers() {
      try {
        const user = await User.find({});
        return user;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    uploadFile: async (_, { file }) => {
      const { createReadStream, filename } = await file;

      await new Promise((res) =>
        createReadStream()
          .pipe(
            imagesBucket.file(filename).createWriteStream({
              resumable: false,
              gzip: true,
            })
          )
          .on("finish", res)
      )
      return true;
     
    },

    uploadFile2: async (_, { filename }) => {      

      const storage = new Storage({ keyFilename: "loyal-oath-304300-96ccd330b866.json" });
      // Replace with your bucket name and filename.
      const bucketname = 'betcha-sports-images';
      filename = '/Users/MattKuda/Desktop/Screen Shot 2021-01-23 at 12.48.48 PM.png';

      const res = await storage.bucket(bucketname).upload(filename);
      // `mediaLink` is the URL for the raw contents of the file.
      const url = res[0].metadata.mediaLink;

      // Need to make the file public before you can access it.
      await storage.bucket(bucketname).file(filename).makePublic();

      // Make a request to the uploaded URL.
      const axios = require('axios');
      const pkg = await axios.get(url).then(res => res.data);
      pkg.name; // 'masteringjs.io'
    },

    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError("Errors.", { errors });
      }

      const user = await User.findOne({ username });

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong credentials.";
        throw new UserInputError("Wrong credentials.", { errors });
      }

      //If you reach here, they have successfully enter correct login credientials
      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      // Validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      // TODO: Make sure user doesnt already exist
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }
      // hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });
      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
    //UPDATE INFO (Name, Bio, Location, Website)
    async updateInfo(_, { name, bio, location, website }, context) {
      const user = checkAuth(context);
      console.log("update 1");

      try {
        const userME = await User.findOne({ username: user.username });

        if (userME) {
          userME.name = name;
          userME.bio = bio;
          userME.location = location;
          userME.website = website;

          await userME.save();
          return userME;
        } else {
          throw new Error("User not found");
        }
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },

    //FOLLOW and UNFOLLOW
    async followUser(_, { followeeId }, context) {
      const { id } = checkAuth(context);

      const user = await User.findById(followeeId);
      const userME = await User.findById(id);

      if (user) {
        if (user.followers.find((follower) => follower.followerId.equals(id))) {
          //User already followed ==> unfollow them
          user.followers = user.followers.filter(
            (follower) => !follower.followerId.equals(id)
          );
          userME.following = userME.following.filter(
            (followee) => !followee.followeeId.equals(followeeId)
          );
        } else {
          //Not yet followed ==> follow them
          //Add to OTHER's followers
          user.followers.push({
            followerId: id,
            createdAt: new Date().toISOString(),
          });
          //Add to YOUR following
          userME.following.push({
            followeeId: followeeId,
            createdAt: new Date().toISOString(),
          });
        }

        await user.save();
        await userME.save();

        return user;
      } else throw new UserInputError("User not found.");
    },
  },
};
