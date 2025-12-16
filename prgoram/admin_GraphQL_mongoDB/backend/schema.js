const { gql } = require("apollo-server-express");

module.exports = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    users: [User]
  }

  type Mutation {
    addUser(name: String!, email: String!): String
    updateUser(id: ID!, name: String!, email: String!): String
    deleteUser(id: ID!): String
  }
`;
