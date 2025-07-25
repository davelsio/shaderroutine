import { Dimensions } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

const SCREEN_WIDTH = Dimensions.get('screen').width;
export const ITEM_SIZE = SCREEN_WIDTH * 0.24;
export const ITEM_SPACING = 12;

const styles = StyleSheet.create((theme, rt) => ({
  carousel: {
    flexGrow: 0,
    height: ITEM_SIZE * 2,
  },
  carouselContainer: {
    gap: ITEM_SPACING,
    paddingHorizontal: (rt.screen.width - ITEM_SIZE) / 2,
  },
  carouselItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    borderWidth: 4,
  },
  carouselImage: {
    flex: 1,
    borderRadius: ITEM_SIZE / 2,
  },
}));

export default styles;
