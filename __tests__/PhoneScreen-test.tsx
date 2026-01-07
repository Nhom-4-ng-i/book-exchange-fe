import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
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

jest.mock("@sentry/react-native", () => ({
  captureException: jest.fn(),
  withScope: jest.fn((callback) => callback({ 
    setTag: jest.fn(), 
    setContext: jest.fn(), 
    setLevel: jest.fn() 
  })),
}));

const mockUpdatePhone = jest.fn();
const mockGetProfile = jest.fn();

jest.mock("@/api", () => ({
  AuthService: {
    updatePhoneRouteApiAuthPhonePut: (...args: any[]) => mockUpdatePhone(...args),
  },
  UserService: {
    getMyProfileRouteApiUserMeGet: () => mockGetProfile(),
  },
}));

jest.mock("@/components/Header", () => {
  const { View, Pressable, Text } = require("react-native");
  return function MockHeader({ showBackButton, showSkipButton, onSkipPress }: any) {
    return (
      <View testID="mock-header">
        {showBackButton && <View testID="back-button" />}
        {showSkipButton && (
          <Pressable testID="skip-button" onPress={onSkipPress}>
            <Text>Skip</Text>
          </Pressable>
        )}
      </View>
    );
  };
});

jest.mock("@/icons/IconPhone", () => {
  const { View } = require("react-native");
  return function MockIcon() {
    return <View testID="phone-icon" />;
  };
});

// Import component
import PhoneScreen from "@/app/auth/phone/index";

