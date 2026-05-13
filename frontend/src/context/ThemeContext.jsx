import { createContext } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Dark mode is now the only theme
  return (
    <ThemeContext.Provider value={{ isDark: true }}>
      {children}
    </ThemeContext.Provider>
  );
}
