import { useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchUsers } from '../store/usersSlice';
import { selectLoading, selectUserById } from '../store/selectors';
import { getAvatarColor } from '../utils/avatar';

const DetailSection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const DetailRow = ({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress?: () => void;
}) => {
  if (onPress) {
    return (
      <Pressable
        style={styles.row}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value}`}
      >
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={[styles.rowValue, styles.rowLink]}>{value}</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
};

const UserDetailScreen = () => {
  const dispatch = useAppDispatch();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const parsedUserId = Number(userId);
  const user = useAppSelector((state) => selectUserById(state, parsedUserId));
  const loading = useAppSelector(selectLoading);

  useEffect(() => {
    if (!user && Number.isFinite(parsedUserId)) {
      dispatch(fetchUsers({ page: 1 }));
    }
  }, [dispatch, parsedUserId, user]);

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${user?.email}`);
  };

  const handleWebsitePress = () => {
    const websiteUrl = user?.website?.startsWith('http')
      ? user.website
      : `https://${user?.website}`;

    if (websiteUrl) {
      Linking.openURL(websiteUrl);
    }
  };

  const handlePhonePress = () => {
    if (user?.phone) {
      Linking.openURL(`tel:${user.phone}`);
    }
  };

  if (!user && loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFoundTitle}>User not found</Text>
        <Text style={styles.notFoundText}>
          This profile is unavailable right now. Go back to the list and try again.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      accessibilityLabel={`Details for ${user.name}`}
    >
      <View style={styles.hero}>
        <View style={[styles.avatar, { backgroundColor: getAvatarColor(user.id) }]}>
          <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.username}>@{user.username}</Text>
      </View>

      <DetailSection title="Contact">
        <DetailRow label="Email" value={user.email} onPress={handleEmailPress} />
        <DetailRow label="Phone" value={user.phone} onPress={handlePhonePress} />
        <DetailRow label="Website" value={user.website} onPress={handleWebsitePress} />
      </DetailSection>

      <DetailSection title="Address">
        <DetailRow label="Street" value={user.address.street} />
        <DetailRow label="Suite" value={user.address.suite} />
        <DetailRow label="City" value={user.address.city} />
        <DetailRow label="Zipcode" value={user.address.zipcode} />
      </DetailSection>

      <DetailSection title="Company">
        <DetailRow label="Name" value={user.company.name} />
        <DetailRow label="Catch phrase" value={user.company.catchPhrase} />
      </DetailSection>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#f8fafc',
  },
  hero: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  username: {
    marginTop: 4,
    fontSize: 15,
    color: '#64748b',
  },
  section: {
    padding: 18,
    marginBottom: 14,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  row: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  rowLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  rowValue: {
    fontSize: 15,
    color: '#0f172a',
    lineHeight: 22,
  },
  rowLink: {
    color: '#2563eb',
  },
  notFoundTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  notFoundText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#64748b',
    textAlign: 'center',
  },
});

export default UserDetailScreen;
