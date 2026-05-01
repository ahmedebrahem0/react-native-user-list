import { useCallback, memo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useUsers } from '../hooks/useUsers';
import { useSearch } from '../hooks/useSearch';
import type { TransformedUser } from '../types';
import SearchBar from './SearchBar';
import SkeletonCard from './SkeletonCard';
import SortControls from './SortControls';
import StatsHeader from './StatsHeader';
import UserCard from './UserCard';

const SKELETON_ITEMS = Array.from({ length: 6 }, (_, index) => index);

const EmptyState = memo(({
  query,
  onClear,
}: {
  query: string;
  onClear: () => void;
}) => (
  <View
    style={styles.emptyContainer}
    accessible={true}
    accessibilityRole="text"
    accessibilityLabel={`No results for ${query}`}
  >
    <Text style={styles.emptyIllustration}>🔎</Text>
    <Text style={styles.emptyText}>No results for "{query}"</Text>
    <Text style={styles.emptySubText}>Try another name or clear your search.</Text>
    <Pressable
      style={styles.secondaryButton}
      onPress={onClear}
      accessibilityRole="button"
      accessibilityLabel="Clear search"
      accessibilityHint="Resets the search query"
    >
      <Text style={styles.secondaryButtonText}>Clear Search</Text>
    </Pressable>
  </View>
));

EmptyState.displayName = 'EmptyState';

const ErrorState = memo(({
  error,
  loading,
  onRetry,
}: {
  error: string;
  loading: boolean;
  onRetry: () => void;
}) => (
  <View style={styles.feedbackContainer}>
    <Text style={styles.feedbackEmoji}>⚠️</Text>
    <Text style={styles.feedbackTitle}>Couldn't load users</Text>
    <Text style={styles.feedbackMessage}>{error}</Text>
    <Pressable
      style={styles.primaryButton}
      onPress={onRetry}
      disabled={loading}
      accessibilityRole="button"
      accessibilityLabel="Retry loading users"
      accessibilityState={{ disabled: loading }}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" accessibilityLabel="Retrying request" />
      ) : (
        <Text style={styles.primaryButtonText}>Retry</Text>
      )}
    </Pressable>
  </View>
));

ErrorState.displayName = 'ErrorState';

const Separator = memo(() => <View style={styles.separator} />);

Separator.displayName = 'Separator';

const LoadMoreButton = memo(({
  onPress,
  loading,
}: {
  onPress: () => void;
  loading: boolean;
}) => (
  <Pressable
    style={styles.loadMoreButton}
    onPress={onPress}
    disabled={loading}
    accessibilityRole="button"
    accessibilityLabel="Load more users"
    accessibilityState={{ disabled: loading }}
  >
    {loading ? (
      <ActivityIndicator
        size="small"
        color="#3b82f6"
        accessibilityLabel="Loading more users"
      />
    ) : (
      <Text style={styles.loadMoreText}>Load More</Text>
    )}
  </Pressable>
));

LoadMoreButton.displayName = 'LoadMoreButton';

const UserList = () => {
  const {
    loading,
    refreshing,
    error,
    hasMore,
    handleLoadMore,
    handleRefresh,
    handleRetry,
  } = useUsers();
  const {
    filteredUsers,
    searchQuery,
    sortBy,
    stats,
    handleSortChange,
    clearSearch,
  } = useSearch();

  const handleUserPress = useCallback((userId: number) => {
    router.push(`/users/${userId}`);
  }, []);

  const keyExtractor = useCallback(
    (item: TransformedUser) => item.id.toString(),
    []
  );

  const renderItem: ListRenderItem<TransformedUser> = useCallback(
    ({ item }) => (
      <UserCard
        user={item}
        searchQuery={searchQuery}
        onPress={handleUserPress}
      />
    ),
    [handleUserPress, searchQuery]
  );

  const ListHeader = useCallback(
    () => (
      <View>
        <StatsHeader
          totalLoaded={stats.totalLoaded}
          totalMatching={stats.totalMatching}
        />
        <SearchBar />
        <SortControls sortBy={sortBy} onChange={handleSortChange} />
        {error && filteredUsers.length > 0 ? (
          <Text
            style={styles.inlineErrorText}
            accessible={true}
            accessibilityRole="alert"
          >
            {error}
          </Text>
        ) : null}
      </View>
    ),
    [error, filteredUsers.length, handleSortChange, sortBy, stats.totalLoaded, stats.totalMatching]
  );

  const ListFooter = useCallback(
    () =>
      hasMore && !searchQuery.trim() ? (
        <LoadMoreButton onPress={handleLoadMore} loading={loading && !refreshing} />
      ) : null,
    [handleLoadMore, hasMore, loading, refreshing, searchQuery]
  );

  if (loading && filteredUsers.length === 0 && !error && !refreshing) {
    return (
      <View style={styles.listContent}>
        <StatsHeader totalLoaded={0} totalMatching={0} />
        <SearchBar />
        <SortControls sortBy={sortBy} onChange={handleSortChange} />
        {SKELETON_ITEMS.map((item) => (
          <SkeletonCard key={item} />
        ))}
      </View>
    );
  }

  if (error && filteredUsers.length === 0) {
    return <ErrorState error={error} loading={loading} onRetry={handleRetry} />;
  }

  return (
    <FlatList
      data={filteredUsers}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={ListHeader}
      ListFooterComponent={ListFooter}
      ListEmptyComponent={
        searchQuery.trim()
          ? <EmptyState query={searchQuery.trim()} onClear={clearSearch} />
          : null
      }
      ItemSeparatorComponent={Separator}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#3b82f6"
          accessibilityLabel="Refresh users"
        />
      }
      removeClippedSubviews={true}
      maxToRenderPerBatch={8}
      windowSize={5}
      initialNumToRender={6}
      updateCellsBatchingPeriod={30}
      getItemLayout={(_data, index) => ({
        length: 98,
        offset: 98 * index,
        index,
      })}
      accessible={false}
      accessibilityLabel="Users list"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingTop: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  separator: {
    height: 0,
  },
  feedbackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  feedbackEmoji: {
    fontSize: 42,
    marginBottom: 12,
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  feedbackMessage: {
    fontSize: 14,
    lineHeight: 21,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  primaryButton: {
    minWidth: 140,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#2563eb',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  inlineErrorText: {
    color: '#ef4444',
    fontSize: 13,
    textAlign: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  loadMoreButton: {
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  loadMoreText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  emptyIllustration: {
    fontSize: 38,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
    textAlign: 'center',
  },
  secondaryButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#fef3c7',
  },
  secondaryButtonText: {
    color: '#92400e',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default UserList;
