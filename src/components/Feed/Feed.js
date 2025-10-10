import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import CreatePost from './CreatePost';
import Post from './Post';

function Feed() {
  const { posts, currentUser, users } = useContext(AuthContext);
  const [visiblePosts, setVisiblePosts] = useState([]);

  useEffect(() => {
    const currentUserData = users.find(u => u.id === currentUser.id);
    const friendsCount = currentUserData?.friends?.length || 0;
    
    const filteredPosts = posts.filter(post => {
      const postUser = users.find(u => u.id === post.userId);
      const postUserFriendsCount = postUser?.friends?.length || 0;
      
      if (post.userId === currentUser.id) return true;
      
      if (postUserFriendsCount === 0) return false;
      
      if (currentUserData?.friends?.includes(post.userId)) return true;
      
      return true;
    }).sort((a, b) => b.timestamp - a.timestamp);
    
    setVisiblePosts(filteredPosts);
  }, [posts, users, currentUser]);

  return (
    <div className="feed-container">
      <CreatePost />
      {visiblePosts.length === 0 ? (
        <div className="post">
          <p style={{ textAlign: 'center', color: '#65676b' }}>
            No posts to display. Start by adding friends and creating posts!
          </p>
        </div>
      ) : (
        visiblePosts.map(post => <Post key={post.id} post={post} />)
      )}
    </div>
  );
}

export default Feed;
