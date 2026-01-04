import { StyleSheet } from 'react-native-unistyles';

const style = StyleSheet.create((theme, rt) => ({
  canvas: {
    // aspectRatio: 1,
    aspectRatio: rt.screen.width / rt.screen.height,
    // width: rt.screen.width,
    // height: rt.screen.height,
    // borderWidth: 2,
    // borderColor: 'red',
    alignSelf: 'center',
  },
}));

export default style;
