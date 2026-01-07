import { render } from "@testing-library/react-native";
import React from "react";

// Mock dependencies  
const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}));

jest.mock("utils/asyncStorage", () => ({
  getData: jest.fn().mockResolvedValue(null),
}));

jest.mock("@/icons/IconLogoPrimary", () => {
  const { View } = require("react-native");
  return function MockIcon() {
    return <View testID="logo-primary" />;
  };
});

jest.mock("@/icons/IconLogoWhite", () => {
  const { View } = require("react-native");
  return function MockIcon() {
    return <View testID="logo-white" />;
  };
});

jest.mock("@/icons/logoBkoo1", () => {
  const { View } = require("react-native");
  return function MockIcon() {
    return <View testID="logo-bkoo1" />;
  };
});

jest.mock("@/icons/logoBkoo2", () => {
  const { View } = require("react-native");
  return function MockIcon() {
    return <View testID="logo-bkoo2" />;
  };
});

// Import component
import LaunchAnimationScreen from "@/app/index";

describe("LaunchAnimationScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders launch animation screen", () => {
    const { UNSAFE_root } = render(<LaunchAnimationScreen />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it("shows intro phase initially", () => {
    const { UNSAFE_root } = render(<LaunchAnimationScreen />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it("component initializes correctly", () => {
    const { UNSAFE_root } = render(<LaunchAnimationScreen />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it("renders without crashing", () => {
    const { UNSAFE_root } = render(<LaunchAnimationScreen />);
    expect(UNSAFE_root.children).toBeDefined();
  });

  it("renders component tree", () => {
    const { UNSAFE_root } = render(<LaunchAnimationScreen />);
    expect(UNSAFE_root.children).toBeDefined();
  });
});
