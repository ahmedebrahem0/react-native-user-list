import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StatsHeaderProps {
  totalLoaded: number;
  totalMatching: number;
}

const StatsHeader = memo(({ totalLoaded, totalMatching }: StatsHeaderProps) => (
  <View
    style={styles.container}
    accessible={true}
    accessibilityRole="text"
    accessibilityLabel={`Showing ${totalMatching} of ${totalLoaded} users`}
  >
    <Text style={styles.label}>Users Overview</Text>
    <Text style={styles.value}>
      Showing {totalMatching} of {totalLoaded} users
    </Text>
  </View>
));

StatsHeader.displayName = 'StatsHeader';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
});

export default StatsHeader;
