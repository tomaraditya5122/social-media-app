import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

function Post({ post }) {
  const { currentUser, posts, setPosts, users } = useContext(AuthContext);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  const isLiked = post.likes?.includes(currentUser.id);

  const handleLike = () => {
    const updatedPosts = posts.map(p => {
      if (p.id === post.id) {
        const likes = p.likes || [];
        if (likes.includes(currentUser.id)) {
          return { ...p, likes: likes.filter(id => id !== currentUser.id) };
        } else {
          return { ...p, likes: [...likes, currentUser.id] };
        }
      }
      return p;
    });
    setPosts(updatedPosts);
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    
    const newComment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      text: commentText,
      timestamp: Date.now()
    };

    const updatedPosts = posts.map(p => {
      if (p.id === post.id) {
        return { ...p, comments: [...(p.comments || []), newComment] };
      }
      return p;
    });
    setPosts(updatedPosts);
    setCommentText('');
  };

  const handleShare = () => {
    const updatedPosts = posts.map(p => {
      if (p.id === post.id) {
        return { ...p, shares: (p.shares || 0) + 1 };
      }
      return p;
    });
    setPosts(updatedPosts);
    alert('Post shared!');
  };

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="post">
      <div className="post-header">
        <div className="post-avatar">
          {post.userName.charAt(0).toUpperCase()}
        </div>
        <div className="post-user-info">
          <h4>{post.userName}</h4>
          <span className="post-time">{getTimeAgo(post.timestamp)}</span>
        </div>
      </div>
      
      {post.content && <p className="post-content">{post.content}</p>}
      
      {post.media && (
        <div className="post-media">
          {post.mediaType === 'image' ? (
            <img src={post.media} alt="Post media" />
          ) : (
            <video src={post.media} controls />
          )}
        </div>
      )}
      
      <div className="post-actions">
        <button 
          className={`action-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          👍 {post.likes?.length || 0} Like{post.likes?.length !== 1 ? 's' : ''}
        </button>
        <button 
          className="action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          💬 {post.comments?.length || 0} Comment{post.comments?.length !== 1 ? 's' : ''}
        </button>
        <button className="action-btn" onClick={handleShare}>
          🔗 {post.shares || 0} Share{post.shares !== 1 ? 's' : ''}
        </button>
      </div>
      
      {showComments && (
        <div className="comments-section">
          {post.comments?.map(comment => (
            <div key={comment.id} className="comment">
              <div className="comment-author">{comment.userName}</div>
              <div className="comment-text">{comment.text}</div>
            </div>
          ))}
          <div className="add-comment">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleComment()}
            />
            <button onClick={handleComment}>Post</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;
