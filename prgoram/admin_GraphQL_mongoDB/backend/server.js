const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");

const connectDB = require("./config/db");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");

async function startServer() {
  const app = express();
  app.use(cors());

  connectDB();

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  app.listen(3000, () => {
    console.log("GraphQL running at http://localhost:3000/graphql");
  });
}

startServer();
