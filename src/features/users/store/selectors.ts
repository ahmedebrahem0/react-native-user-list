import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

const selectUsersState = (state: RootState) => state.users;

export const selectAllUsers = createSelector(
  selectUsersState,
  (usersState) => usersState.users
);

export const selectSearchQuery = createSelector(
  selectUsersState,
  (usersState) => usersState.searchQuery
);

export const selectLoading = createSelector(
  selectUsersState,
  (usersState) => usersState.loading
);

export const selectError = createSelector(
  selectUsersState,
  (usersState) => usersState.error
);

export const selectHasMore = createSelector(
  selectUsersState,
  (usersState) => usersState.hasMore
);

export const selectPage = createSelector(
  selectUsersState,
  (usersState) => usersState.page
);

export const selectFilteredUsers = createSelector(
  selectAllUsers,
  selectSearchQuery,
  (users, searchQuery) => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase().trim();
    return users.filter(user =>
      user.name.toLowerCase().includes(query)
    );
  }
);