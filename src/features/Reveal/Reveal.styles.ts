import { StyleSheet } from 'react-native-unistyles';

export default StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  canvas: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    width: 100,
    height: 100,
  },
}));
