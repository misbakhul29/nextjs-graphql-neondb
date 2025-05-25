'use client'
import { useQuery, useMutation, gql } from '@apollo/client'
import Link from 'next/link'
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react'

const GET_POSTS = gql`
  query {
    posts {
      id
      title
    }
  }
`

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`

export default function Home() {
  const { loading, error, data } = useQuery(GET_POSTS, {
    fetchPolicy: 'cache-and-network'
  })
  const [deletePost] = useMutation(DELETE_POST, {
    refetchQueries: [{ query: GET_POSTS }]
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Blog Posts</h1>
      <Link href="/create" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
        Create New Post
      </Link>
      
      <div className="space-y-4">
        {data.posts.map((post: { id: Key | null | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; content: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }) => (
          <div key={post.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <div className="mt-4 flex gap-2">
              <Link 
                href={`/edit/${post.id}`}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </Link>
              <button
                onClick={() => deletePost({ variables: { id: post.id } })}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}