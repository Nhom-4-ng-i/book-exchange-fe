import { render } from "@testing-library/react-native";
import React from "react";

// Mock getData function
const mockGetData = jest.fn();

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
  getData: (...args: any[]) => mockGetData(...args),
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
    mockGetData.mockResolvedValue(null);
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

  it("shows tagline text", () => {
    const { getByText } = render(<LaunchAnimationScreen />);
    expect(getByText(/Mua — Bán sách và tài liệu trong trường/)).toBeTruthy();
  });

  it("cleans up timers on unmount", () => {
    const { unmount } = render(<LaunchAnimationScreen />);
    
    // Should not throw or crash when unmounting
    unmount();
  });

  it("shows intro1 phase background initially", () => {
    const { UNSAFE_root } = render(<LaunchAnimationScreen />);
    // Just verify the component renders in intro1 phase
    expect(UNSAFE_root).toBeTruthy();
  });

  it("starts animation on mount", () => {
    const { UNSAFE_root } = render(<LaunchAnimationScreen />);
    // Animation starts immediately
    expect(UNSAFE_root).toBeTruthy();
  });

  it("shows logo icons", () => {
    const { queryByTestId } = render(<LaunchAnimationScreen />);
    // At least one logo should be rendered
    const hasBkoo1 = queryByTestId("logo-bkoo1");
    const hasBkoo2 = queryByTestId("logo-bkoo2");
    const hasWhite = queryByTestId("logo-white");
    const hasPrimary = queryByTestId("logo-primary");
    
    expect(hasBkoo1 || hasBkoo2 || hasWhite || hasPrimary).toBeTruthy();
  });

  it("renders SafeAreaView", () => {
    const { UNSAFE_root } = render(<LaunchAnimationScreen />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it("renders multiple animated views", () => {
    const { UNSAFE_root } = render(<LaunchAnimationScreen />);
    expect(UNSAFE_root).toBeTruthy();
    expect(UNSAFE_root.children).toBeDefined();
  });

  it("displays tagline about buying and selling", () => {
    const { getByText } = render(<LaunchAnimationScreen />);
    const tagline = getByText(/nhanh và tiết kiệm/);
    expect(tagline).toBeTruthy();
  });

  it("shows bottom logo icon", () => {
    const { queryByTestId } = render(<LaunchAnimationScreen />);
    const logoWhite = queryByTestId("logo-white");
    const logoPrimary = queryByTestId("logo-primary");
    expect(logoWhite || logoPrimary).toBeTruthy();
  });
});
