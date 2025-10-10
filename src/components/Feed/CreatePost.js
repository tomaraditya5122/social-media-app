import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';

function CreatePost() {
  const { currentUser, users, setUsers, posts, setPosts } = useContext(AuthContext);
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState('');
  const [canPost, setCanPost] = useState(true);
  const [postsLeftToday, setPostsLeftToday] = useState(0);
  const [warningMessage, setWarningMessage] = useState('');

  useEffect(() => {
    const currentUserData = users.find(u => u.id === currentUser.id);
    const friendsCount = currentUserData?.friends?.length || 0;
    
    const today = new Date().toDateString();
    const postsToday = (currentUserData?.postsToday || []).filter(
      postDate => new Date(postDate).toDateString() === today
    );
    const postsTodayCount = postsToday.length;

    if (friendsCount === 0) {
      setCanPost(false);
      setWarningMessage('You need at least one friend to post on the public page.');
    } else if (friendsCount === 1) {
      const remaining = 1 - postsTodayCount;
      if (remaining <= 0) {
        setCanPost(false);
        setWarningMessage('You have reached your daily post limit (1 post/day with 1 friend).');
      } else {
        setCanPost(true);
        setPostsLeftToday(remaining);
      }
    } else if (friendsCount >= 2 && friendsCount < 10) {
      const remaining = 2 - postsTodayCount;
      if (remaining <= 0) {
        setCanPost(false);
        setWarningMessage(`You have reached your daily post limit (2 posts/day with ${friendsCount} friends).`);
      } else {
        setCanPost(true);
        setPostsLeftToday(remaining);
      }
    } else if (friendsCount >= 10) {
      setCanPost(true);
      setPostsLeftToday(-1);
    }
  }, [users, currentUser]);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type.startsWith('video/') ? 'video' : 'image';
      const fileURL = URL.createObjectURL(file);
      setMedia(fileURL);
      setMediaType(fileType);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canPost) {
      alert(warningMessage);
      return;
    }

    if (!content && !media) {
      alert('Please add some content or media');
      return;
    }

    const newPost = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      content,
      media,
      mediaType,
      likes: [],
      comments: [],
      shares: 0,
      timestamp: Date.now()
    };

    setPosts([newPost, ...posts]);

    const updatedUsers = users.map(user => {
      if (user.id === currentUser.id) {
        return {
          ...user,
          postsToday: [...(user.postsToday || []), Date.now()]
        };
      }
      return user;
    });
    setUsers(updatedUsers);

    setContent('');
    setMedia(null);
    setMediaType('');
  };

  return (
    <div className="create-post">
      {!canPost && (
        <div className="limit-warning">
          {warningMessage}
        </div>
      )}
      {canPost && postsLeftToday > 0 && (
        <div className="limit-warning" style={{ backgroundColor: '#d1ecf1', color: '#0c5460' }}>
          You have {postsLeftToday} post{postsLeftToday > 1 ? 's' : ''} left today.
        </div>
      )}
      {canPost && postsLeftToday === -1 && (
        <div className="limit-warning" style={{ backgroundColor: '#d4edda', color: '#155724' }}>
          You have unlimited posts! (10+ friends)
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder={canPost ? "What's on your mind?" : "Add friends to start posting..."}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={!canPost}
        />
        
        {media && (
          <div className="media-preview">
            {mediaType === 'image' ? (
              <img src={media} alt="Preview" />
            ) : (
              <video src={media} controls />
            )}
          </div>
        )}
        
        <div className="file-input-wrapper">
          <label htmlFor="media-upload" className="file-label">
            📷 Add Photo/Video
          </label>
          <input
            id="media-upload"
            type="file"
            accept="image/*,video/*"
            onChange={handleMediaChange}
            disabled={!canPost}
          />
        </div>
        
        <button type="submit" className="post-btn" disabled={!canPost}>
          Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
