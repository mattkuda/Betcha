const postsResolvers = require("./posts");
const gamePresResolvers = require("./gamepres");
const usersResolvers = require("./users");
const commentsResolvers = require("./comments");

module.exports = {
  //Any query or mutation that returns a post will go thru this.
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...postsResolvers.Query,
    ...gamePresResolvers.Query,
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
