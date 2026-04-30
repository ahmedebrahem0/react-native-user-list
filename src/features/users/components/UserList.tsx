import { useCallback } from 'react';
import {
  FlatList,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import { useUsers } from '../hooks/useUsers';
import { useSearch } from '../hooks/useSearch';
import type { TransformedUser } from '../types';
import UserCard from './UserCard';
import SearchBar from './SearchBar';

const EmptyState = () => (
  <View
    style={styles.emptyContainer}
    accessible={true}
    accessibilityRole="text"
    accessibilityLabel="No users found"
  >
    <Text style={styles.emptyText}>No users found</Text>
    <Text style={styles.emptySubText}>Try a different search term</Text>
  </View>
);

const Separator = () => <View style={styles.separator} />;

const LoadMoreButton = ({
  onPress,
  loading,
}: {
  onPress: () => void;
  loading: boolean;
}) => (
  <TouchableOpacity
    style={styles.loadMoreButton}
    onPress={onPress}
    disabled={loading}
    accessible={true}
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
  </TouchableOpacity>
);

const UserList = () => {
  const { loading, error, hasMore, handleLoadMore } = useUsers();
  const { filteredUsers, searchQuery } = useSearch();

  // مهم جداً للـ FlatList performance
  const keyExtractor = useCallback(
    (item: TransformedUser) => item.id.toString(),
    []
  );

  const renderItem: ListRenderItem<TransformedUser> = useCallback(
    ({ item }) => <UserCard user={item} />,
    []
  );

  const ListHeader = useCallback(
    () => (
      <View>
        <SearchBar />
        {error && (
          <Text
            style={styles.errorText}
            accessible={true}
            accessibilityRole="alert"
          >
            {error}
          </Text>
        )}
      </View>
    ),
    [error]
  );

  const ListFooter = useCallback(
    () =>
      hasMore && !searchQuery ? (
        <LoadMoreButton onPress={handleLoadMore} loading={loading} />
      ) : null,
    [hasMore, searchQuery, loading, handleLoadMore]
  );

  if (loading && filteredUsers.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#3b82f6"
          accessibilityLabel="Loading users"
        />
      </View>
    );
  }

  return (
    <FlatList
      data={filteredUsers}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={ListHeader}
      ListFooterComponent={ListFooter}
      ListEmptyComponent={EmptyState}
      ItemSeparatorComponent={Separator}
      // Performance Optimization
      removeClippedSubviews={true}
      maxToRenderPerBatch={8}
      windowSize={5}
      initialNumToRender={6}
      updateCellsBatchingPeriod={30}
      getItemLayout={(_data, index) => ({
        length: 90,
        offset: 90 * index,
        index,
      })}
      // Accessibility
      accessible={false}
      accessibilityLabel="Users list"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  separator: {
    height: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  emptySubText: {
    fontSize: 13,
    color: '#94a3b8',
  },
  errorText: {
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
});

export default UserList;