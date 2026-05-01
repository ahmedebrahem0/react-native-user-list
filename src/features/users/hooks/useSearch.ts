import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setSearchQuery, setSortBy } from '../store/usersSlice';
import {
  selectSearchQuery,
  selectSortBy,
  selectSortedFilteredUsers,
  selectUsersStats,
} from '../store/selectors';
import type { SortBy } from '../types';

export const useSearch = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(selectSearchQuery);
  const sortBy = useAppSelector(selectSortBy);
  const filteredUsers = useAppSelector(selectSortedFilteredUsers);
  const stats = useAppSelector(selectUsersStats);

  const handleSearch = useCallback((query: string) => {
    dispatch(setSearchQuery(query));
  }, [dispatch]);

  const handleSortChange = useCallback((value: SortBy) => {
    dispatch(setSortBy(value));
  }, [dispatch]);

  const clearSearch = useCallback(() => {
    dispatch(setSearchQuery(''));
  }, [dispatch]);

  return {
    searchQuery,
    sortBy,
    filteredUsers,
    stats,
    handleSearch,
    handleSortChange,
    clearSearch,
  };
};
