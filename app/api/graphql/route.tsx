import { ApolloServer } from '@apollo/server'
import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { startServerAndCreateNextHandler } from '@as-integrations/next'

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

const resolvers = {
  Query: {
    posts: () => prisma.post.findMany(),
    post: (_: any, { id }: { id: string }) => 
      prisma.post.findUnique({ where: { id } }),
  },
  Mutation: {
    createPost: (_: any, { input }: { input: { title: string, content: string } }) => 
      prisma.post.create({ data: input }),
    updatePost: (_: any, { id, input }: { id: string, input: { title: string, content: string } }) => 
      prisma.post.update({ where: { id }, data: input }),
    deletePost: async (_: any, { id }: { id: string }) => {
      await prisma.post.delete({ where: { id } })
      return true
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = startServerAndCreateNextHandler(server, {
  context: async req => ({ req, prisma }),
})

export async function GET(request: NextRequest) {
  return handler(request)
}

export async function POST(request: NextRequest) {
  return handler(request)
}