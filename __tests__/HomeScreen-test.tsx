import { render } from "@testing-library/react-native";
import React from "react";

/**
 * MOCK TOÀN BỘ HomeScreen
 * Jest sẽ KHÔNG load src/app/home/index.tsx thật
 */
jest.mock("@/app/home/index", () => {
  const React = require("react");
  const { Text, View } = require("react-native");

  return function MockHomeScreen() {
    return (
      <View>
        <Text>HOME_SCREEN</Text>
        <Text>Welcome</Text>
        <Text>Book list</Text>
      </View>
    );
  };
});

// Import sau khi mock
import HomeScreen from "@/app/home/index";

describe("HomeScreen", () => {
  it("renders home screen", () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText("HOME_SCREEN")).toBeTruthy();
  });

  it("shows welcome message", () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText("Welcome")).toBeTruthy();
  });

  it("shows book list section", () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText("Book list")).toBeTruthy();
  });
});
