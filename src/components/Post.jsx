function Post({ author, body, onDelete, onEdit }) {
    return (
        <li className='post'>
            <h3>{author}</h3>
            <p>{body}</p>
            <button onClick={onEdit}>Edit</button>
            <button onClick={onDelete}>Delete</button>
        </li>
    );
}

export default Post;
