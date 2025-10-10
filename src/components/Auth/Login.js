import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, users } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      login(user);
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to Social App</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-btn">Login</button>
        </form>
        <div className="auth-link">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
