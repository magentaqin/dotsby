const { GraphQLServer } = require('graphql-yoga');
const path = require('path');

const edges = [
  {
    id: 'edge-1',
    absolutePath: '/',
    content: '<h1>Hello World</h1>'
  }
]

let totalCount = edges.length;

const allFiles = {
  edges,
  totalCount
}

const resolvers = {
  Query: {
    allFile: () => allFiles,
  },
  Mutation: {
    create: (parent, args) => {
      const node = {
        id: `edge-${totalCount++}`,
        absolutePath: args.absolutePath,
        content: args.content
      };
      edges.push(node);
      return node;
    }
  },
}

const server = new GraphQLServer({
  typeDefs: path.resolve(__dirname, './schema.graphql'),
  resolvers,
})

server.start(() => console.log('listen to port 4000'))