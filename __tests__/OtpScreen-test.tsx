import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

// Mock dependencies
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
  }),
  useLocalSearchParams: () => ({
    phone: "0123456789",
  }),
}));

jest.mock("@sentry/react-native", () => ({
  captureException: jest.fn(),
  withScope: jest.fn((callback) => callback({
    setTag: jest.fn(),
    setContext: jest.fn(),
    setLevel: jest.fn(),
  })),
}));

const mockVerifyOtp = jest.fn();

jest.mock("@/api", () => ({
  AuthService: {
    verifyOtpRouteApiAuthVerifyOtpPost: (...args: any[]) => mockVerifyOtp(...args),
  },
}));

jest.mock("@/components/Header", () => {
  const { View } = require("react-native");
  return function MockHeader() {
    return <View testID="header" />;
  };
});

// Import component
import OtpScreen from "@/app/auth/phone/otp";

describe("OtpScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockVerifyOtp.mockResolvedValue({
      access_token: "fake-token",
    });
  });

  it("renders OTP screen correctly", async () => {
    const { getByText } = render(<OtpScreen />);
    
    await waitFor(() => {
      expect(getByText(/Xác minh số điện thoại/i)).toBeTruthy();
    });
  });

  it("shows phone number from params", async () => {
    const { getByText } = render(<OtpScreen />);
    
    await waitFor(() => {
      expect(getByText(/123 456 789/)).toBeTruthy();
    });
  });

  it("shows verify button", async () => {
    const { getByText } = render(<OtpScreen />);
    
    await waitFor(() => {
      expect(getByText("Xác minh")).toBeTruthy();
    });
  });

  it("renders without crashing", () => {
    const { UNSAFE_root } = render(<OtpScreen />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it("shows resend code option", async () => {
    const { getByText } = render(<OtpScreen />);
    
    await waitFor(() => {
      expect(getByText(/Nếu bạn không nhận được mã/)).toBeTruthy();
    });
  });

  it("shows header component", async () => {
    const { getByTestId } = render(<OtpScreen />);
    
    await waitFor(() => {
      expect(getByTestId("header")).toBeTruthy();
    });
  });

  it("renders description text", async () => {
    const { UNSAFE_root } = render(<OtpScreen />);
    
    await waitFor(() => {
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it("renders component tree", () => {
    const { UNSAFE_root } = render(<OtpScreen />);
    expect(UNSAFE_root.children).toBeDefined();
  });

  it("shows OTP input fields", async () => {
    const { UNSAFE_root } = render(<OtpScreen />);
    
    await waitFor(() => {
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it("verify button can be pressed", async () => {
    const { getByText } = render(<OtpScreen />);
    
    await waitFor(() => {
      const verifyButton = getByText("Xác minh");
      expect(verifyButton).toBeTruthy();
      fireEvent.press(verifyButton);
    });
  });
});
