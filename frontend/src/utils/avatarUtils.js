import { API_BASE_URL } from '../services/api';

function buildFallbackAvatar(email) {
  return email ? `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}` : null;
}

export function resolveAvatarUrl(avatar, email) {
  const fallbackAvatar = buildFallbackAvatar(email);

  if (typeof avatar !== 'string' || !avatar.trim()) {
    return fallbackAvatar;
  }

  const trimmedAvatar = avatar.trim();

  if (/^(data:image\/|https?:\/\/|blob:)/i.test(trimmedAvatar)) {
    return trimmedAvatar;
  }

  const baseUrl = API_BASE_URL.replace(/\/+$/, '');
  const normalizedPath = trimmedAvatar.replace(/^\/+/, '');

  return `${baseUrl}/${normalizedPath}`;
}

export function getAvatarFallback(email) {
  return buildFallbackAvatar(email);
}