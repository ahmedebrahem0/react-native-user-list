import { memo, useMemo } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import type { TransformedUser } from '../types';
import { getAvatarColor } from '../utils/avatar';

interface UserCardProps {
  user: TransformedUser;
  searchQuery: string;
  onPress: (userId: number) => void;
}

const renderHighlightedName = (name: string, searchQuery: string) => {
  const trimmedQuery = searchQuery.trim();

  if (!trimmedQuery) {
    return <Text style={styles.name}>{name}</Text>;
  }

  const normalizedName = name.toLowerCase();
  const normalizedQuery = trimmedQuery.toLowerCase();
  const matchIndex = normalizedName.indexOf(normalizedQuery);

  if (matchIndex === -1) {
    return <Text style={styles.name}>{name}</Text>;
  }

  const before = name.slice(0, matchIndex);
  const match = name.slice(matchIndex, matchIndex + trimmedQuery.length);
  const after = name.slice(matchIndex + trimmedQuery.length);

  return (
    <Text style={styles.name} numberOfLines={1} accessibilityRole="text">
      {before}
      <Text style={styles.highlight}>{match}</Text>
      {after}
    </Text>
  );
};

const UserCard = memo(({ user, searchQuery, onPress }: UserCardProps) => {
  const avatarColor = useMemo(() => getAvatarColor(user.id), [user.id]);

  return (
    <Pressable
      style={styles.card}
      onPress={() => onPress(user.id)}
      accessibilityRole="button"
      accessibilityLabel={`Open details for ${user.name}`}
      accessibilityHint="Shows the full user profile"
    >
      <View
        style={[styles.avatar, { backgroundColor: avatarColor }]}
        accessibilityElementsHidden={true}
        importantForAccessibility="no-hide-descendants"
      >
        <Text style={styles.avatarText}>
          {user.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={styles.content}>
        {renderHighlightedName(user.name, searchQuery)}

        <Text
          style={styles.email}
          numberOfLines={1}
          accessibilityRole="text"
        >
          {user.email}
        </Text>

        <Text
          style={styles.address}
          numberOfLines={2}
          accessibilityRole="text"
        >
          {user.formattedAddress}
        </Text>
      </View>
    </Pressable>
  );
});

UserCard.displayName = 'UserCard';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    flexShrink: 0,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  highlight: {
    backgroundColor: '#fde68a',
    color: '#0f172a',
    borderRadius: 4,
  },
  email: {
    fontSize: 13,
    color: '#64748b',
  },
  address: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 18,
  },
});

export default UserCard;
