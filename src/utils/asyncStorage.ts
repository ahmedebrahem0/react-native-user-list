import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CachedData<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL_MS = 10 * 60 * 1000;

export const isCacheValid = (timestamp: number) =>
  Date.now() - timestamp < CACHE_TTL_MS;

export const loadFromStorage = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? (JSON.parse(data) as T) : null;
  } catch {
    return null;
  }
};

export const saveToStorage = async <T>(key: string, value: T): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error('Failed to save to AsyncStorage');
  }
};

export const removeFromStorage = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    console.error('Failed to remove from AsyncStorage');
  }
};

export const loadValidCache = async <T>(
  key: string
): Promise<CachedData<T> | null> => {
  const cached = await loadFromStorage<CachedData<T>>(key);

  if (!cached) {
    return null;
  }

  if (!isCacheValid(cached.timestamp)) {
    await removeFromStorage(key);
    return null;
  }

  return cached;
};

export const saveCacheWithTimestamp = async <T>(
  key: string,
  data: T
): Promise<void> => {
  await saveToStorage<CachedData<T>>(key, {
    data,
    timestamp: Date.now(),
  });
};
