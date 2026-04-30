import { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  AccessibilityInfo,
} from 'react-native';
import type { TransformedUser } from '../types';

interface UserCardProps {
  user: TransformedUser;
}

const UserCard = memo(({ user }: UserCardProps) => {
  return (
    <View
      style={styles.card}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`User: ${user.name}, Email: ${user.email}, Address: ${user.formattedAddress}`}
    >
      {/* Avatar */}
      <View
        style={styles.avatar}
        accessibilityElementsHidden={true}
        importantForAccessibility="no-hide-descendants"
      >
        <Text style={styles.avatarText}>
          {user.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text
          style={styles.name}
          numberOfLines={1}
          accessibilityRole="text"
        >
          {user.name}
        </Text>

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
    </View>
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
    backgroundColor: '#3b82f6',
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
