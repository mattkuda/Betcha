const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

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
    { expiresIn: "1h" }
  );
}

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
      //Can use these later if we want validation
      // if (body.trim() === "") {
      //   throw new Error("Post body must not be empty");
      // }

      // if (betType.trim() === "") {
      //   throw new Error("Post betType must not be empty");
      // }

      // if (betAmount.trim() === "") {
      //   throw new Error("Post betAmount must not be empty");
      // }

      // if (gameId.trim() === "") {
      //   throw new Error("Post gameId must not be empty");
      // }

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

      //If we get here, that means no error was thrown during the checkAuth phase
      const newPost = new Post({
        body, //already destructured at the async line (above)
        betType,
        betAmount,
        gameId, //already destructured at the async line (above)
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();

      context.pubsub.publish("NEW_POST", {
        newPost: post,
      });

      return post;
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
