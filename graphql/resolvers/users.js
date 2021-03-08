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

// const gc = new Storage({
//   keyFilename: path.join(
//     __dirname,
//     "../../loyal-oath-304300-96ccd330b866.json"
//   ),
//   projectId: "loyal-oath-304300",
// });

// const gc2 = new Storage({
//   keyFilename: "../../loyal-oath-304300-96ccd330b866.json"
// });

// // gc.getBuckets().then((x) =>
// //   console.log("These a buckets: " + JSON.stringify(x))
// // );

// const imagesBucket = gc.bucket("betcha-sports-images");

module.exports = {
  Query: {
    async getUser(_, { username }) {
      try {
        const user = await User.findOne({ username });

        if (user) {
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
      { registerInput: { username, email, password, confirmPassword,accessCode} }
    ) {
      // Validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword,
        accessCode
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
        profilePicture: "https://react.semantic-ui.com/images/avatar/large/matthew.png"
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
    async updateInfo(_, { name, bio, location, website, profilePicture }, context) {
      const user = checkAuth(context);
      console.log("update 1");
      console.log("pro pic is: " + profilePicture);


      try {
        const userME = await User.findOne({ username: user.username });

        if (userME) {
          userME.name = name;
          userME.bio = bio;
          userME.location = location;
          userME.website = website;

          //Only update propic if user uploaded one
          if(profilePicture != null) userME.profilePicture = profilePicture;

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
