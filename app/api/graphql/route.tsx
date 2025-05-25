import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const typeDefs = `#graphql
  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    updatedAt: String!
  }

  input PostInput {
    title: String!
    content: String!
  }

  type Query {
    posts: [Post]
    post(id: ID!): Post
  }

  type Mutation {
    createPost(input: PostInput!): Post
    updatePost(id: ID!, input: PostInput!): Post
    deletePost(id: ID!): Boolean
  }
`

type PostInput = {
  title: string;
  content: string;
};

type PostArgs = {
  id: string;
};

type CreatePostArgs = {
  input: PostInput;
};

type UpdatePostArgs = {
  id: string;
  input: PostInput;
};

type DeletePostArgs = {
  id: string;
};

const resolvers = {
  Query: {
    posts: () => prisma.post.findMany(),
    post: (_: unknown, { id }: PostArgs) => prisma.post.findUnique({ where: { id } }),
  },
  Mutation: {
    createPost: (_: unknown, { input }: CreatePostArgs) => prisma.post.create({ data: input }),
    updatePost: (_: unknown, { id, input }: UpdatePostArgs) => 
      prisma.post.update({ where: { id }, data: input }),
    deletePost: async (_: unknown, { id }: DeletePostArgs) => {
      await prisma.post.delete({ where: { id } })
      return true
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

export const GET = startServerAndCreateNextHandler(server)
export const POST = startServerAndCreateNextHandler(server)