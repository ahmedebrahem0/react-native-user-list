import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';
import type { SortBy, TransformedUser } from '../types';

const selectUsersState = (state: RootState) => state.users;
const selectUserId = (_state: RootState, userId: number) => userId;

const sortUsers = (users: TransformedUser[], sortBy: SortBy) => {
  const sortedUsers = [...users];

  switch (sortBy) {
    case 'name-asc':
      return sortedUsers.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sortedUsers.sort((a, b) => b.name.localeCompare(a.name));
    case 'id':
    default:
      return sortedUsers.sort((a, b) => a.id - b.id);
  }
};

export const selectAllUsers = createSelector(
  selectUsersState,
  (usersState) => usersState.users
);

export const selectSearchQuery = createSelector(
  selectUsersState,
  (usersState) => usersState.searchQuery
);

export const selectSortBy = createSelector(
  selectUsersState,
  (usersState) => usersState.sortBy
);

export const selectLoading = createSelector(
  selectUsersState,
  (usersState) => usersState.loading
);

export const selectRefreshing = createSelector(
  selectUsersState,
  (usersState) => usersState.refreshing
);

export const selectRetrying = createSelector(
  selectUsersState,
  (usersState) => usersState.retrying
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
    if (!searchQuery.trim()) {
      return users;
    }

    const query = searchQuery.toLowerCase().trim();
    return users.filter((user) => user.name.toLowerCase().includes(query));
  }
);

export const selectSortedFilteredUsers = createSelector(
  selectFilteredUsers,
  selectSortBy,
  (users, sortBy) => sortUsers(users, sortBy)
);

export const selectUsersStats = createSelector(
  selectAllUsers,
  selectSortedFilteredUsers,
  (users, filteredUsers) => ({
    totalLoaded: users.length,
    totalMatching: filteredUsers.length,
  })
);

export const selectUserById = createSelector(
  selectAllUsers,
  selectUserId,
  (users, userId) => users.find((user) => user.id === userId) ?? null
);
