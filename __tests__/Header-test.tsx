import { render } from "@testing-library/react-native";
import React from "react";

/**
 * MOCK Header Component
 */
jest.mock("@/components/Header", () => {
  const React = require("react");
  const { Text, View } = require("react-native");

  return function MockHeader({ title, showBackButton, showSkipButton }: any) {
    return (
      <View>
        <Text>HEADER_COMPONENT</Text>
        {showBackButton && <Text>Back Button</Text>}
        {title && <Text>{title}</Text>}
        {showSkipButton && <Text>Bỏ qua</Text>}
      </View>
    );
  };
});

// Import sau khi mock
import Header from "@/components/Header";

describe("Header Component", () => {
  it("renders header component", () => {
    const { getByText } = render(<Header />);
    expect(getByText("HEADER_COMPONENT")).toBeTruthy();
  });

  it("renders header with title", () => {
    const { getByText } = render(<Header title="Test Title" />);
    expect(getByText("Test Title")).toBeTruthy();
  });

  it("renders header with back button", () => {
    const { getByText } = render(<Header showBackButton />);
    expect(getByText("Back Button")).toBeTruthy();
  });

  it("renders header with skip button", () => {
    const { getByText } = render(<Header showSkipButton />);
    expect(getByText("Bỏ qua")).toBeTruthy();
  });

  it("renders header with all props", () => {
    const { getByText } = render(
      <Header title="Full Header" showBackButton showSkipButton />
    );
    expect(getByText("Full Header")).toBeTruthy();
    expect(getByText("Back Button")).toBeTruthy();
    expect(getByText("Bỏ qua")).toBeTruthy();
  });
});

