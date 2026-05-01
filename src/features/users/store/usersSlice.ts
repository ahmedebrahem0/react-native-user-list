import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';
import type { SortBy, TransformedUser, User, UsersState } from '../types';
import { USERS_API_URL } from '../../../config/env';
import { transformUsers } from '../../../utils/transformUser';
import {
  loadValidCache,
  removeFromStorage,
  saveCacheWithTimestamp,
} from '../../../utils/asyncStorage';

const USERS_CACHE_KEY = 'cached_users';
const PAGE_SIZE = 4;

interface FetchUsersArgs {
  page: number;
  forceRefresh?: boolean;
}

interface FetchUsersPayload {
  users: TransformedUser[];
  fromCache: boolean;
}

export const fetchUsers = createAsyncThunk<
  FetchUsersPayload,
  FetchUsersArgs,
  { rejectValue: string; state: RootState }
>(
  'users/fetchUsers',
  async ({ page, forceRefresh = false }, { getState, rejectWithValue }) => {
    try {
      if (page === 1 && forceRefresh) {
        await removeFromStorage(USERS_CACHE_KEY);
      }

      if (page === 1 && !forceRefresh) {
        const cached = await loadValidCache<TransformedUser[]>(USERS_CACHE_KEY);
        if (cached && cached.data.length > 0) {
          return { users: cached.data, fromCache: true };
        }
      }

      const response = await fetch(`${USERS_API_URL}?_page=${page}&_limit=${PAGE_SIZE}`);

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data: User[] = await response.json();
      const transformed = transformUsers(data);

      const existingUsers =
        page === 1 ? [] : getState().users.users;
      const mergedUsers =
        page === 1
          ? transformed
          : [...existingUsers, ...transformed.filter((user) =>
              !existingUsers.some((existingUser) => existingUser.id === user.id)
            )];

      await saveCacheWithTimestamp(USERS_CACHE_KEY, mergedUsers);

      return { users: transformed, fromCache: false };
    } catch {
      const cached = await loadValidCache<TransformedUser[]>(USERS_CACHE_KEY);
      if (page === 1 && !forceRefresh && cached && cached.data.length > 0) {
        return { users: cached.data, fromCache: true };
      }

      return rejectWithValue('Failed to fetch users and no valid cache is available.');
    }
  }
);

const initialState: UsersState = {
  users: [],
  loading: false,
  refreshing: false,
  retrying: false,
  error: null,
  searchQuery: '',
  page: 1,
  hasMore: true,
  sortBy: 'id',
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action: PayloadAction<SortBy>) => {
      state.sortBy = action.payload;
    },
    resetUsers: (state) => {
      state.users = [];
      state.page = 1;
      state.hasMore = true;
      state.error = null;
      state.loading = false;
      state.refreshing = false;
      state.retrying = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        const { forceRefresh = false } = action.meta.arg;
        state.loading = true;
        state.refreshing = forceRefresh;
        state.retrying = !forceRefresh && state.users.length === 0 && state.error !== null;
        if (!state.retrying) {
          state.error = null;
        }
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.retrying = false;
        state.error = null;

        const { users, fromCache } = action.payload;

        if (fromCache) {
          state.users = users;
          state.page = Math.floor(users.length / PAGE_SIZE) + 1;
          state.hasMore = users.length > 0 && users.length % PAGE_SIZE === 0;
          return;
        }

        if (action.meta.arg.page === 1) {
          state.users = users;
        } else {
          const existingIds = new Set(state.users.map((user) => user.id));
          const newUsers = users.filter((user) => !existingIds.has(user.id));
          state.users = [...state.users, ...newUsers];
        }

        state.hasMore = users.length === PAGE_SIZE;
        state.page = action.meta.arg.page + 1;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.retrying = false;
        state.error = action.payload ?? 'Failed to fetch users.';
      });
  },
});

export const { setSearchQuery, setSortBy, resetUsers } = usersSlice.actions;
export default usersSlice.reducer;
