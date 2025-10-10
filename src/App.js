import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Common/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Feed from './components/Feed/Feed';
import Profile from './components/Profile/Profile';
import FriendsList from './components/Friends/FriendsList';
import { AuthContext } from './context/AuthContext';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
    
    const storedPosts = localStorage.getItem('posts');
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }
    
    const storedRequests = localStorage.getItem('friendRequests');
    if (storedRequests) {
      setFriendRequests(JSON.parse(storedRequests));
    }
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, [users]);

  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem('posts', JSON.stringify(posts));
    }
  }, [posts]);

  useEffect(() => {
    if (friendRequests.length > 0) {
      localStorage.setItem('friendRequests', JSON.stringify(friendRequests));
    }
  }, [friendRequests]);

  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const register = (newUser) => {
    const userWithDefaults = {
      ...newUser,
      friends: [],
      postsToday: [],
      id: Date.now().toString()
    };
    const updatedUsers = [...users, userWithDefaults];
    setUsers(updatedUsers);
    login(userWithDefaults);
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      login, 
      logout, 
      register, 
      users, 
      setUsers,
      posts,
      setPosts,
      friendRequests,
      setFriendRequests
    }}>
      <Router>
        <div className="App">
          {currentUser && <Navbar />}
          <Routes>
            <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!currentUser ? <Register /> : <Navigate to="/" />} />
            <Route path="/" element={currentUser ? <Feed /> : <Navigate to="/login" />} />
            <Route path="/profile/:userId" element={currentUser ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/friends" element={currentUser ? <FriendsList /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
