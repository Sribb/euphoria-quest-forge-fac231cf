import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, FontSizes } from '@/constants/theme';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  source?: string | null;
  name?: string;
  size?: AvatarSize;
  backgroundColor?: string;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'md',
  backgroundColor,
  style,
}) => {
  const colors = Colors.dark;

  const getSizeStyles = (): { container: ViewStyle; fontSize: number } => {
    switch (size) {
      case 'sm':
        return { container: { width: 32, height: 32 }, fontSize: FontSizes.sm };
      case 'lg':
        return { container: { width: 64, height: 64 }, fontSize: FontSizes.xl };
      case 'xl':
        return { container: { width: 96, height: 96 }, fontSize: FontSizes['3xl'] };
      default:
        return { container: { width: 48, height: 48 }, fontSize: FontSizes.lg };
    }
  };

  const sizeStyles = getSizeStyles();

  const getInitials = (name: string): string => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (source) {
    return (
      <View style={[styles.container, sizeStyles.container, style]}>
        <Image source={{ uri: source }} style={styles.image} resizeMode="cover" />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        sizeStyles.container,
        {
          backgroundColor: backgroundColor || colors.primary,
        },
        style,
      ]}
    >
      <Text style={[styles.initials, { fontSize: sizeStyles.fontSize }]}>
        {name ? getInitials(name) : '?'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
