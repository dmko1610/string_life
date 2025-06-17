import { MD3DarkTheme, MD3LightTheme, MD3Theme } from 'react-native-paper';

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#DE7E00',
    secondary: '#735943',
    tertiary: '#5a6238',
    error: '#ba1a1a',
    primaryContainer: '#ffdcc1',
    onPrimaryContainer: '#6b3b03',
    secondaryContainer: '#ffdcc1',
    onSecondaryContainer: '#5a422d',
    tertiaryContainer: '#dfe8b2',
    onTertiaryContainer: '#434a23',
    errorContainer: '#ffdad6',
    onErrorContainer: '#93000a',
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#ffb878',
    onPrimary: '#4c2700',
    secondary: '#e2c0a5',
    onSecondary: '#412c19',
    tertiary: '#c3cb98',
    onTertiary: '#2d330e',
    error: '#ffb4ab',
    onError: '#690005',
    primaryContainer: '#6b3b03',
    onPrimaryContainer: '#ffdcc1',
    secondaryContainer: '#5a422d',
    onSecondaryContainer: '#ffdcc1',
    tertiaryContainer: '#434a23',
    onTertiaryContainer: '#dfe8b2',
    errorContainer: '#93000a',
    onErrorContainer: '#ffdad6',
  },
};
