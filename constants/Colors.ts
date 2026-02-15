export const Colors = {
  light: {
    primary: '#2563EB',
    primaryDark: '#1E40AF',
    background: '#F8FAFC',
    card: '#FFFFFF',
    text: '#0F172A',
    textSecondary: '#475569',
    border: '#E2E8F0',
    gray: '#94A3B8',
    grayLight: '#F1F5F9',
    danger: '#EF4444',
    success: '#10B981',
    orange: '#F59E0B',
  },
  dark: {
    primary: '#3B82F6',
    primaryDark: '#2563EB',
    background: '#020617',
    card: '#0F172A',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    border: '#1E293B',
    gray: '#475569',
    grayLight: '#0F172A',
    danger: '#F87171',
    success: '#34D399',
    orange: '#FBBF24',
  },
};

export type ThemeColors = typeof Colors.light;
