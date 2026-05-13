import { createContext, useState, useCallback } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [expiresAtUtc, setExpiresAtUtc] = useState(() => localStorage.getItem('expiresAtUtc'));

  const login = useCallback((userData, newToken, expirationTime) => {
    // Preserve avatar from localStorage if it exists (for avatars chosen during signup)
    const savedAvatar = localStorage.getItem('userAvatar');
    const userWithAvatar = {
      ...userData,
      ...(savedAvatar && { avatar: savedAvatar }),
    };

    setUser(userWithAvatar);
    setToken(newToken);
    setExpiresAtUtc(expirationTime);

    localStorage.setItem('user', JSON.stringify(userWithAvatar));
    localStorage.setItem('token', newToken);
    if (expirationTime) {
      localStorage.setItem('expiresAtUtc', expirationTime);
    }
  }, []);

  const logout = useCallback(() => {
    // Save avatar to persistent storage before clearing user
    if (user?.avatar) {
      localStorage.setItem('userAvatar', user.avatar);
    }

    setUser(null);
    setToken(null);
    setExpiresAtUtc(null);

    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAtUtc');
  }, [user]);

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{ user, token, expiresAtUtc, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
