import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginFormValues, UserRole } from '../types';


const users = [{
  id: '1',
  username: 'admin',
  password: 'admin123',
  role: UserRole.ADMIN,
  name: '管理员',
  avatar: 'https://joeschmoe.io/api/v1/random'
},
{
  id: '2',
  username: 'auditor',
  password: 'auditor123',
  role: UserRole.AUDITOR,
  name: '审核员',
  avatar: 'https://joeschmoe.io/api/v1/random'
}]

interface AuthContextType {
  user: User | null;
  login: (values: LoginFormValues) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check for existing user in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (values: LoginFormValues): Promise<boolean> => {
    // In a real app, this would be an API call
    const { username, password } = values;
    
    // Find user in mock data
    const foundUser = users.find(
      (user) => user.username === username && user.password === password
    );

    if (foundUser) {
      // Store user in state and localStorage
      const { password, ...userWithoutPassword } = foundUser;
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 