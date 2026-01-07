import { render, waitFor } from "@testing-library/react-native";
import React from "react";

// Mock dependencies
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

// asyncStorage already mocked globally in jest.setup.js

jest.mock("../src/app/hooks/useOnboardingGate", () => ({
  useOnboardingGate: () => ({
    markDone: jest.fn(),
  }),
}));

jest.mock("@/icons/IconOnboarding1", () => {
  const React = require("react");
  const { View } = require("react-native");
  return function MockIcon() {
    return <View testID="icon-1" />;
  };
});

jest.mock("@/icons/IconOnboarding2", () => {
  const React = require("react");
  const { View } = require("react-native");
  return function MockIcon() {
    return <View testID="icon-2" />;
  };
});

jest.mock("@/icons/IconOnboarding3", () => {
  const React = require("react");
  const { View } = require("react-native");
  return function MockIcon() {
    return <View testID="icon-3" />;
  };
});

// Import sau khi mock
import OnboardingScreen from "@/app/onboarding/index";

describe("OnboardingScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders onboarding screen correctly", async () => {
    const { getByText } = render(<OnboardingScreen />);
    
    await waitFor(() => {
      expect(getByText("Bỏ qua")).toBeTruthy();
    });
  });

  it("shows first slide content", async () => {
    const { getByText } = render(<OnboardingScreen />);
    
    await waitFor(() => {
      expect(getByText("Tìm sách nhanh")).toBeTruthy();
      expect(getByText(/Tìm và lọc sách/)).toBeTruthy();
    });
  });

  it("shows continue button", async () => {
    const { getByText } = render(<OnboardingScreen />);
    
    await waitFor(() => {
      expect(getByText("Tiếp tục")).toBeTruthy();
    });
  });

  it("shows skip button", async () => {
    const { getByText } = render(<OnboardingScreen />);
    
    await waitFor(() => {
      expect(getByText("Bỏ qua")).toBeTruthy();
    });
  });
});

