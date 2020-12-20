const postsResolvers = require("./posts");
const leaguesResolvers = require("./leagues");
const usersResolvers = require("./users");
const commentsResolvers = require("./comments");
const scoreboardResolvers = require("./scoreboard");
const playsResolvers = require("./plays");
const reactResolvers = require("./react");
const postResolvers = require("./posts");
const userResolvers = require("./users");

module.exports = {
  //Any query or mutation that returns a post will go thru this.
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
    ...postResolvers.Post
  },
  Query: {
    ...postsResolvers.Query,
    ...userResolvers.Query,
    ...scoreboardResolvers.Query,
    ...playsResolvers.Query,
    ...leaguesResolvers.Query,
    ...reactResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation,
    ...reactResolvers.Mutation
  },
  Subscription: {
    ...postsResolvers.Subscription,
  },
  React: {
    ...reactResolvers.React
  },
};
