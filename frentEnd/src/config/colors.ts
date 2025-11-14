export const colors = {
  primary: {
    main: '#0891b2', // cyan-600
    light: '#06b6d4', // cyan-500
    dark: '#0e7490', // cyan-700
    bg: '#ecfeff', // cyan-50
    bgLight: '#cffafe', // cyan-100
  },
  secondary: {
    main: '#1e40af', // blue-800
    light: '#3b82f6', // blue-500
    dark: '#1e3a8a', // blue-900
    bg: '#eff6ff', // blue-50
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
  },
  white: '#ffffff',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
};

export const getColorClasses = () => ({
  // Backgrounds
  bgPrimary: 'bg-cyan-600',
  bgPrimaryLight: 'bg-cyan-500',
  bgPrimaryBg: 'bg-cyan-50',
  bgPrimaryBgLight: 'bg-cyan-100',
  bgSecondary: 'bg-blue-800',
  bgGradient: 'bg-gradient-to-br from-cyan-600 to-blue-900',
  bgGradientLight: 'bg-gradient-to-br from-cyan-50 to-blue-50',
  
  // Text colors
  textPrimary: 'text-cyan-600',
  textPrimaryLight: 'text-cyan-500',
  textSecondary: 'text-blue-800',
  textGray: 'text-gray-600',
  textGrayDark: 'text-gray-800',
  
  // Borders
  borderPrimary: 'border-cyan-600',
  borderGray: 'border-gray-300',
  
  // Hover states
  hoverBgPrimary: 'hover:bg-cyan-500',
  hoverTextPrimary: 'hover:text-cyan-500',
  hoverBgPrimaryLight: 'hover:bg-cyan-50',
  
  // Focus states
  focusBorderPrimary: 'focus:border-cyan-600',
  focusRingPrimary: 'focus:ring-cyan-100',
});
