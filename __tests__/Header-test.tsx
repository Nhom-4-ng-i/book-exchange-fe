import { render } from "@testing-library/react-native";
import React from "react";

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: jest.fn(),
  }),
}));

// Mock icons
jest.mock("@/icons/IconBack", () => {
  const React = require("react");
  const { View } = require("react-native");
  return function MockIcon() {
    return <View testID="icon-back" />;
  };
});

// Import sau khi mock
import Header from "@/components/Header";

describe("Header Component", () => {
  it("renders header with title", () => {
    const { getByText } = render(<Header title="Test Title" />);
    expect(getByText("Test Title")).toBeTruthy();
  });

  it("renders header with back button", () => {
    const { getByTestId } = render(<Header showBackButton />);
    expect(getByTestId("icon-back")).toBeTruthy();
  });

  it("renders header with skip button", () => {
    const { getByText } = render(<Header showSkipButton onSkipPress={() => {}} />);
    expect(getByText("Bỏ qua")).toBeTruthy();
  });

  it("renders header with all props", () => {
    const { getByText, getByTestId } = render(
      <Header title="Full Header" showBackButton showSkipButton onSkipPress={() => {}} />
    );
    expect(getByText("Full Header")).toBeTruthy();
    expect(getByTestId("icon-back")).toBeTruthy();
    expect(getByText("Bỏ qua")).toBeTruthy();
  });

  it("renders without crashing when no props provided", () => {
    const { UNSAFE_root } = render(<Header />);
    expect(UNSAFE_root).toBeTruthy();
  });
});

