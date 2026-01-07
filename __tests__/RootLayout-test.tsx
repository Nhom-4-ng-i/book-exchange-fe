import { render, waitFor } from "@testing-library/react-native";
import React from "react";
import { View } from "react-native";

// Create a mock Stack component with Screen child
const MockStack = ({ children }: any) => <View testID="stack">{children}</View>;
MockStack.Screen = ({ name }: any) => <View testID={`screen-${name}`} />;

// Mock Sentry with jest functions
const mockSetUser = jest.fn();
const mockSetTag = jest.fn();
const mockRegisterNavigationContainer = jest.fn();

// Mock dependencies
jest.mock("expo-router", () => ({
  Stack: MockStack,
  useNavigationContainerRef: () => ({ current: { isReady: jest.fn().mockReturnValue(true) } }),
}));

jest.mock("expo-font", () => ({
  useFonts: () => [true, null], // fonts loaded, no error
}));

jest.mock("../sentry", () => ({
  navigationIntegration: {
    registerNavigationContainer: mockRegisterNavigationContainer,
  },
}));

jest.mock("@sentry/react-native", () => ({
  setUser: mockSetUser,
  setTag: mockSetTag,
  captureException: jest.fn(),
  withScope: jest.fn((cb) => cb({ setTag: jest.fn(), setContext: jest.fn(), setLevel: jest.fn() })),
  wrap: (component: any) => component,
}));

jest.mock("@/api", () => ({
  OpenAPI: {
    BASE: "",
    TOKEN: async () => "",
  },
}));

jest.mock("react-native-reanimated", () => require("react-native-reanimated/mock"));

describe("RootLayout Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders layout when fonts are loaded", async () => {
    const RootLayout = require("@/app/_layout").default;
    const { getByTestId } = render(<RootLayout />);
    
    await waitFor(() => {
      expect(getByTestId("stack")).toBeTruthy();
    });
  });

  it("sets up Sentry user context on mount", async () => {
    const RootLayout = require("@/app/_layout").default;
    render(<RootLayout />);
    
    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith({
        id: "nhom4_test_2025",
        email: "man.ngotrieuman27@hcmut.edu.vn",
        username: "Nhóm 4 người",
      });
    });
  });

  it("sets Sentry group tag", async () => {
    const RootLayout = require("@/app/_layout").default;
    render(<RootLayout />);
    
    await waitFor(() => {
      expect(mockSetTag).toHaveBeenCalledWith("group", "nhom-4-nguoi");
    });
  });

  it("registers navigation container on mount", async () => {
    const RootLayout = require("@/app/_layout").default;
    render(<RootLayout />);
    
    await waitFor(() => {
      expect(mockRegisterNavigationContainer).toHaveBeenCalled();
    });
  });

  it("renders without crashing", () => {
    const RootLayout = require("@/app/_layout").default;
    const { UNSAFE_root } = render(<RootLayout />);
    expect(UNSAFE_root).toBeTruthy();
  });
});

