import { StyleSheet } from 'react-native-unistyles';

const styles = StyleSheet.create((theme, rt) => ({
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  canvas: {
    ...StyleSheet.absoluteFillObject,
    width: rt.screen.width,
    height: rt.screen.height,
  },
  picker: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 40,
  },
  controls: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: rt.insets.bottom + 20,
    gap: 30,
  },
}));

export default styles;
