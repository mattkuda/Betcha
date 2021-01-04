const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

const { MONGODB } = require("./config.js");
const typeDefs = require("./graphql/typedefs");
const resolvers = require("./graphql/resolvers");

const pubsub = new PubSub();

let updateGames = require('./services/game.service');
let myGameService = updateGames.GameService;

const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB Connected");
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`server running at ${res.url}`);
  });

//start game service based on command line arg
if (process.argv.length > 2 && process.argv[2] === "g") {
  new myGameService().run();
}
