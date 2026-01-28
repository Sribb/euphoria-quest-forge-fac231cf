import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { Colors, BorderRadius } from '@/constants/theme';
import { useEffect } from 'react';

interface ProgressProps {
  value: number;
  max?: number;
  color?: string;
  backgroundColor?: string;
  height?: number;
  showAnimation?: boolean;
  style?: ViewStyle;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  color,
  backgroundColor,
  height = 8,
  showAnimation = true,
  style,
}) => {
  const colors = Colors.dark;
  const progressColor = color || colors.primary;
  const bgColor = backgroundColor || colors.secondary;

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const animatedWidth = useSharedValue(0);

  useEffect(() => {
    if (showAnimation) {
      animatedWidth.value = withTiming(percentage, { duration: 500 });
    } else {
      animatedWidth.value = percentage;
    }
  }, [percentage, showAnimation]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%`,
  }));

  return (
    <View style={[styles.container, { backgroundColor: bgColor, height }, style]}>
      <Animated.View
        style={[
          styles.progress,
          {
            backgroundColor: progressColor,
            height,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: BorderRadius.full,
  },
});
