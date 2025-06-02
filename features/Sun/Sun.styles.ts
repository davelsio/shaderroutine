import { StyleSheet } from 'react-native-unistyles';

const styles = StyleSheet.create((theme, rt) => ({
  safeArea: {
    flex: 1,
  },
  canvas: {
    ...StyleSheet.absoluteFillObject,
    width: rt.screen.width,
    height: rt.screen.height,
  },
  controls: {
    flex: 1,
    padding: 20,
    paddingBottom: 40,
    gap: 20,
  },
  picker: {
    gap: 10,
  },
  hueSlider: {
    flex: 1,
    gap: 8,
  },
}));

export default styles;
