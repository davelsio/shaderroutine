import { StyleSheet } from 'react-native-unistyles';

const styles = StyleSheet.create((theme) => ({
  container: {
    gap: 10,
  },
  picker: {
    flex: 1,
    gap: 12,
  },
  label: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderPreview: {
    width: '25%',
  },
}));

export default styles;
