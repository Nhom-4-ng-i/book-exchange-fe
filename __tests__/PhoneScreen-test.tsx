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

jest.mock("@sentry/react-native", () => ({
  captureException: jest.fn(),
  withScope: jest.fn((callback) => callback({ 
    setTag: jest.fn(), 
    setContext: jest.fn(), 
    setLevel: jest.fn() 
  })),
}));

jest.mock("@/api", () => ({
  AuthService: {
    updatePhoneRouteApiAuthPhonePut: jest.fn(),
  },
  UserService: {
    getMyProfileRouteApiUserMeGet: jest.fn().mockResolvedValue({
      user_id: "1",
      email: "test@test.com",
      name: "Test User",
      role: "user",
      phone: null,
    }),
  },
}));

jest.mock("@/components/Header", () => {
  const React = require("react");
  const { View } = require("react-native");
  return function MockHeader() {
    return <View testID="mock-header" />;
  };
});

// Import sau khi mock
import PhoneScreen from "@/app/auth/phone/index";

describe("PhoneScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders phone screen correctly", async () => {
    const { getAllByText } = render(<PhoneScreen />);
    
    await waitFor(() => {
      const elements = getAllByText("Số điện thoại");
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it("shows description text", async () => {
    const { getByText } = render(<PhoneScreen />);
    
    await waitFor(() => {
      expect(getByText(/Vui lòng nhập số điện thoại/)).toBeTruthy();
    });
  });

  it("shows continue button", async () => {
    const { getByText } = render(<PhoneScreen />);
    
    await waitFor(() => {
      expect(getByText("Tiếp tục")).toBeTruthy();
    });
  });

  it("shows phone input field", async () => {
    const { getAllByText } = render(<PhoneScreen />);
    
    await waitFor(() => {
      const elements = getAllByText("Số điện thoại");
      expect(elements.length).toBeGreaterThan(0);
    });
  });
});

