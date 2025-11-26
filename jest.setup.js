/* eslint-disable no-undef */
// Setup file for Jest tests

// Add custom matchers for React Native
import "@testing-library/jest-native/extend-expect";

// Polyfill setImmediate / clearImmediate cho môi trường Jest (Node/jsdom)
const g = globalThis;

if (typeof g.setImmediate === "undefined") {
  g.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

if (typeof g.clearImmediate === "undefined") {
  g.clearImmediate = (id) => {
    clearTimeout(id);
  };
}

// Mock React Native Reanimated - simple manual mock to avoid ESM issues
jest.mock("react-native-reanimated", () => {
  const ReactNative = require("react-native");

  const Animated = {
    // Used in onboarding: Animated.createAnimatedComponent(Pressable)
    createAnimatedComponent: (Component) => Component,
    // Also allow using <Animated.View />
    View: ReactNative.View,
  };

  return {
    __esModule: true,
    default: Animated,
    // Hooks and helpers used in onboarding / AnimatedDot
    useSharedValue: jest.fn((initial) => ({ value: initial })),
    useAnimatedStyle: jest.fn((fn) => fn()),
    withTiming: jest.fn((value) => value),
    withSpring: jest.fn((value) => value),
    runOnJS: jest.fn((fn) => fn),
    Easing: {
      bezier: jest.fn(),
    },
  };
});

// Mock expo modules
jest.mock("expo-constants", () => ({
  manifest: {},
  sessionId: "test-session-id",
  systemFonts: [],
}));

// Mock react-native-gesture-handler
jest.mock("react-native-gesture-handler", () => {
  const View = require("react-native/Libraries/Components/View/View");
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
jest.mock("@expo/vector-icons", () => ({
  FontAwesome: "FontAwesome",
  MaterialIcons: "MaterialIcons",
  AntDesign: "AntDesign",
  // Add other icon families as needed
}));

// Mock AsyncStorage to avoid NativeModule errors in Jest
jest.mock("@react-native-async-storage/async-storage", () => {
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(async () => null),
      setItem: jest.fn(async () => {}),
      removeItem: jest.fn(async () => {}),
      clear: jest.fn(async () => {}),
      getAllKeys: jest.fn(async () => []),
      multiGet: jest.fn(async () => []),
      multiSet: jest.fn(async () => {}),
      multiRemove: jest.fn(async () => {}),
    },
  };
});
