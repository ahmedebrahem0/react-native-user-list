import { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const SkeletonCard = memo(() => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [opacity]);

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <View style={styles.avatar} />
      <View style={styles.content}>
        <View style={[styles.line, styles.linePrimary]} />
        <View style={[styles.line, styles.lineSecondary]} />
        <View style={[styles.line, styles.lineTertiary]} />
      </View>
    </Animated.View>
  );
});

SkeletonCard.displayName = 'SkeletonCard';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 14,
    backgroundColor: '#e2e8f0',
  },
  content: {
    flex: 1,
  },
  line: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#e2e8f0',
    marginBottom: 8,
  },
  linePrimary: {
    width: '55%',
  },
  lineSecondary: {
    width: '72%',
  },
  lineTertiary: {
    width: '84%',
    marginBottom: 0,
  },
});

export default SkeletonCard;
