import { createContext, useState, useCallback } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (!savedUser) return null;
      const parsed = JSON.parse(savedUser);

      // Normalize backend DTO keys (PascalCase) to camelCase used in UI
      const normalized = {
        id: parsed.id ?? parsed.Id ?? parsed.userId ?? parsed.UserId,
        email: parsed.email ?? parsed.Email,
        firstName: parsed.firstName ?? parsed.FirstName,
        lastName: parsed.lastName ?? parsed.LastName,
        applyAs: parsed.applyAs ?? parsed.ApplyAs,
        status: parsed.status ?? parsed.Status,
        phoneNumber: parsed.phoneNumber ?? parsed.PhoneNumber,
        username: parsed.username ?? parsed.Username ?? parsed.email ?? parsed.Email,
        // keep any other fields
        ...parsed,
      };

      return normalized;
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [expiresAtUtc, setExpiresAtUtc] = useState(() => localStorage.getItem('expiresAtUtc'));

  const login = useCallback((userData, newToken, expirationTime) => {
    // Normalize keys from backend DTO (PascalCase) to camelCase
    const normalized = {
      id: userData?.id ?? userData?.Id ?? userData?.userId ?? userData?.UserId,
      email: userData?.email ?? userData?.Email,
      firstName: userData?.firstName ?? userData?.FirstName,
      lastName: userData?.lastName ?? userData?.LastName,
      applyAs: userData?.applyAs ?? userData?.ApplyAs,
      status: userData?.status ?? userData?.Status,
      phoneNumber: userData?.phoneNumber ?? userData?.PhoneNumber,
      username: userData?.username ?? userData?.Username ?? userData?.email ?? userData?.Email,
      ...userData,
    };

    setUser(normalized);
    setToken(newToken);
    setExpiresAtUtc(expirationTime);

    localStorage.setItem('user', JSON.stringify(normalized));
    localStorage.setItem('token', newToken);
    if (expirationTime) {
      localStorage.setItem('expiresAtUtc', expirationTime);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setExpiresAtUtc(null);

    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAtUtc');
  }, []);

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{ user, token, expiresAtUtc, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
