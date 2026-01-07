import { render, waitFor } from "@testing-library/react-native";
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
  const { View } = require("react-native");
  return function MockHeader() {
    return <View testID="mock-header" />;
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
});
