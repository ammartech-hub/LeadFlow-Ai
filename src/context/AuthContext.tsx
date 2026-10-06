import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/index.js';
import { api } from '../lib/api.js';

interface AuthContextType {
  user: User | null;
  users: User[];
  isLoading: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => Promise<void>;
  switchUserById: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        const [meRes, usersRes] = await Promise.all([
          api.getMe(),
          api.getUsers()
        ]);
        setUser(meRes.user);
        setUsers(usersRes);
        if (meRes.user) {
          api.setCurrentUserId(meRes.user.id);
        }
      } catch (err) {
        console.error('Failed to load user session:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async (email: string) => {
    try {
      const res = await api.login(email);
      if (res.success && res.user) {
        setUser(res.user);
        api.setCurrentUserId(res.user.id);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = async (role: UserRole) => {
    try {
      const res = await api.switchRole(role);
      if (res.success && res.user) {
        setUser(res.user);
        api.setCurrentUserId(res.user.id);
      }
    } catch (err) {
      console.error('Failed to switch demo role:', err);
    }
  };

  const switchUserById = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setUser(found);
      api.setCurrentUserId(found.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        isLoading,
        login,
        logout,
        switchRole,
        switchUserById
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
