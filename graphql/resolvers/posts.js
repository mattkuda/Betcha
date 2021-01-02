const { AuthenticationError } = require("apollo-server");

const Post = require("../../models/Post");
const User = require("../../models/User");
const Pregame = require("../../models/Pregame");
const Livegame = require("../../models/Livegame");
const Postgame = require("../../models/Postgame");

const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    async getPosts(_, {}, context) {
      try {
        // GETTING POSTS FROM ONLY PPL YOU FOLLOW

        const { id } = checkAuth(context);
        const userME = await User.findById(id);
        //Get array ids of all ppl you follow
        const followingIds = userME.following.map((f) => f.followeeId);
        //ADD YOURSELF TO THE FEED
        followingIds.push(id);
        //Only get posts from ppl that are in that array
        const posts = await Post.find({ user: { $in: followingIds } }).sort({
          createdAt: -1,
        });

        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getUserPosts(_, { username }) {
      try {
        const posts = await Post.find({ username: username }).sort({
          createdAt: -1,
        });
        //FORMERLY const posts = await Post.find().sort({ createdAt: -1 }).populate('gameId').exec()
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Post: {
    async gameId(parent) {
      let game = await Postgame.find({ gameId: parent.gameId }).then(
        (games) => games[0]
      );
      if (game != null) {
        console.log("this is the post game: " + game);
        return game;
      } else {
        game = await Livegame.find({ gameId: parent.gameId }).then(
          (games) => games[0]
        );

        if (game != null) {
          return game;
        } else {
          game = await Pregame.find({ gameId: parent.gameId }).then(
            (games) => games[0]
          );

          return game;
        }
      }
    },

    // async gamePre(parent) {
    //   let game = await Pregame.find({ gameId: parent.gameId }).then(
    //     (games) => games[0]
    //   );
    //   if (game != null) {
    //     console.log("this is the pre game xxxx: " + game);
    //     return game;
    //   }
    // },

    // async gameLive(parent) {
    //   let game = await Livegame.find({ gameId: parent.gameId }).then(
    //     (games) => games[0]
    //   );
    //   if (game != null) {
    //     console.log("this is the live game xxxx: " + game);
    //     return game;
    //   }
    // },

    // async gamePost(parent) {
    //   let game = await Postgame.find({ gameId: parent.gameId }).then(
    //     (games) => games[0]
    //   );
    //   if (game != null) {
    //     console.log("this is the post game xxxx: " + game);
    //     return game;
    //   }
    // },
  },

  Mutation: {
    async createPost(_, { body, betType, betAmount, gameId }, context) {
      const user = checkAuth(context);

      if (body.trim() === "") {
        throw new Error("Post body must not be empty");
      }

      if (betType.trim() === "") {
        throw new Error("Post betType must not be empty");
      }

      if (betAmount.trim() === "") {
        throw new Error("Post betAmount must not be empty");
      }

      if (gameId.trim() === "") {
        throw new Error("Post gameId must not be empty");
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

    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);
      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return "Post deleted successfully";
        } else {
          throw new AuthenticationError("Action not allowed.");
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    //LIKE and UNLIKE
    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);

      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          //Post already liked ==> unlike it
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          //Not yet liked ==> like it
          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }

        await post.save();
        return post;
      } else throw new UserInputError("Post not found.");
    },
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("NEW_POST"),
    },
  },
};