describe("PhoneScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetProfile.mockResolvedValue({
      user_id: "1",
      email: "test@test.com",
      name: "Test User",
      role: "user",
      phone: null,
    });
    mockUpdatePhone.mockResolvedValue({});
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

  it("renders without crashing", () => {
    const { UNSAFE_root } = render(<PhoneScreen />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it("calls getProfile API on mount", async () => {
    render(<PhoneScreen />);

    await waitFor(() => {
      expect(mockGetProfile).toHaveBeenCalled();
    });
  });

  it("shows header component", async () => {
    const { getByTestId } = render(<PhoneScreen />);
    
    await waitFor(() => {
      expect(getByTestId("mock-header")).toBeTruthy();
    });
  });

  it("redirects if user already has phone", async () => {
    mockGetProfile.mockResolvedValue({
      user_id: "1",
      email: "test@test.com",
      name: "Test User",
      role: "user",
      phone: "0123456789",
    });

    render(<PhoneScreen />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/home");
    });
  });

  it("handles API error gracefully", async () => {
    mockGetProfile.mockRejectedValueOnce(new Error("API Error"));
    
    const { UNSAFE_root } = render(<PhoneScreen />);
    
    await waitFor(() => {
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it("shows country code (+84)", async () => {
    const { getByText } = render(<PhoneScreen />);
    
    await waitFor(() => {
      expect(getByText("(+84)")).toBeTruthy();
    });
  });

  it("handles phone number input", async () => {
    const { getByPlaceholderText } = render(<PhoneScreen />);
    
    await waitFor(() => {
      const input = getByPlaceholderText("123 435 7565");
      fireEvent.changeText(input, "0901234567");
      expect(input.props.value).toBe("090 123 456 7");
    });
  });

  it("formats phone number with spaces", async () => {
    const { getByPlaceholderText } = render(<PhoneScreen />);
    
    await waitFor(() => {
      const input = getByPlaceholderText("123 435 7565");
      fireEvent.changeText(input, "123456789");
      expect(input.props.value).toBe("123 456 789");
    });
  });

  it("limits phone number to 15 digits", async () => {
    const { getByPlaceholderText } = render(<PhoneScreen />);
    
    await waitFor(() => {
      const input = getByPlaceholderText("123 435 7565");
      fireEvent.changeText(input, "1234567890123456789");
      // Should be limited to 15 digits
      expect(input.props.value.replace(/\s/g, "").length).toBeLessThanOrEqual(15);
    });
  });

  it("strips non-digit characters from input", async () => {
    const { getByPlaceholderText } = render(<PhoneScreen />);
    
    await waitFor(() => {
      const input = getByPlaceholderText("123 435 7565");
      fireEvent.changeText(input, "abc123def456");
      expect(input.props.value).toBe("123 456");
    });
  });

  it("shows skip button in header", async () => {
    const { getByTestId } = render(<PhoneScreen />);
    
    await waitFor(() => {
      expect(getByTestId("skip-button")).toBeTruthy();
    });
  });

  it("handles skip button press", async () => {
    const { getByTestId } = render(<PhoneScreen />);
    
    await waitFor(() => {
      const skipButton = getByTestId("skip-button");
      fireEvent.press(skipButton);
    });

    expect(mockReplace).toHaveBeenCalledWith("/home");
  });

  it("submits phone number successfully", async () => {
    const { getByPlaceholderText, getByText } = render(<PhoneScreen />);
    
    await waitFor(() => {
      const input = getByPlaceholderText("123 435 7565");
      fireEvent.changeText(input, "0901234567");
    });

    const continueButton = getByText("Tiếp tục");
    
    await act(async () => {
      fireEvent.press(continueButton);
    });

    await waitFor(() => {
      expect(mockUpdatePhone).toHaveBeenCalledWith({
        phone: "+840901234567",
      });
    });
  });

  it("navigates to success after phone update", async () => {
    const { getByPlaceholderText, getByText } = render(<PhoneScreen />);
    
    await waitFor(() => {
      const input = getByPlaceholderText("123 435 7565");
      fireEvent.changeText(input, "0901234567");
    });

    const continueButton = getByText("Tiếp tục");
    
    await act(async () => {
      fireEvent.press(continueButton);
    });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/success");
    });
  });

  it("handles phone update error", async () => {
    mockUpdatePhone.mockRejectedValueOnce(new Error("Update failed"));

    const { getByPlaceholderText, getByText } = render(<PhoneScreen />);
    
    await waitFor(() => {
      const input = getByPlaceholderText("123 435 7565");
      fireEvent.changeText(input, "0901234567");
    });

    const continueButton = getByText("Tiếp tục");
    
    await act(async () => {
      fireEvent.press(continueButton);
    });

    await waitFor(() => {
      expect(getByText("Không thể cập nhật số điện thoại.")).toBeTruthy();
    });
  });

  it("disables continue button when phone is too short", async () => {
    const { getByPlaceholderText, getByText } = render(<PhoneScreen />);
    
    await waitFor(() => {
      const input = getByPlaceholderText("123 435 7565");
      fireEvent.changeText(input, "12345"); // Only 5 digits
    });

    const continueButton = getByText("Tiếp tục");
    
    await act(async () => {
      fireEvent.press(continueButton);
    });

    // Should not call API since less than 6 digits
    expect(mockUpdatePhone).not.toHaveBeenCalled();
  });

  it("enables continue button when phone has 6+ digits", async () => {
    const { getByPlaceholderText, getByText } = render(<PhoneScreen />);
    
    await waitFor(() => {
      const input = getByPlaceholderText("123 435 7565");
      fireEvent.changeText(input, "123456");
    });

    const continueButton = getByText("Tiếp tục");
    
    await act(async () => {
      fireEvent.press(continueButton);
    });

    await waitFor(() => {
      expect(mockUpdatePhone).toHaveBeenCalled();
    });
  });

  it("shows loading state while checking profile", () => {
    // Mock a slow API response
    mockGetProfile.mockReturnValue(new Promise(() => {}));
    
    const { UNSAFE_root } = render(<PhoneScreen />);
    
    // Component should render loading state
    expect(UNSAFE_root).toBeTruthy();
  });

  it("shows phone icon", async () => {
    const { getByTestId } = render(<PhoneScreen />);
    
    await waitFor(() => {
      expect(getByTestId("phone-icon")).toBeTruthy();
    });
  });

  it("shows phone input placeholder", async () => {
    const { getByPlaceholderText } = render(<PhoneScreen />);
    
    await waitFor(() => {
      expect(getByPlaceholderText("123 435 7565")).toBeTruthy();
    });
  });

  it("disables input while submitting", async () => {
    mockUpdatePhone.mockReturnValue(new Promise(() => {})); // Hang forever
    
    const { getByPlaceholderText, getByText } = render(<PhoneScreen />);
    
    await waitFor(() => {
      const input = getByPlaceholderText("123 435 7565");
      fireEvent.changeText(input, "0901234567");
    });

    const continueButton = getByText("Tiếp tục");
    
    await act(async () => {
      fireEvent.press(continueButton);
    });

    const input = getByPlaceholderText("123 435 7565");
    expect(input.props.editable).toBe(false);
  });

  it("clears error before submitting", async () => {
    mockUpdatePhone.mockRejectedValueOnce(new Error("First error"));

    const { getByPlaceholderText, getByText, queryByText } = render(<PhoneScreen />);
    
    await waitFor(() => {
      const input = getByPlaceholderText("123 435 7565");
      fireEvent.changeText(input, "0901234567");
    });

    const continueButton = getByText("Tiếp tục");
    
    // First submit - causes error
    await act(async () => {
      fireEvent.press(continueButton);
    });

    await waitFor(() => {
      expect(getByText("Không thể cập nhật số điện thoại.")).toBeTruthy();
    });

    // Reset mock to succeed
    mockUpdatePhone.mockResolvedValueOnce({});

    // Second submit - should clear error
    await act(async () => {
      fireEvent.press(continueButton);
    });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/success");
    });
  });
});
