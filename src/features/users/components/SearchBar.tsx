import { useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  AccessibilityInfo,
} from 'react-native';
import { useSearch } from '../hooks/useSearch';

const SearchBar = () => {
  const { searchQuery, handleSearch } = useSearch();

  const handleChangeText = useCallback((text: string) => {
    handleSearch(text);
  }, [handleSearch]);

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="search"
      accessibilityLabel="Search users"
    >
      <TextInput
        style={styles.input}
        value={searchQuery}
        onChangeText={handleChangeText}
        placeholder="Search by name..."
        placeholderTextColor="#94a3b8"
        returnKeyType="search"
        clearButtonMode="while-editing"
        autoCorrect={false}
        autoCapitalize="none"
        accessibilityLabel="Search users by name"
        accessibilityHint="Type a name to filter the user list"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    fontSize: 14,
    color: '#1e293b',
    paddingVertical: 10,
  },
});

export default SearchBar;