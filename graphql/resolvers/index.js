const postResolvers = require("./posts");
const leaguesResolvers = require("./leagues");
const commentsResolvers = require("./comments");
const scoreboardResolvers = require("./scoreboard");
const playsResolvers = require("./plays");
const reactionResolvers = require("./reactions");
const userResolvers = require("./users");
const notificationResolvers = require("./notifications");

module.exports = {
  //Any query or mutation that returns a post will go thru this.
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
    ...postResolvers.Post,
  },
  User: {
    followersCount: (parent) => parent.followers.length,
    followingCount: (parent) => parent.following.length,
    notificationCount: (parent) => parent.following.length,

    ...userResolvers.User,
  },
  Query: {
    ...postResolvers.Query,
    ...userResolvers.Query,
    ...scoreboardResolvers.Query,
    ...playsResolvers.Query,
    ...leaguesResolvers.Query,
    ...reactionResolvers.Query,
    ...notificationResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentsResolvers.Mutation,
    ...reactionResolvers.Mutation,
    ...notificationResolvers.Mutation,
  },
  Subscription: {
    ...postResolvers.Subscription,
  },
  Reaction: {
    ...reactionResolvers.React,
  },
  Notification: {
    ...notificationResolvers.Notfication,
  },
};
