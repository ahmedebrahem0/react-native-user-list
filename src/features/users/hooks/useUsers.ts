import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchUsers, resetUsers } from '../store/usersSlice';
import {
  selectLoading,
  selectRefreshing,
  selectRetrying,
  selectError,
  selectHasMore,
  selectPage,
} from '../store/selectors';

export const useUsers = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectLoading);
  const refreshing = useAppSelector(selectRefreshing);
  const retrying = useAppSelector(selectRetrying);
  const error = useAppSelector(selectError);
  const hasMore = useAppSelector(selectHasMore);
  const page = useAppSelector(selectPage);

  useEffect(() => {
    dispatch(fetchUsers({ page: 1 }));
  }, [dispatch]);

  const handleLoadMore = useCallback(() => {
    if (!loading && !refreshing && hasMore) {
      dispatch(fetchUsers({ page }));
    }
  }, [dispatch, hasMore, loading, page, refreshing]);

  const handleRefresh = useCallback(() => {
    dispatch(resetUsers());
    dispatch(fetchUsers({ page: 1, forceRefresh: true }));
  }, [dispatch]);

  const handleRetry = useCallback(() => {
    dispatch(fetchUsers({ page: 1 }));
  }, [dispatch]);

  return {
    loading,
    refreshing,
    retrying,
    error,
    hasMore,
    handleLoadMore,
    handleRefresh,
    handleRetry,
  };
};
