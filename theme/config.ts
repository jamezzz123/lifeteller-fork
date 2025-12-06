import { colors } from './colors';
import { typography } from './typography';

/**
 * Theme configuration that can be imported throughout the app.
 * This provides access to colors and typography values used in both
 * Tailwind classes and TypeScript code.
 *
 * @example
 * ```typescript
 * import { themeConfig } from '@/theme/config';
 *
 * // Use colors
 * const primaryColor = themeConfig.colors.primary.purple;
 * const backgroundColor = themeConfig.colors.background;
 * const greyAlpha = themeConfig.colors['grey-alpha']['400'];
 *
 * // Use typography
 * const primaryFont = themeConfig.typography.primary.normal;
 * const boldFont = themeConfig.typography.primary.bold;
 * ```
 */
export const themeConfig = {
  colors,
  typography,
} as const;

/**
 * Tailwind theme values extracted from the config.
 * Use this when you need to access theme values in TypeScript.
 *
 * @example
 * ```typescript
 * import { tailwindTheme } from '@/theme/config';
 *
 * // Access Tailwind theme colors
 * const primaryColor = tailwindTheme.colors.primary;
 * const primaryTint = tailwindTheme.colors['primary-tints']['100'];
 * const greyAlpha = tailwindTheme.colors['grey-alpha']['400'];
 * ```
 */
export const tailwindTheme = {
  colors: {
    primary: colors.primary.purple,
    'primary-tints': colors['primary-tints'].purple,
    'grey-alpha': colors['grey-alpha'],
    'grey-plain': colors['grey-plain'],
    background: colors.background,
  },
} as const;

/**
 * Default export for convenient importing.
 *
 * @example
 * ```typescript
 * import themeConfig from '@/theme/config';
 *
 * // Use in StyleSheet
 * const styles = StyleSheet.create({
 *   container: {
 *     backgroundColor: themeConfig.colors.background,
 *   },
 *   text: {
 *     color: themeConfig.colors.primary.purple,
 *     fontFamily: themeConfig.typography.primary.normal,
 *   },
 * });
 * ```
 */
export default themeConfig;
