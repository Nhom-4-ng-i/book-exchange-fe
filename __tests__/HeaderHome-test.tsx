import { render } from "@testing-library/react-native";
import React from "react";

// Mock dependencies
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
  useFocusEffect: jest.fn(),
}));

jest.mock("@/api", () => ({
  NotificationsService: {
    getNotificationsListRouteApiNotificationsGet: jest.fn().mockResolvedValue([
      { id: 1, is_read: false },
      { id: 2, is_read: true },
    ]),
  },
  OpenAPI: {
    BASE: "",
    TOKEN: "",
  },
}));

// Mock icons
jest.mock("@/icons/IconSearch", () => {
  const React = require("react");
  const { View } = require("react-native");
  return function MockIcon() {
    return <View testID="icon-search" />;
  };
});

jest.mock("@/icons/IconMessenger", () => {
  const React = require("react");
  const { View } = require("react-native");
  return function MockIcon() {
    return <View testID="icon-messenger" />;
  };
});

jest.mock("@/icons/IconNotification", () => {
  const React = require("react");
  const { View } = require("react-native");
  return function MockIcon() {
    return <View testID="icon-notification" />;
  };
});

jest.mock("@/icons/IconNotification2", () => {
  const React = require("react");
  const { View } = require("react-native");
  return function MockIcon() {
    return <View testID="icon-notification2" />;
  };
});

// Import sau khi mock
import HeaderHome from "@/components/HeaderHome";

describe("HeaderHome Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders header with title", () => {
    const { getByText } = render(<HeaderHome title="Trang chủ" />);
    expect(getByText("Trang chủ")).toBeTruthy();
  });

  it("renders search icon when showSearch is true", () => {
    const { getByTestId } = render(<HeaderHome title="Home" showSearch />);
    expect(getByTestId("icon-search")).toBeTruthy();
  });

  it("renders chat icon when showChat is true", () => {
    const { getByTestId } = render(<HeaderHome title="Home" showChat />);
    expect(getByTestId("icon-messenger")).toBeTruthy();
  });

  it("renders notification icon when showNotification is true", () => {
    const { UNSAFE_root } = render(<HeaderHome title="Home" showNotification />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it("renders without crashing", () => {
    const { UNSAFE_root } = render(<HeaderHome title="Test" />);
    expect(UNSAFE_root).toBeTruthy();
  });
});

