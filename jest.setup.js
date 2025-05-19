jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('react-native-keyboard-controller', () =>
  require('react-native-keyboard-controller/jest')
);
