import { createContext } from 'react';

export const AuthContext = createContext({
  currentUser: null,
  login: () => {},
  logout: () => {},
  register: () => {},
  users: [],
  setUsers: () => {},
  posts: [],
  setPosts: () => {},
  friendRequests: [],
  setFriendRequests: () => {}
});
