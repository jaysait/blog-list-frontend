import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);

  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
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

  const addBlog = (event) => {
    event.preventDefault();
    const newBlog = { author: newAuthor, title: newTitle, url: newUrl };
    blogService
      .create(newBlog)
      .then((blog) => {
        setBlogs(blogs.concat(blog));
        setNewAuthor('');
        setNewTitle('');
        setNewUrl('');
        displayMessage({
          message: `a new blog ${blog.title} by ${blog.author} added`,
          type: 'success',
        });
      })
      .catch((error) => {
        displayMessage({ message: `${error.response.data.error}`, type: 'error' });
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
  const handleChangeTitle = (event) => {
    setNewTitle(event.target.value);
  };
  const handleChangeAuthor = (event) => {
    setNewAuthor(event.target.value);
  };
  const handleChangeUrl = (event) => {
    setNewUrl(event.target.value);
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  );

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        title
        <input value={newTitle} onChange={handleChangeTitle} />
      </div>
      <div>
        author
        <input value={newAuthor} onChange={handleChangeAuthor} />
      </div>
      <div>
        url
        <input value={newUrl} onChange={handleChangeUrl} />
      </div>
      <button type='submit'>create</button>
    </form>
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
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
