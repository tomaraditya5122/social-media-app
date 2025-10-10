import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function Navbar() {
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">SocialApp</Link>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/friends">Friends</Link>
        <Link to={`/profile/${currentUser.id}`}>Profile</Link>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
