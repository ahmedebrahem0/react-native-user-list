import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setSearchQuery } from '../store/usersSlice';
import { selectSearchQuery, selectFilteredUsers } from '../store/selectors';

export const useSearch = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(selectSearchQuery);
  const filteredUsers = useAppSelector(selectFilteredUsers);

  const handleSearch = useCallback((query: string) => {
    dispatch(setSearchQuery(query));
  }, [dispatch]);

  return {
    searchQuery,
    filteredUsers,
    handleSearch,
  };
};