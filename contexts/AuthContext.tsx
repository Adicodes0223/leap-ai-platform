import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { User } from '../types';
import { usersDB } from '../mockDB'; // Import the new centralized user database

// Type for a user object that includes the password, for internal use only.
type UserWithPassword = User & { password?: string };

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (username: string, password: string) => Promise<void>;
  signup: (userData: Omit<User, 'isAdmin' | 'id' | 'bio' | 'profilePictureUrl' | 'followers' | 'following' | 'founderLogs' | 'problemSolverHistory'> & { password: string }) => Promise<void>;
  logout: () => void;
  updateCurrentUser: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
        const storedUser = localStorage.getItem('leapUser');
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
        return null;
    }
  });
  
  // In-memory store for all users, initialized from mockDB or localStorage.
  const [users, setUsers] = useState<UserWithPassword[]>(() => {
      try {
          const storedUsers = localStorage.getItem('leapUsersDB');
          return storedUsers ? JSON.parse(storedUsers) : usersDB;
      } catch (e) {
          console.error("Failed to load users from localStorage, falling back to default.", e);
          return usersDB;
      }
  });

  const usersWithoutPasswords = useMemo(() => {
    return users.map(u => {
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('leapUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('leapUser');
    }
  }, [currentUser]);

  useEffect(() => {
      try {
          localStorage.setItem('leapUsersDB', JSON.stringify(users));
      } catch (e) {
          console.error("Failed to save users to localStorage.", e);
      }
  }, [users]);

  const login = async (username: string, password: string): Promise<void> => {
    const userToLogin = users.find(u => u.username === username && u.password === password);
    
    if (userToLogin) {
      const { password, ...userToSet } = userToLogin; // Omit password from currentUser
      setCurrentUser(userToSet);
      return;
    }
    
    throw new Error('Invalid username or password');
  };

  const signup = async (userData: Omit<User, 'isAdmin' | 'id' | 'bio' | 'profilePictureUrl' | 'followers' | 'following' | 'founderLogs' | 'problemSolverHistory'> & { password: string }): Promise<void> => {
    const { username, email } = userData;
    // Check if user already exists
    if (users.some(u => u.username === username)) {
      throw new Error('Username already taken');
    }
    if (users.some(u => u.email === email)) {
        throw new Error('Email already registered');
    }

    const newUser: UserWithPassword = {
        ...userData,
        id: `user-${Date.now()}`,
        isAdmin: false,
        bio: `Aspiring founder and a proud member of the LEAP community. Currently exploring ${userData.interests}.`,
        profilePictureUrl: `https://api.dicebear.com/8.x/adventurer/svg?seed=${encodeURIComponent(userData.username)}&backgroundColor=b6e3f4,c0aede`,
        followers: [],
        following: [],
        founderLogs: [],
        problemSolverHistory: [],
    };
    
    setUsers(prevUsers => [...prevUsers, newUser]);
    
    const { password, ...userToSet } = newUser; // Omit password from currentUser
    setCurrentUser(userToSet);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateCurrentUser = (updatedData: Partial<User>) => {
    setCurrentUser(prevUser => {
      if (!prevUser) return null;
      const newUser = { ...prevUser, ...updatedData };
      // Also update the master list of users so changes are reflected everywhere
      setUsers(prevAllUsers => prevAllUsers.map(u => u.id === newUser.id ? { ...u, ...newUser } : u));
      return newUser;
    });
  };

  const value = { currentUser, users: usersWithoutPasswords, login, signup, logout, updateCurrentUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};