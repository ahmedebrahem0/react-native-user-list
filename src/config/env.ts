const DEFAULT_USERS_API_URL = 'https://jsonplaceholder.typicode.com/users';

const LOCALHOST_URL_PATTERN = /^http:\/\/(localhost|127(?:\.\d{1,3}){3})(?::\d+)?(?:\/|$)/i;

const normalizeUsersApiUrl = (value: string | undefined) => {
  const trimmed = value?.trim();

  if (!trimmed) {
    return DEFAULT_USERS_API_URL;
  }

  if (trimmed.startsWith('https://') || LOCALHOST_URL_PATTERN.test(trimmed)) {
    return trimmed.replace(/\/+$/, '');
  }

  return DEFAULT_USERS_API_URL;
};

export const USERS_API_URL = normalizeUsersApiUrl(process.env.EXPO_PUBLIC_USERS_API_URL);
