import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

// Mock dependencies
const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: jest.fn(),
  }),
}));

const mockMarkDone = jest.fn();
jest.mock("../src/app/hooks/useOnboardingGate", () => ({
  useOnboardingGate: () => ({
    markDone: mockMarkDone,
  }),
}));

jest.mock("@/icons/IconOnboarding1", () => {
  const { View } = require("react-native");
  return function MockIcon() {
    return <View testID="icon-1" />;
  };
});

jest.mock("@/icons/IconOnboarding2", () => {
  const { View } = require("react-native");
  return function MockIcon() {
    return <View testID="icon-2" />;
  };
});

jest.mock("@/icons/IconOnboarding3", () => {
  const { View } = require("react-native");
  return function MockIcon() {
    return <View testID="icon-3" />;
  };
});

// Import component
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

  it("renders skip button that can be pressed", async () => {
    const { getByText } = render(<OnboardingScreen />);
    
    await waitFor(() => {
      const skipButton = getByText("Bỏ qua");
      expect(skipButton).toBeTruthy();
      fireEvent.press(skipButton);
    });
    // Should not crash after pressing
    expect(getByText("Bỏ qua")).toBeDefined();
  });

  it("navigates to next slide when continue is pressed", async () => {
    const { getByText } = render(<OnboardingScreen />);
    
    await waitFor(() => {
      expect(getByText("Tiếp tục")).toBeTruthy();
    });

    fireEvent.press(getByText("Tiếp tục"));
    
    // Should not crash and still be on screen
    expect(getByText("Bỏ qua")).toBeTruthy();
  });

  it("shows onboarding icons", async () => {
    const { getByTestId } = render(<OnboardingScreen />);
    
    await waitFor(() => {
      expect(getByTestId("icon-1")).toBeTruthy();
    });
  });

  it("renders without crashing", () => {
    const { UNSAFE_root } = render(<OnboardingScreen />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it("renders component tree", () => {
    const { UNSAFE_root } = render(<OnboardingScreen />);
    expect(UNSAFE_root.children).toBeDefined();
  });
});
