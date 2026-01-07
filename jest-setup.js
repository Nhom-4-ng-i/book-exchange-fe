import "react-native-gesture-handler/jestSetup";

jest.mock("expo-router", () => {
  const actual = jest.requireActual("expo-router");
  const React = require("react");

  const MockStack = ({ children }) => <>{children}</>;
  MockStack.Screen = ({ children }) => <>{children}</>;

  return {
    ...actual,
    Stack: MockStack,
    useLinkPreviewContext: () => ({
      isPressing: false,
      setIsPressing: jest.fn(),
    }),
  };
});

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Ionicons: (props) => <View {...props} />,
    MaterialIcons: (props) => <View {...props} />,
    FontAwesome: (props) => <View {...props} />,
  };
});

jest.mock("expo-linking", () => {
  const actual = jest.requireActual("expo-linking");
  return {
    ...actual,
    createURL: jest.fn(),
  };
});

jest.mock("react-native-svg", () => {
  const React = require("react");
  return {
    Svg: ({ children }) => React.createElement("Svg", {}, children),
    Path: () => React.createElement("Path"),
  };
});

jest.mock("react-native-css-interop", () => ({
  styled: (c) => c,
}));
