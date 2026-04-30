import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchUsers } from '../store/usersSlice';
import {
  selectLoading,
  selectError,
  selectHasMore,
  selectPage,
} from '../store/selectors';

export const useUsers = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const hasMore = useAppSelector(selectHasMore);
  const page = useAppSelector(selectPage);

  // أول fetch لما الـ app يفتح
  useEffect(() => {
    dispatch(fetchUsers(1));
  }, [dispatch]);

  // Load More
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      dispatch(fetchUsers(page));
    }
  }, [dispatch, loading, hasMore, page]);

  return {
    loading,
    error,
    hasMore,
    handleLoadMore,
  };
};