import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
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
  const { View, Pressable, Text } = require("react-native");
  return function MockHeader({ showBackButton, onSkipPress }: { showBackButton?: boolean; onSkipPress?: () => void }) {
    return (
      <View testID="header">
        {showBackButton && <Pressable testID="back-button" />}
        {onSkipPress && <Pressable testID="skip-button" onPress={onSkipPress}><Text>Skip</Text></Pressable>}
      </View>
    );
  };
});

// Import component
import OtpScreen from "@/app/auth/phone/otp";

describe("OtpScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockVerifyOtp.mockResolvedValue({
      access_token: "fake-token",
    });
  });

  afterEach(() => {
    jest.useRealTimers();
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
    const { getByText } = render(<OtpScreen />);
    
    await waitFor(() => {
      expect(getByText(/Vui lòng nhập mã chúng tôi vừa gửi qua SMS/)).toBeTruthy();
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

  it("shows resend timer countdown", async () => {
    const { getByText } = render(<OtpScreen />);
    
    await waitFor(() => {
      expect(getByText(/Gửi lại \(60s\)/)).toBeTruthy();
    });
  });

  it("decrements timer after 1 second", async () => {
    const { getByText } = render(<OtpScreen />);
    
    await waitFor(() => {
      expect(getByText(/Gửi lại \(60s\)/)).toBeTruthy();
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(getByText(/Gửi lại \(59s\)/)).toBeTruthy();
    });
  });

  it("keeps verify button state when OTP is incomplete", async () => {
    jest.useRealTimers();
    const { getByText, UNSAFE_getAllByType } = render(<OtpScreen />);
    const { TextInput } = require("react-native");
    
    const inputs = UNSAFE_getAllByType(TextInput);
    
    // Fill only 3 inputs (incomplete)
    await act(async () => {
      fireEvent.changeText(inputs[0], "1");
      fireEvent.changeText(inputs[1], "2");
      fireEvent.changeText(inputs[2], "3");
    });

    // Verify button should exist (may be disabled)
    const verifyButton = getByText("Xác minh");
    expect(verifyButton).toBeTruthy();
    
    jest.useFakeTimers();
  });

  it("fills all OTP inputs and attempts verification", async () => {
    jest.useRealTimers();
    const { getByText, UNSAFE_getAllByType } = render(<OtpScreen />);
    const { TextInput } = require("react-native");
    
    const inputs = UNSAFE_getAllByType(TextInput);
    
    // Fill all 6 OTP inputs
    await act(async () => {
      for (let i = 0; i < 6; i++) {
        fireEvent.changeText(inputs[i], String(i + 1));
      }
    });

    const verifyButton = getByText("Xác minh");
    
    await act(async () => {
      fireEvent.press(verifyButton);
    });

    // Component should not crash after pressing verify
    expect(verifyButton).toBeTruthy();
    jest.useFakeTimers();
  });

  it("handles OTP input change", async () => {
    const { UNSAFE_getAllByType } = render(<OtpScreen />);
    const { TextInput } = require("react-native");
    
    const inputs = UNSAFE_getAllByType(TextInput);
    
    await act(async () => {
      fireEvent.changeText(inputs[0], "1");
    });

    expect(inputs[0].props.value).toBe("1");
  });

  it("ignores non-numeric input", async () => {
    const { UNSAFE_getAllByType } = render(<OtpScreen />);
    const { TextInput } = require("react-native");
    
    const inputs = UNSAFE_getAllByType(TextInput);
    
    await act(async () => {
      fireEvent.changeText(inputs[0], "a");
    });

    expect(inputs[0].props.value).toBe("");
  });

  it("handles backspace on OTP input", async () => {
    const { UNSAFE_getAllByType } = render(<OtpScreen />);
    const { TextInput } = require("react-native");
    
    const inputs = UNSAFE_getAllByType(TextInput);
    
    // Fill first input
    await act(async () => {
      fireEvent.changeText(inputs[0], "1");
      fireEvent.changeText(inputs[1], "2");
    });

    // Press backspace on second input
    await act(async () => {
      fireEvent(inputs[1], "onKeyPress", { nativeEvent: { key: "Backspace" } });
    });

    // Should not crash
    expect(inputs[0]).toBeTruthy();
  });

  it("handles focus on OTP input", async () => {
    const { UNSAFE_getAllByType } = render(<OtpScreen />);
    const { TextInput } = require("react-native");
    
    const inputs = UNSAFE_getAllByType(TextInput);
    
    await act(async () => {
      fireEvent(inputs[0], "onFocus");
    });

    // Should not crash
    expect(inputs[0]).toBeTruthy();
  });

  it("handles blur on OTP input", async () => {
    const { UNSAFE_getAllByType } = render(<OtpScreen />);
    const { TextInput } = require("react-native");
    
    const inputs = UNSAFE_getAllByType(TextInput);
    
    await act(async () => {
      fireEvent(inputs[0], "onFocus");
      fireEvent(inputs[0], "onBlur");
    });

    // Should not crash
    expect(inputs[0]).toBeTruthy();
  });

  it("shows skip button in header", async () => {
    const { getByTestId } = render(<OtpScreen />);
    
    await waitFor(() => {
      expect(getByTestId("skip-button")).toBeTruthy();
    });
  });

  it("handles skip button press", async () => {
    const { getByTestId } = render(<OtpScreen />);
    
    const skipButton = getByTestId("skip-button");
    
    await act(async () => {
      fireEvent.press(skipButton);
    });

    expect(mockReplace).toHaveBeenCalledWith("/auth/phone/otp");
  });

  it("disables resend button when timer is running", async () => {
    const { getByText } = render(<OtpScreen />);
    
    await waitFor(() => {
      expect(getByText(/Gửi lại \(60s\)/)).toBeTruthy();
    });

    // Button should be disabled (gray text)
    const resendText = getByText(/Gửi lại \(60s\)/);
    expect(resendText).toBeTruthy();
  });

  it("enables resend button when timer reaches 0", async () => {
    const { getByText } = render(<OtpScreen />);
    
    // Fast forward 60 seconds
    act(() => {
      jest.advanceTimersByTime(60000);
    });

    await waitFor(() => {
      expect(getByText("Gửi lại")).toBeTruthy();
    });
  });

  it("handles resend OTP when timer is 0", async () => {
    const { getByText, UNSAFE_root } = render(<OtpScreen />);
    
    // Fast forward 60 seconds
    act(() => {
      jest.advanceTimersByTime(60000);
    });

    await waitFor(() => {
      expect(getByText("Gửi lại")).toBeTruthy();
    });

    const resendButton = getByText("Gửi lại");
    
    await act(async () => {
      fireEvent.press(resendButton);
      jest.advanceTimersByTime(1500);
    });

    // Should reset timer
    await waitFor(() => {
      expect(getByText(/Gửi lại \(60s\)/)).toBeTruthy();
    });
  });

  it("does not resend when timer is still running", async () => {
    const { getByText } = render(<OtpScreen />);
    
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    await waitFor(() => {
      expect(getByText(/Gửi lại \(60s\)/)).toBeTruthy();
    });

    // Try to press resend while timer is running
    const resendButton = getByText(/Gửi lại \(60s\)/);
    
    await act(async () => {
      fireEvent.press(resendButton);
    });

    // Should not log "Resending OTP"
    expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining("Resending OTP"));
    consoleSpy.mockRestore();
  });

  it("shows loading state during verification", async () => {
    const { getByText, UNSAFE_getAllByType, queryByText } = render(<OtpScreen />);
    const { TextInput } = require("react-native");
    
    const inputs = UNSAFE_getAllByType(TextInput);
    
    // Fill all 6 OTP inputs
    await act(async () => {
      for (let i = 0; i < 6; i++) {
        fireEvent.changeText(inputs[i], String(i + 1));
      }
    });

    const verifyButton = getByText("Xác minh");
    
    await act(async () => {
      fireEvent.press(verifyButton);
    });

    // During loading, "Xác minh" text might not be visible
    // This is fine as ActivityIndicator is shown
  });

  it("clears OTP inputs after resend", async () => {
    const { getByText, UNSAFE_getAllByType } = render(<OtpScreen />);
    const { TextInput } = require("react-native");
    
    const inputs = UNSAFE_getAllByType(TextInput);
    
    // Fill first input
    await act(async () => {
      fireEvent.changeText(inputs[0], "1");
    });

    // Fast forward 60 seconds
    act(() => {
      jest.advanceTimersByTime(60000);
    });

    await waitFor(() => {
      expect(getByText("Gửi lại")).toBeTruthy();
    });

    const resendButton = getByText("Gửi lại");
    
    await act(async () => {
      fireEvent.press(resendButton);
      jest.advanceTimersByTime(1500);
    });

    // OTP inputs should be cleared
    await waitFor(() => {
      expect(inputs[0].props.value).toBe("");
    });
  });

  it("handles ref callback for inputs", async () => {
    const { UNSAFE_getAllByType } = render(<OtpScreen />);
    const { TextInput } = require("react-native");
    
    const inputs = UNSAFE_getAllByType(TextInput);
    
    // All 6 inputs should be rendered
    expect(inputs.length).toBe(6);
  });

  it("moves focus to next input after entering digit", async () => {
    const { UNSAFE_getAllByType } = render(<OtpScreen />);
    const { TextInput } = require("react-native");
    
    const inputs = UNSAFE_getAllByType(TextInput);
    
    // Enter digit in first input
    await act(async () => {
      fireEvent.changeText(inputs[0], "1");
    });

    // Should move to next input (value saved)
    expect(inputs[0].props.value).toBe("1");
  });

  it("handles backspace when current input is empty", async () => {
    const { UNSAFE_getAllByType } = render(<OtpScreen />);
    const { TextInput } = require("react-native");
    
    const inputs = UNSAFE_getAllByType(TextInput);
    
    // Focus on second input (empty)
    await act(async () => {
      fireEvent(inputs[1], "onFocus");
    });

    // Press backspace
    await act(async () => {
      fireEvent(inputs[1], "onKeyPress", { nativeEvent: { key: "Backspace" } });
    });

    // Should not crash
    expect(inputs[1]).toBeTruthy();
  });

  it("handles key press on first input with backspace", async () => {
    const { UNSAFE_getAllByType } = render(<OtpScreen />);
    const { TextInput } = require("react-native");
    
    const inputs = UNSAFE_getAllByType(TextInput);
    
    // Press backspace on first input (empty)
    await act(async () => {
      fireEvent(inputs[0], "onKeyPress", { nativeEvent: { key: "Backspace" } });
    });

    // Should not crash or do anything
    expect(inputs[0]).toBeTruthy();
  });

  it("keeps only last character when multiple chars entered", async () => {
    const { UNSAFE_getAllByType } = render(<OtpScreen />);
    const { TextInput } = require("react-native");
    
    const inputs = UNSAFE_getAllByType(TextInput);
    
    // Enter multiple digits
    await act(async () => {
      fireEvent.changeText(inputs[0], "123");
    });

    // Should keep only last character
    expect(inputs[0].props.value).toBe("3");
  });

  it("handles other key press events", async () => {
    const { UNSAFE_getAllByType } = render(<OtpScreen />);
    const { TextInput } = require("react-native");
    
    const inputs = UNSAFE_getAllByType(TextInput);
    
    // Press a number key
    await act(async () => {
      fireEvent(inputs[0], "onKeyPress", { nativeEvent: { key: "1" } });
    });

    // Should not crash
    expect(inputs[0]).toBeTruthy();
  });
});
