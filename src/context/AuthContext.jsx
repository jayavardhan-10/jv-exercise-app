import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('auth_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, [user]);

  // Sign up with email and password
  const signup = async (email, password, displayName) => {
    try {
      // Create a mock user object
      const mockUser = {
        uid: Date.now().toString(),
        email,
        displayName,
        emailVerified: true
      };
      setUser(mockUser);
      return { user: mockUser };
    } catch (error) {
      throw new Error('Failed to create account');
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    try {
      // For development, accept any email/password
      const mockUser = {
        uid: '123456',
        email,
        displayName: email.split('@')[0],
        emailVerified: true
      };
      setUser(mockUser);
      return { user: mockUser };
    } catch (error) {
      throw new Error('Failed to sign in');
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      // Create a mock Google user
      const mockUser = {
        uid: '789012',
        email: 'google@example.com',
        displayName: 'Google User',
        emailVerified: true
      };
      setUser(mockUser);
      return { user: mockUser };
    } catch (error) {
      throw new Error('Failed to sign in with Google');
    }
  };

  // Logout
  const logout = async () => {
    setUser(null);
  };

  // Reset Password
  const resetPassword = async (email) => {
    // Mock implementation
    console.log('Password reset email would be sent to:', email);
  };

  // Update profile
  const updateUserProfile = async (updates) => {
    setUser(prev => ({
      ...prev,
      ...updates
    }));
  };

  const value = {
    user,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 