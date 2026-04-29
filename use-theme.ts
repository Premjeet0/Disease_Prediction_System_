import { useTheme as useNextTheme } from 'next-themes';

/**
 * Re-export next-themes useTheme hook for convenience
 *
 * Usage:
 * const { theme, setTheme } = useTheme();
 * setTheme('dark'); // 'light' | 'dark' | 'system'
 */
export const useTheme = useNextTheme;
