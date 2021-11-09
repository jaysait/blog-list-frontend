import React, { useState } from 'react';
const Blog = ({ blog, increaseBlogLike, deleteBlog, user }) => {
  const [showMore, setShowMore] = useState(false);
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };
  return (
    <div style={blogStyle} className='blog'>
      <div>
        <span className='title'>{blog.title}</span>
        <button
          onClick={() => {
            setShowMore(!showMore);
          }}>
          {!showMore ? 'view' : 'hide'}
        </button>
      </div>
      {showMore && (
        <div>
          <p className='url'>{blog.url}</p>
          <strong className='likes'> likes {blog.likes}</strong>{' '}
          <button onClick={increaseBlogLike}>like</button>
          <p className='author'>{blog.author}</p>
          {blog.user?.id === user?.id && (
            <button value={blog.id} onClick={deleteBlog}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
