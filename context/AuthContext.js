import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSession, loginUser, logoutUser, registerUser } from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  async function loadSession() {
    try {
      const session = await getSession();

      if (session && session.loggedIn && session.user) {
        setUser(session.user);
      }
    } catch (error) {
      console.log('Erro ao carregar sessão:', error);
    } finally {
      setLoadingAuth(false);
    }
  }

  async function register(data) {
    return await registerUser(data);
  }

  async function login(email, senha) {
    const result = await loginUser(email, senha);

    if (result.success) {
      setUser(result.user);
    }

    return result;
  }

  async function logout() {
    await logoutUser();
    setUser(null);
  }

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loadingAuth,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}