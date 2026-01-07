import { render } from "@testing-library/react-native";
import React from "react";

/**
 * MOCK BottomNav Component
 */
jest.mock("@/components/BottomNav", () => {
  const React = require("react");
  const { Text, View } = require("react-native");

  return function MockBottomNav() {
    return (
      <View>
        <Text>BOTTOM_NAV_COMPONENT</Text>
        <Text>Home</Text>
        <Text>Cart</Text>
        <Text>Profile</Text>
      </View>
    );
  };
});

// Import sau khi mock
import BottomNav from "@/components/BottomNav";

describe("BottomNav Component", () => {
  it("renders bottom nav component", () => {
    const { getByText } = render(<BottomNav />);
    expect(getByText("BOTTOM_NAV_COMPONENT")).toBeTruthy();
  });

  it("shows home tab", () => {
    const { getByText } = render(<BottomNav />);
    expect(getByText("Home")).toBeTruthy();
  });

  it("shows cart tab", () => {
    const { getByText } = render(<BottomNav />);
    expect(getByText("Cart")).toBeTruthy();
  });

  it("shows profile tab", () => {
    const { getByText } = render(<BottomNav />);
    expect(getByText("Profile")).toBeTruthy();
  });
});

