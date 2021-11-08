import React, { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';

import Notification from './components/Notification';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      const sortedBlogs = blogs.sort((a, b) => {
        return b.likes - a.likes;
      });

      setBlogs(sortedBlogs);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);

      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const displayMessage = ({ message, type }) => {
    setMessage(message);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();
    blogService
      .create(blogObject)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog));
        displayMessage({
          message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
          type: 'success',
        });
      })
      .catch((error) => {
        displayMessage({ message: `${error.response.data.error}`, type: 'error' });
      });
  };

  const increaseBlogLike = (id) => {
    const blog = blogs.find((n) => n.id === id);

    const changedBlog = { ...blog, likes: blog.likes + 1 };

    blogService
      .update(id, changedBlog)
      .then((returnedBlog) => setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog))))
      .catch((error) => {
        displayMessage({
          message: `Blog '${blog.title}' was already removed from server`,
          type: 'error',
        });
        setBlogs(blogs.filter((b) => b.id !== id));
      });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      displayMessage({ message: 'wrong credentials', type: 'error' });
    }
  };
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser');
    setUser(null);
  };

  const handleDeleteBlog = (event) => {
    event.preventDefault();
    const id = event.target.value;
    const p = blogs.find((blog) => blog.id === id);

    const result = window.confirm(`Remove ${p.title} by ${p.author}?`);
    if (result) {
      blogService
        .deleteBlog(event.target.value)
        .then((res) => {
          setBlogs(blogs.filter((b) => b.id !== id));
        })
        .catch((error) => {
          console.log('deleted error: ', error);
        });
    }
  };

  const loginForm = () => (
    <div>
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleLogin={handleLogin}
      />
    </div>
  );

  const blogForm = () => (
    <Togglable buttonLabel='create new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  );

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={message} type={messageType} />

      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>
            {user.name} logged-in <button onClick={handleLogout}>logout</button>
          </p>
          {blogForm()}
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              increaseBlogLike={() => increaseBlogLike(blog.id)}
              deleteBlog={handleDeleteBlog}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
