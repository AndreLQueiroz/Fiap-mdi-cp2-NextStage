import React, { createContext, useContext, useEffect, useState } from 'react';
import { getData, removeData, saveData } from '../services/storage';

const AuthContext = createContext({});

const USER_KEY = '@cantina_user';
const SESSION_KEY = '@cantina_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  async function loadSession() {
    try {
      const session = await getData(SESSION_KEY);

      if (session && session.loggedIn && session.user) {
        setUser(session.user);
      }
    } catch (error) {
      console.log('Erro ao carregar sessão:', error);
    } finally {
      setLoadingAuth(false);
    }
  }

  async function register({ nome, email, senha }) {
    try {
      const existingUser = await getData(USER_KEY);

      if (existingUser && existingUser.email === email.toLowerCase().trim()) {
        return {
          success: false,
          message: 'Já existe um usuário cadastrado com este e-mail.',
        };
      }

      const newUser = {
        nome: nome.trim(),
        email: email.toLowerCase().trim(),
        senha,
      };

      const saved = await saveData(USER_KEY, newUser);

      if (!saved) {
        return {
          success: false,
          message: 'Não foi possível salvar o cadastro.',
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao cadastrar usuário.',
      };
    }
  }

  async function login(email, senha) {
    try {
      const storedUser = await getData(USER_KEY);

      if (!storedUser) {
        return {
          success: false,
          message: 'Nenhum usuário cadastrado. Faça seu cadastro primeiro.',
        };
      }

      const validEmail = storedUser.email === email.toLowerCase().trim();
      const validPassword = storedUser.senha === senha;

      if (!validEmail || !validPassword) {
        return {
          success: false,
          message: 'E-mail ou senha inválidos.',
        };
      }

      const sessionData = {
        loggedIn: true,
        user: storedUser,
      };

      const saved = await saveData(SESSION_KEY, sessionData);

      if (!saved) {
        return {
          success: false,
          message: 'Erro ao iniciar sessão.',
        };
      }

      setUser(storedUser);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao fazer login.',
      };
    }
  }

  async function logout() {
    await removeData(SESSION_KEY);
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