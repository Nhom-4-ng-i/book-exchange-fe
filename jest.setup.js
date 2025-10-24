/* eslint-disable no-undef */
// Setup file for Jest tests

// Add custom matchers for React Native
import '@testing-library/jest-native/extend-expect';

// Mock React Native Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  
  // Mock the default export and any specific methods you use
  return {
    ...Reanimated,
    useSharedValue: jest.fn(Reanimated.useSharedValue),
    useAnimatedStyle: jest.fn(style => () => style()),
    withTiming: jest.fn(Reanimated.withTiming),
    withSpring: jest.fn(Reanimated.withSpring),
    runOnJS: jest.fn(fn => fn),
  };
});

// Mock expo modules
jest.mock('expo-constants', () => ({
  manifest: {},
  sessionId: 'test-session-id',
  systemFonts: [],
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    /* Buttons */
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    /* Other */
    FlatList: View,
    gestureHandlerRootHOC: jest.fn(),
    Directions: {},
  };
});

// Mock react-native-vector-icons
jest.mock('@expo/vector-icons', () => ({
  FontAwesome: 'FontAwesome',
  MaterialIcons: 'MaterialIcons',
  AntDesign: 'AntDesign',
  // Add other icon families as needed
}));