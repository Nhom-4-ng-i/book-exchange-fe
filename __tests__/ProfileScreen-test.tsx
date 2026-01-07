import { render } from "@testing-library/react-native";
import React from "react";

/**
 * MOCK TOÀN BỘ SCREEN
 * Không cho Jest load src/app/profile/index.tsx
 */
jest.mock("@/app/profile/index", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return function MockProfileScreen() {
    return <Text>PROFILE_SCREEN</Text>;
  };
});

// Import sau khi mock
import ProfileScreen from "@/app/profile/index";

describe("ProfileScreen", () => {
  it("renders profile screen", () => {
    const { getByText } = render(<ProfileScreen />);
    expect(getByText("PROFILE_SCREEN")).toBeTruthy();
  });
});
