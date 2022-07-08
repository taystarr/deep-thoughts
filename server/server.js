const express = require('express');
// import apollo server
const { ApolloServer } = require('apollo-server-express');
// import typedefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
// create new Apollo server and pass in schema data
const server = new ApolloServer({
  typeDefs,
  resolvers
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// create new instance of apollo server with graphql schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  // integrate apollo server with express as middleware
  server.applyMiddleware({ app });
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      // log where we can go to test gql api
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
};

// call async function to start server
startApolloServer(typeDefs, resolvers);