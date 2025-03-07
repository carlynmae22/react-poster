import './NewPost.css';

import { useState } from 'react';

function NewPost({ onCancel, onAddPost, editingPost }) {
    const [author, setAuthor] = useState(editingPost ? editingPost.author : '');
    const [body, setBody] = useState(editingPost ? editingPost.body : '');

    function submitHandler(event) {
        event.preventDefault();
        onAddPost({ id: editingPost?.id, author, body });
    }

    return (
        <form onSubmit={submitHandler}>
            <label>Author</label>
            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />

            <label>Post</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)}></textarea>

            <button type="submit">{editingPost ? 'Update' : 'Add'} Post</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
}

export default NewPost;
