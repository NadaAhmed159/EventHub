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
        profileImageUrl: parsed.profileImageUrl ?? parsed.ProfileImageUrl ?? parsed.Avatar,
        username: parsed.username ?? parsed.Username ?? parsed.email ?? parsed.Email,
        // keep any other fields
        ...parsed,
      };

      // Ensure avatar is set from profileImageUrl or fallback
      if (!normalized.avatar && normalized.profileImageUrl) normalized.avatar = normalized.profileImageUrl;
      if (!normalized.avatar && normalized.email) normalized.avatar = `https://i.pravatar.cc/150?u=${encodeURIComponent(normalized.email)}`;

      return normalized;
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
    // Normalize keys from backend DTO (PascalCase) to camelCase
    const normalized = {
      id: userData?.id ?? userData?.Id ?? userData?.userId ?? userData?.UserId,
      email: userData?.email ?? userData?.Email,
      firstName: userData?.firstName ?? userData?.FirstName,
      lastName: userData?.lastName ?? userData?.LastName,
      applyAs: userData?.applyAs ?? userData?.ApplyAs,
      status: userData?.status ?? userData?.Status,
      phoneNumber: userData?.phoneNumber ?? userData?.PhoneNumber,
      profileImageUrl: userData?.profileImageUrl ?? userData?.ProfileImageUrl ?? userData?.Avatar,
      username: userData?.username ?? userData?.Username ?? userData?.email ?? userData?.Email,
      ...userData,
    };

    const avatarFromBackend = normalized?.avatar || normalized?.profileImageUrl || null;
    const resolvedAvatar = savedAvatar || avatarFromBackend || (normalized?.email ? `https://i.pravatar.cc/150?u=${encodeURIComponent(normalized.email)}` : null);

    const userWithAvatar = {
      ...normalized,
      ...(resolvedAvatar && { avatar: resolvedAvatar }),
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
