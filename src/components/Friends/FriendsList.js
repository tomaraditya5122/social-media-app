import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

function FriendsList() {
  const { currentUser, users, setUsers, friendRequests, setFriendRequests } = useContext(AuthContext);
  
  const currentUserData = users.find(u => u.id === currentUser.id);
  const friends = users.filter(u => currentUserData?.friends?.includes(u.id));
  const nonFriends = users.filter(u => 
    u.id !== currentUser.id && 
    !currentUserData?.friends?.includes(u.id) &&
    !friendRequests.some(req => 
      req.from === currentUser.id && req.to === u.id && req.status === 'pending'
    )
  );
  
  const pendingRequests = friendRequests.filter(
    req => req.to === currentUser.id && req.status === 'pending'
  );

  const sendFriendRequest = (userId) => {
    const newRequest = {
      id: Date.now().toString(),
      from: currentUser.id,
      to: userId,
      status: 'pending',
      timestamp: Date.now()
    };
    setFriendRequests([...friendRequests, newRequest]);
    alert('Friend request sent!');
  };

  const acceptRequest = (requestId, fromUserId) => {
    const updatedRequests = friendRequests.map(req =>
      req.id === requestId ? { ...req, status: 'accepted' } : req
    );
    setFriendRequests(updatedRequests);

    const updatedUsers = users.map(user => {
      if (user.id === currentUser.id) {
        return { ...user, friends: [...(user.friends || []), fromUserId] };
      }
      if (user.id === fromUserId) {
        return { ...user, friends: [...(user.friends || []), currentUser.id] };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  const rejectRequest = (requestId) => {
    const updatedRequests = friendRequests.map(req =>
      req.id === requestId ? { ...req, status: 'rejected' } : req
    );
    setFriendRequests(updatedRequests);
  };

  return (
    <div className="friends-container">
      {pendingRequests.length > 0 && (
        <div className="friends-section">
          <h2>Friend Requests</h2>
          {pendingRequests.map(request => {
            const user = users.find(u => u.id === request.from);
            return (
              <div key={request.id} className="user-card">
                <div className="user-info">
                  <div className="post-avatar">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4>{user?.name}</h4>
                  </div>
                </div>
                <div>
                  <button 
                    className="friend-btn accept"
                    onClick={() => acceptRequest(request.id, user.id)}
                  >
                    Accept
                  </button>
                  <button 
                    className="friend-btn reject"
                    onClick={() => rejectRequest(request.id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="friends-section">
        <h2>Your Friends ({friends.length})</h2>
        {friends.length === 0 ? (
          <p style={{ color: '#65676b', textAlign: 'center' }}>No friends yet. Send friend requests below!</p>
        ) : (
          friends.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-info">
                <div className="post-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4>{user.name}</h4>
                  <p style={{ fontSize: '12px', color: '#65676b' }}>{user.email}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="friends-section">
        <h2>Find Friends</h2>
        {nonFriends.length === 0 ? (
          <p style={{ color: '#65676b', textAlign: 'center' }}>No more users to add!</p>
        ) : (
          nonFriends.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-info">
                <div className="post-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4>{user.name}</h4>
                  <p style={{ fontSize: '12px', color: '#65676b' }}>{user.email}</p>
                </div>
              </div>
              <button 
                className="friend-btn add"
                onClick={() => sendFriendRequest(user.id)}
              >
                Add Friend
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FriendsList;
