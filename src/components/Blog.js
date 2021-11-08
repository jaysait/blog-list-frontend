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
    <div style={blogStyle}>
      {!showMore ? (
        <div>
          {blog.title}
          <button
            onClick={() => {
              setShowMore(!showMore);
            }}>
            view
          </button>
        </div>
      ) : (
        <div>
          {blog.title}
          <button
            onClick={() => {
              setShowMore(!showMore);
            }}>
            hide
          </button>
          <br />
          {blog.url}
          <br />
          likes {blog.likes} <button onClick={increaseBlogLike}>like</button>
          <br /> {blog.author}
          <br />
          {blog.user.id === user.id && (
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
