import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { User, UsersState } from '../types';
import { transformUsers } from '../../../utils/transformUser';
import { loadFromStorage, saveToStorage } from '../../../utils/asyncStorage';

const USERS_CACHE_KEY = 'cached_users';
const API_URL = 'https://jsonplaceholder.typicode.com/users';
const PAGE_SIZE = 4;

// Thunk — fetch من API أو من Cache
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (page: number, { rejectWithValue }) => {
    try {
      // أول حاجة نجرب الـ cache
      if (page === 1) {
        const cached = await loadFromStorage<ReturnType<typeof transformUsers>>(USERS_CACHE_KEY);
        if (cached && cached.length > 0) {
          return { users: cached, fromCache: true };
        }
      }

      const response = await fetch(`${API_URL}?_page=${page}&_limit=${PAGE_SIZE}`);

      if (!response.ok) throw new Error('Failed to fetch users');

      const data: User[] = await response.json();
      const transformed = transformUsers(data);

      // نحفظ في الـ cache لو page 1
      if (page === 1) {
        await saveToStorage(USERS_CACHE_KEY, transformed);
      }

      return { users: transformed, fromCache: false };
    } catch (error) {
      // لو فشل الـ fetch، نرجع الـ cache
      const cached = await loadFromStorage<ReturnType<typeof transformUsers>>(USERS_CACHE_KEY);
      if (cached && cached.length > 0) {
        return { users: cached, fromCache: true };
      }
      return rejectWithValue('Failed to fetch users and no cache available');
    }
  }
);

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  searchQuery: '',
  page: 1,
  hasMore: true,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    resetUsers: (state) => {
      state.users = [];
      state.page = 1;
      state.hasMore = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        const { users, fromCache } = action.payload;

        if (fromCache) {
          state.users = users;
          state.hasMore = false;
        } else {
          // نضيف الـ users الجدد للـ existing list
          const existingIds = new Set(state.users.map(u => u.id));
          const newUsers = users.filter(u => !existingIds.has(u.id));
          state.users = [...state.users, ...newUsers];
          state.hasMore = users.length === PAGE_SIZE;
          state.page += 1;
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchQuery, resetUsers } = usersSlice.actions;
export default usersSlice.reducer;