import { useQuery, useMutation } from 'react-query';

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: 'DELETE' }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: 'PATCH', data: { title: 'Hardcoded test string' } }
  );
  return response.json();
}

export function PostDetail({ post }) {
  const { data, isLoading, isError, error } = useQuery(
    ['comments', post.id],
    () => fetchComments(post.id),
    {
      staleTime: 0,
    }
  );

  const deleteMutation = useMutation(postId => deletePost(postId));
  const updateMutation = useMutation(postId => updatePost(postId)); // returns a function that we can call.

  if (isLoading) return <h3>Loading...</h3>;
  if (isError)
    return (
      <>
        <h3>Error.</h3>
        <p>{error.toString()}</p>
      </>
    );

  return (
    <>
      <h3>
        Title: <span className="blue">{post.title}</span>
      </h3>
      <button onClick={() => deleteMutation.mutate(post.id)}>
        Delete Post
      </button>
      &nbsp;
      <button onClick={() => updateMutation.mutate(post.id)}>
        Update Post Title
      </button>
      {updateMutation.isLoading && <p>Update in progress...</p>}
      {updateMutation.isError && <p className="error">Error updating title</p>}
      {updateMutation.isSuccess && (
        <p className="success">Successfully updated.</p>
      )}
      {deleteMutation.isError && <p className="error">Error deleting post</p>}
      {deleteMutation.isLoading && <p className="bold">Deleting post</p>}
      {deleteMutation.isSuccess && (
        <p className="success">Successfully deleted post</p>
      )}
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map(comment => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
