import React from 'react';
import { View, StyleSheet, ViewStyle, ViewProps } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/theme';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  children,
  style,
  ...props
}) => {
  const colors = Colors.dark;

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.card,
          ...Shadows.md,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
        };
      default:
        return {
          backgroundColor: colors.card,
        };
    }
  };

  const getPaddingStyles = (): ViewStyle => {
    switch (padding) {
      case 'none':
        return {};
      case 'sm':
        return { padding: Spacing.sm };
      case 'lg':
        return { padding: Spacing.lg };
      default:
        return { padding: Spacing.md };
    }
  };

  return (
    <View style={[styles.container, getVariantStyles(), getPaddingStyles(), style]} {...props}>
      {children}
    </View>
  );
};

interface CardHeaderProps extends ViewProps {
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, style, ...props }) => (
  <View style={[styles.header, style]} {...props}>
    {children}
  </View>
);

interface CardTitleProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, style }) => {
  const colors = Colors.dark;
  return (
    <View style={style}>
      {typeof children === 'string' ? (
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {React.isValidElement(children) ? children : null}
          </View>
        </View>
      ) : (
        children
      )}
    </View>
  );
};

interface CardContentProps extends ViewProps {
  children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({ children, style, ...props }) => (
  <View style={[styles.content, style]} {...props}>
    {children}
  </View>
);

interface CardFooterProps extends ViewProps {
  children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, style, ...props }) => (
  <View style={[styles.footer, style]} {...props}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  header: {
    paddingBottom: Spacing.sm,
  },
  content: {
    paddingTop: Spacing.xs,
  },
  footer: {
    paddingTop: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
