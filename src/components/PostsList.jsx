import { useEffect, useState } from 'react';

import Post from './Post';
import NewPost from './NewPost';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';

const API_URL = 'http://localhost:8080/posts';

function PostsList({ isPosting, onStopPosting }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingPost, setEditingPost] = useState(null);

    // Fetch posts from backend
    useEffect(() => {
        async function fetchPosts() {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error('Failed to fetch posts.');

                const resData = await response.json();
                setPosts(resData.posts);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, []);

    // Add a new post
    async function addPostHandler(postData) {
        setLoading(true);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData),
            });

            if (!response.ok) throw new Error('Failed to add post.');

            const newPost = await response.json();
            setPosts((prevPosts) => [newPost.post, ...prevPosts]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // Delete a post
    async function deletePostHandler(postId) {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/${postId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete post.');

            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // Start editing a post
    function startEditHandler(post) {
        setEditingPost(post);
    }

    // Save edited post
    async function saveEditHandler(updatedPost) {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/${updatedPost.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPost),
            });

            if (!response.ok) throw new Error('Failed to update post.');

            setPosts((prevPosts) =>
                prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
            );
            setEditingPost(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {isPosting && (
                <Modal onCloseModal={onStopPosting}>
                    <NewPost onCancel={onStopPosting} onAddPost={addPostHandler} />
                </Modal>
            )}

            {editingPost && (
                <Modal onCloseModal={() => setEditingPost(null)}>
                    <NewPost
                        onCancel={() => setEditingPost(null)}
                        onAddPost={saveEditHandler}
                        editingPost={editingPost}
                    />
                </Modal>
            )}

            {loading && <LoadingSpinner />}

            {error && (
                <div style={{ textAlign: 'center', color: 'red' }}>
                    <h2>Error: {error}</h2>
                    <p>Please try again later.</p>
                </div>
            )}

            {!loading && !error && posts.length > 0 && (
                <ul className='posts'>
                    {posts.map((post) => (
                        <Post
                            key={post.id}
                            author={post.author}
                            body={post.body}
                            onDelete={() => deletePostHandler(post.id)}
                            onEdit={() => startEditHandler(post)}
                        />
                    ))}
                </ul>
            )}

            {!loading && !error && posts.length === 0 && (
                <div style={{ textAlign: 'center', color: 'white' }}>
                    <h2>No posts yet.</h2>
                    <p>Try adding some!</p>
                </div>
            )}
        </>
    );
}

export default PostsList;
