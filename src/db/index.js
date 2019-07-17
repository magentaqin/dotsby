const { GraphQLServer } = require('graphql-yoga');
const path = require('path');
const { prisma } = require('./prisma/prisma-client');

const resolvers = {
  Query: {
    allFile: (root, args, context, info) => {
      return {
        files: context.prisma.files(),
        filesConnection: {
          pageInfo: context.prisma.filesConnection(args).pageInfo(),
          aggregate: context.prisma.filesConnection(args).aggregate(),
          edges: context.prisma.filesConnection(args).edges()
        }
      }
    },
  },
  Mutation: {
    create: (root, args, context) => {
      return context.prisma.createFile({
        absolutePath: args.absolutePath,
        content: args.content
      })
    }
  },
}

const server = new GraphQLServer({
  typeDefs: path.resolve(__dirname, './schema.graphql'),
  resolvers,
  context: { prisma }
})

module.exports = {
  dbServer: server
}
