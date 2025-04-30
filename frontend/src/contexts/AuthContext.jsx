import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const currentAccount = useCurrentAccount();
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (currentAccount) {
      authenticateWithBackend(currentAccount.address);
    } else {
      // Clear auth when wallet disconnects
      setToken(null);
      setUser(null);
      localStorage.removeItem('auth_token');
      setLoading(false);
    }
  }, [currentAccount]);
  
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);
  
  const authenticateWithBackend = async (walletAddress) => {
    try {
      setLoading(true);
      const response = await api.post('/wallet/auth', {
        wallet_address: walletAddress
      });
      
      const { access_token, wallet_address, expires_at } = response.data;
      
      localStorage.setItem('auth_token', access_token);
      setToken(access_token);
      
      // Set minimal user data (will be enriched by fetchUserProfile)
      setUser({
        wallet_address
      });
    } catch (error) {
      console.error('Authentication failed:', error);
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/me');
      
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Token might be invalid, clear auth
      if (error.response && error.response.status === 401) {
        setToken(null);
        setUser(null);
        localStorage.removeItem('auth_token');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!token && !!currentAccount,
        loading,
        token,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}