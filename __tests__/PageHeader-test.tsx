import { render } from "@testing-library/react-native";
import React from "react";

// Mock icons
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

// Import sau khi mock
import PageHeader from "@/components/PageHeader";

describe("PageHeader Component", () => {
  it("renders page header with title", () => {
    const { getByText } = render(<PageHeader title="Test Title" />);
    expect(getByText("Test Title")).toBeTruthy();
  });

  it("renders chat and bell icons", () => {
    const { getByTestId } = render(<PageHeader title="Test" />);
    expect(getByTestId("icon-messenger")).toBeTruthy();
    expect(getByTestId("icon-notification")).toBeTruthy();
  });

  it("renders without crashing", () => {
    const { UNSAFE_root } = render(<PageHeader title="Test" />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it("handles empty callbacks gracefully", () => {
    const { UNSAFE_root } = render(<PageHeader title="Test" />);
    expect(UNSAFE_root).toBeTruthy();
  });
});
