import { StyleSheet } from 'react-native-unistyles';

import { breakpoints } from './vars/breakpoints';
import { darkTheme } from './default-dark';
import { lightTheme } from './default-light';

type AppBreakpoints = typeof breakpoints;

type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

declare module 'react-native-unistyles' {
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
  breakpoints,
  settings: {
    adaptiveThemes: true,
  },
  themes: {
    dark: darkTheme,
    light: lightTheme,
  },
});
