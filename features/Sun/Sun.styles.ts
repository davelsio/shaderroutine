import { StyleSheet } from 'react-native-unistyles';

const styles = StyleSheet.create((theme, rt) => ({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  view: {
    flexGrow: 1,
    // justifyContent: 'center',
  },
  budget: {
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  canvas: {
    // flex: 1,
    ...StyleSheet.absoluteFillObject,
    width: rt.screen.width,
    height: rt.screen.height,
  },
}));

export default styles;
