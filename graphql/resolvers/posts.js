const { AuthenticationError } = require("apollo-server");

const Post = require("../../models/Post");
const Play = require("../../models/Play");
const User = require("../../models/User");
const Pregame = require("../../models/Pregame");
const Livegame = require("../../models/Livegame");
const Postgame = require("../../models/Postgame");

const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    async getPosts(_, {first, offset}, context) {
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
        }).skip(offset).limit(first);

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
    async getUserPosts(_, { username, first, offset}) {
      try {

        if (!first && !offset) {
          return await Post.find({ username: username }).sort({createdAt: -1});
        }
        console.log("first: " + first)
        console.log("offset: " + offset)

        const posts = await Post.find({ username: username }).sort({
          createdAt: -1,
        }).skip(offset).limit(first);;
        //FORMERLY const posts = await Post.find().sort({ createdAt: -1 }).populate('gameId').exec()
        console.log("THE AMT OF POSTS" + posts.length)
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Post: {
    //POST ATTACHMENTS
    async gameArray(parent) {
      //Only works on real posts
      if (parent.postType == "R") return null;

      var newGameArr = [];

      for (const gameBet of parent.gameArray) {
        let game = await Postgame.find({ gameId: gameBet.gameId }).then(
          (games) => games[0]
        );
        if (game != null) {
          newGameArr.push({
            betType: gameBet.betType,
            betAmount: gameBet.betAmount,
            gameId: game,
          });
        } else {
          game = await Livegame.find({ gameId: gameBet.gameId }).then(
            (games) => games[0]
          );

          if (game != null) {
            newGameArr.push({
              betType: gameBet.betType,
              betAmount: gameBet.betAmount,
              gameId: game,
            });
          } else {
            game = await Pregame.find({ gameId: gameBet.gameId }).then(
              (games) => games[0]
            );

            newGameArr.push({
              betType: gameBet.betType,
              betAmount: gameBet.betAmount,
              gameId: game,
            });
          }
        }
      }

      return newGameArr;
    },

    //ATTACHED TO BOTH
    async user(parent) {
      let user = await User.find({ username: parent.username }).then(
        (users) => users[0]
      );
      return user;
    },
    //REACTION ATTACHMENTS
    async playId(parent) {
      if (parent.postType == "P") return null;

      let play = await Play.find({ playId: parent.playId }).then(
        (plays) => plays[0]
      );
      return play;
    },
    async post(parent) {
      if (parent.postType == "P") return null;
      let gameIdInQuestion = await Play.findOne({ playId: parent.playId });
      let posts = await Post.find({ user: parent.user }).sort({
        createdAt: -1,
      });

      for (const postIndex in posts) {
        for (const gameIndex in posts[postIndex].gameArray) {
          if (
            posts[postIndex].gameArray[gameIndex].gameId ==
            gameIdInQuestion.gameId
          ) {
            return posts[postIndex];
          }
        }
      }
      return null;
    },

  },

  User: {
    async user(parent) {
      let user = await User.find({ id: parent.user }).then((users) => users[0]);

      return user;
    },
  },

  Mutation: {
    async createPost(_, { body, gameArray, betOdds }, context) {
      console.log("1. Entered createPost");
      const user = checkAuth(context);

      if (body.trim() === "") {
        throw new Error("Post body must not be empty");
      }

      //TODO - Add this logic to each game in game array
      if (betOdds.trim() === "") {
        throw new Error("Post betOdds must not be empty");
      }

      // if (betAmount.trim() === "") {
      //   throw new Error("Post betAmount must not be empty");
      // }

      // if (gameId.trim() === "") {
      //   throw new Error("Post gameId must not be empty");
      // }

      //If we get here, that means no error was thrown during the checkAuth phase
      const newPost = new Post({
        body, //already destructured at the async line (above)
        gameArray, //already destructured at the async line (above)
        betOdds,
        postType: "P",
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      console.log("2. About to save createPost");

      const post = await newPost.save();

      console.log("3. About to publish createPost");
      context.pubsub.publish("NEW_POST", {
        newPost: post,
      });
      console.log("4. About to return createPost");

      return post;
    },

    async createPostReaction(_, { body, playId }, context) {
      console.log("1. Entered createPostReaction");
      const user = checkAuth(context);

      if (body.trim() === "") {
        throw new Error("Post body must not be empty");
      }

      //If we get here, that means no error was thrown during the checkAuth phase
      const newPost = new Post({
        body, //already destructured at the async line (above)
        playId, //already destructured at the async line (above)
        postType: "R",
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
      console.log("LIKING A POST");
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
