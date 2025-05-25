'use client'
import { useQuery, useMutation, gql } from '@apollo/client'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      title
      content
    }
  }
`

const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $input: PostInput!) {
    updatePost(id: $id, input: $input) {
      id
      title
      content
    }
  }
`
export default function EditPost( ) {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_POST, { variables: { id } })
  const [updatePost] = useMutation(UPDATE_POST)
  const router = useRouter()
  const [formData, setFormData] = useState({ title: '', content: '' })

  useEffect(() => {
    if (data?.post) {
      setFormData({
        title: data.post.title,
        content: data.post.content
      })
    }
  }, [data])

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    await updatePost({
      variables: {
        id,
        input: {
          title: formData.title,
          content: formData.content
        }
      }
    })
    router.push('/')
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            className="w-full p-2 border rounded h-32"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Update Post
        </button>
      </form>
    </div>
  )
}