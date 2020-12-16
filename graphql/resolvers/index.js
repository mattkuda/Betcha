const postsResolvers = require("./posts");
const leaguesResolvers = require("./leagues");
const usersResolvers = require("./users");
const commentsResolvers = require("./comments");
const scoreboardResolvers = require("./scoreboard");
const playsResolvers = require("./plays");

module.exports = {
  //Any query or mutation that returns a post will go thru this.
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...postsResolvers.Query,
    ...scoreboardResolvers.Query,
    ...playsResolvers.Query,
    ...leaguesResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation,
  },
  Subscription: {
    ...postsResolvers.Subscription,
  },
};
