import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SortBy } from '../types';

interface SortControlsProps {
  sortBy: SortBy;
  onChange: (value: SortBy) => void;
}

const OPTIONS: Array<{ label: string; value: SortBy }> = [
  { label: 'ID', value: 'id' },
  { label: 'Name A-Z', value: 'name-asc' },
  { label: 'Name Z-A', value: 'name-desc' },
];

const SortControls = memo(({ sortBy, onChange }: SortControlsProps) => {
  const handlePress = useCallback((value: SortBy) => {
    onChange(value);
  }, [onChange]);

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="radiogroup"
      accessibilityLabel="Sort users"
    >
      {OPTIONS.map((option) => {
        const isActive = option.value === sortBy;

        return (
          <Pressable
            key={option.value}
            style={[styles.option, isActive && styles.optionActive]}
            onPress={() => handlePress(option.value)}
            accessibilityRole="radio"
            accessibilityLabel={`Sort by ${option.label}`}
            accessibilityState={{ checked: isActive }}
            aria-checked={isActive}
          >
            <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
});

SortControls.displayName = 'SortControls';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  option: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#60a5fa',
  },
  optionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  optionTextActive: {
    color: '#1d4ed8',
  },
});

export default SortControls;
