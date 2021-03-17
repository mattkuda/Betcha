//const { ApolloServer, PubSub } = require("apollo-server");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const express = require('express');
const path = require("path");
const cors = require('cors');

const { MONGODB } = require("./config.js");
const typeDefs = require("./graphql/typedefs");
const resolvers = require("./graphql/resolvers");

//const pubsub = new PubSub();

let updateGames = require('./services/GameService');
let myGameService = updateGames.GameService;

const PORT = process.env.PORT || 5000;

// const server = new ApolloServer({
//   playground: true,
//   typeDefs,
//   resolvers,
//   context: ({ req }) => ({ req, pubsub }),
// });

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const app = express();
app.use(cors());

app.use('/',express.static(path.join(__dirname, "/client/build")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

server.applyMiddleware({ app });

mongoose
  .connect(MONGODB, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB Connected");
  });


app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
);

//start game service based on command line arg
if (process.argv.length > 2 && process.argv[2] === "g") {
  new myGameService().run();
}
