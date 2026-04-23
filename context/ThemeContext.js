import React, { createContext, useContext, useEffect, useState } from 'react';
import { getData, saveData } from '../services/storage';
import { darkTheme, lightTheme } from '../constants/theme';

const ThemeContext = createContext({});

const THEME_KEY = '@cantina_theme';

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [loadingTheme, setLoadingTheme] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  async function loadTheme() {
    try {
      const savedTheme = await getData(THEME_KEY);

      if (savedTheme && typeof savedTheme.isDark === 'boolean') {
        setIsDark(savedTheme.isDark);
      }
    } catch (error) {
      console.log('Erro ao carregar tema:', error);
    } finally {
      setLoadingTheme(false);
    }
  }

  async function toggleTheme() {
    const nextValue = !isDark;
    setIsDark(nextValue);
    await saveData(THEME_KEY, { isDark: nextValue });
  }

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        toggleTheme,
        loadingTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}