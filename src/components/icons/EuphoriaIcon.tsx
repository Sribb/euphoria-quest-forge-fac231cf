import React from 'react';
import { getIconSvg, EUPHORIA_ICONS } from './euphoria-icons';
import { cn } from '@/lib/utils';

interface EuphoriaIconProps {
  name: string;
  size?: number;
  className?: string;
}

/**
 * Renders a custom Euphoria SVG icon by name.
 * Falls back to a generic icon if name not found.
 */
export const EuphoriaIcon: React.FC<EuphoriaIconProps> = ({ name, size = 24, className }) => {
  const svg = getIconSvg(name);
  return (
    <span
      className={cn("inline-flex items-center justify-center shrink-0", className)}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svg }}
      aria-hidden="true"
    />
  );
};

/**
 * Checks whether a string is a Euphoria icon name (vs an emoji).
 */
export function isEuphoriaIcon(value: string): boolean {
  return value in EUPHORIA_ICONS;
}
