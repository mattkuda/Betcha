const postsResolvers = require("./posts");
const leaguesResolvers = require("./leagues");
const commentsResolvers = require("./comments");
const scoreboardResolvers = require("./scoreboard");
const playsResolvers = require("./plays");
const reactionResolvers = require("./reaction");
const postResolvers = require("./posts");
const userResolvers = require("./users");

module.exports = {
  //Any query or mutation that returns a post will go thru this.
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
    ...postResolvers.Post
  },
  User: {
    followersCount: (parent) => parent.followers.length,
    followingCount: (parent) => parent.following.length,
    ...userResolvers.User,
  },
  Query: {
    ...postsResolvers.Query,
    ...userResolvers.Query,
    ...scoreboardResolvers.Query,
    ...playsResolvers.Query,
    ...leaguesResolvers.Query,
    ...reactionResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation,
    ...reactionResolvers.Mutation
  },
  Subscription: {
    ...postsResolvers.Subscription,
  },
  Reaction: {
    ...reactionResolvers.React
  },
};
