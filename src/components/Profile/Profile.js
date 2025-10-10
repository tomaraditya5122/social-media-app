import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Post from '../Feed/Post';

function Profile() {
  const { userId } = useParams();
  const { users, posts, currentUser } = useContext(AuthContext);
  
  const profileUser = users.find(u => u.id === (userId || currentUser.id));
  const userPosts = posts.filter(p => p.userId === profileUser?.id).sort((a, b) => b.timestamp - a.timestamp);

  if (!profileUser) return <div>User not found</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {profileUser.name.charAt(0).toUpperCase()}
        </div>
        <h2>{profileUser.name}</h2>
        <p style={{ color: '#65676b', marginTop: '8px' }}>{profileUser.email}</p>
        
        <div className="profile-stats">
          <div className="stat">
            <div className="stat-number">{userPosts.length}</div>
            <div className="stat-label">Posts</div>
          </div>
          <div className="stat">
            <div className="stat-number">{profileUser.friends?.length || 0}</div>
            <div className="stat-label">Friends</div>
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '20px', marginLeft: '20px' }}>Posts</h3>
        {userPosts.length === 0 ? (
          <div className="post">
            <p style={{ textAlign: 'center', color: '#65676b' }}>No posts yet</p>
          </div>
        ) : (
          userPosts.map(post => <Post key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}

export default Profile;
