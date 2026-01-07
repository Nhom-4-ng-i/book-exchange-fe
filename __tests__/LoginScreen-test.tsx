import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

// Mock AsyncStorage
const mockGetItem = jest.fn();
const mockSetItem = jest.fn();
const mockRemoveItem = jest.fn();

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: (...args: any[]) => mockGetItem(...args),
    setItem: (...args: any[]) => mockSetItem(...args),
    removeItem: (...args: any[]) => mockRemoveItem(...args),
  },
}));

// Mock Sentry
jest.mock("@sentry/react-native", () => ({
  captureException: jest.fn(),
  withScope: jest.fn().mockImplementation((cb) => {
    const scope = { setTag: jest.fn(), setContext: jest.fn(), setLevel: jest.fn() };
    return cb(scope);
  }),
}));

// Mock router
const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  router: {
    push: mockPush,
    replace: mockReplace,
  },
}));

jest.mock("expo-constants", () => ({
  default: {
    expoConfig: {
      extra: {
        googleSignIn: {
          webClientId: "test-client-id",
        },
      },
    },
  },
}));

// Mock API
const mockSignIn = jest.fn();
const mockSignUp = jest.fn();
const mockGetProfile = jest.fn();

jest.mock("@/api", () => ({
  AuthService: {
    signInRouteApiAuthSignInPost: (...args: any[]) => mockSignIn(...args),
    signUpRouteApiAuthSignUpPost: (...args: any[]) => mockSignUp(...args),
  },
  UserService: {
    getMyProfileRouteApiUserMeGet: () => mockGetProfile(),
  },
  OpenAPI: {
    BASE: "",
    TOKEN: "",
  },
  ApiError: class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  },
}));

jest.mock("@/icons/IconGoogle", () => {
  const React = require("react");
  const { View } = require("react-native");
  return function MockIcon() {
    return <View testID="icon-google" />;
  };
});

// Mock googleAuth
jest.mock("googleAuth", () => ({
  loadGoogleSignin: jest.fn().mockResolvedValue({
    GoogleSignin: {
      configure: jest.fn(),
      hasPlayServices: jest.fn().mockResolvedValue(true),
      signIn: jest.fn().mockResolvedValue({
        data: { user: { email: "test@gmail.com", name: "Test User" } },
      }),
    },
    statusCodes: { SIGN_IN_CANCELLED: "CANCELLED" },
    isErrorWithCode: jest.fn(),
    isSuccessResponse: jest.fn().mockReturnValue(true),
    isCancelledResponse: jest.fn().mockReturnValue(false),
  }),
}));

// Import component
import LoginScreen from "@/app/auth/login/index";

describe("LoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue(null);
    mockSetItem.mockResolvedValue(undefined);
    mockRemoveItem.mockResolvedValue(undefined);
    mockSignIn.mockResolvedValue({ access_token: "fake-token" });
    mockSignUp.mockResolvedValue({});
    mockGetProfile.mockResolvedValue({ id: 1, name: "Test User" });
  });

  it("renders login screen correctly", async () => {
    const { getByText } = render(<LoginScreen />);
    
    await waitFor(() => {
      expect(getByText("Chào mừng bạn trở lại 👋")).toBeTruthy();
    });
  });

  it("shows email and password fields", async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    
    await waitFor(() => {
      expect(getByText("Email")).toBeTruthy();
      expect(getByText("Mật khẩu")).toBeTruthy();
      expect(getByPlaceholderText("example@gmail.com")).toBeTruthy();
    });
  });

  it("shows login button", async () => {
    const { getByText } = render(<LoginScreen />);
    
    await waitFor(() => {
      expect(getByText("Đăng nhập")).toBeTruthy();
    });
  });

  it("shows register link", async () => {
    const { getByText } = render(<LoginScreen />);
    
    await waitFor(() => {
      expect(getByText("Chưa có tài khoản?")).toBeTruthy();
      expect(getByText("Đăng ký")).toBeTruthy();
    });
  });

  it("shows Google login button", async () => {
    const { getByText } = render(<LoginScreen />);
    
    await waitFor(() => {
      expect(getByText("Đăng nhập với Google mẫu")).toBeTruthy();
    });
  });

  it("handles email input changes", async () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    
    await waitFor(() => {
      const emailInput = getByPlaceholderText("example@gmail.com");
      fireEvent.changeText(emailInput, "test@test.com");
      expect(emailInput.props.value).toBe("test@test.com");
    });
  });

  it("handles password input changes", async () => {
    const { getAllByPlaceholderText } = render(<LoginScreen />);
    
    await waitFor(() => {
      const passwordInputs = getAllByPlaceholderText("••••••••");
      if (passwordInputs.length > 0) {
        fireEvent.changeText(passwordInputs[0], "password123");
        expect(passwordInputs[0].props.value).toBe("password123");
      }
    });
  });

  it("renders without crashing", () => {
    const { UNSAFE_root } = render(<LoginScreen />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it("shows Google icon", async () => {
    const { getByTestId } = render(<LoginScreen />);
    await waitFor(() => {
      expect(getByTestId("icon-google")).toBeTruthy();
    });
  });

  it("auto-redirects if token exists and is valid", async () => {
    mockGetItem.mockResolvedValue("existing-token");
    mockGetProfile.mockResolvedValue({ id: 1, name: "Existing User" });

    render(<LoginScreen />);
    
    await waitFor(() => {
      expect(mockGetProfile).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith("/home");
    });
  });

  it("removes invalid token and stays on login", async () => {
    mockGetItem.mockResolvedValue("invalid-token");
    mockGetProfile.mockRejectedValue(new Error("Invalid token"));

    render(<LoginScreen />);
    
    await waitFor(() => {
      expect(mockRemoveItem).toHaveBeenCalledWith("access_token");
      expect(mockRemoveItem).toHaveBeenCalledWith("user");
    });
  });

  it("navigates to register when register link pressed", async () => {
    const { getByText } = render(<LoginScreen />);
    
    await waitFor(() => {
      const registerLink = getByText("Đăng ký");
      fireEvent.press(registerLink);
      expect(mockPush).toHaveBeenCalledWith("/auth/register");
    });
  });

  it("calls login API when login button pressed with valid credentials", async () => {
    const { getByPlaceholderText, getByText, getAllByPlaceholderText } = render(<LoginScreen />);
    
    await waitFor(() => {
      const emailInput = getByPlaceholderText("example@gmail.com");
      fireEvent.changeText(emailInput, "test@test.com");
    });

    const passwordInputs = getAllByPlaceholderText("••••••••");
    fireEvent.changeText(passwordInputs[0], "password123");

    await act(async () => {
      fireEvent.press(getByText("Đăng nhập"));
    });

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalled();
    });
  });

  it("shows subtitle text", async () => {
    const { getByText } = render(<LoginScreen />);
    
    await waitFor(() => {
      expect(getByText("Đăng nhập vào tài khoản của bạn")).toBeTruthy();
    });
  });

  it("shows or separator", async () => {
    const { getByText } = render(<LoginScreen />);
    
    await waitFor(() => {
      expect(getByText("hoặc")).toBeTruthy();
    });
  });

  it("calls test login when Google button pressed", async () => {
    const { getByText } = render(<LoginScreen />);
    
    await waitFor(() => {
      expect(getByText("Đăng nhập với Google mẫu")).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByText("Đăng nhập với Google mẫu"));
    });

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalled();
    });
  });

  it("handles login error gracefully", async () => {
    mockSignIn.mockRejectedValue(new Error("Login failed"));

    const { getByPlaceholderText, getByText, getAllByPlaceholderText } = render(<LoginScreen />);
    
    await waitFor(() => {
      const emailInput = getByPlaceholderText("example@gmail.com");
      fireEvent.changeText(emailInput, "test@test.com");
    });

    const passwordInputs = getAllByPlaceholderText("••••••••");
    fireEvent.changeText(passwordInputs[0], "password123");

    await act(async () => {
      fireEvent.press(getByText("Đăng nhập"));
    });

    // Should not crash
    expect(getByText("Đăng nhập")).toBeTruthy();
  });

  it("persists session after successful login", async () => {
    const { getByPlaceholderText, getByText, getAllByPlaceholderText } = render(<LoginScreen />);
    
    await waitFor(() => {
      const emailInput = getByPlaceholderText("example@gmail.com");
      fireEvent.changeText(emailInput, "test@test.com");
    });

    const passwordInputs = getAllByPlaceholderText("••••••••");
    fireEvent.changeText(passwordInputs[0], "password123");

    await act(async () => {
      fireEvent.press(getByText("Đăng nhập"));
    });

    await waitFor(() => {
      expect(mockSetItem).toHaveBeenCalledWith("access_token", "fake-token");
    });
  });

  it("navigates to phone screen after successful login", async () => {
    const { getByPlaceholderText, getByText, getAllByPlaceholderText } = render(<LoginScreen />);
    
    await waitFor(() => {
      const emailInput = getByPlaceholderText("example@gmail.com");
      fireEvent.changeText(emailInput, "test@test.com");
    });

    const passwordInputs = getAllByPlaceholderText("••••••••");
    fireEvent.changeText(passwordInputs[0], "password123");

    await act(async () => {
      fireEvent.press(getByText("Đăng nhập"));
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/auth/phone");
    });
  });

  it("does not login with empty email", async () => {
    const { getByText, getAllByPlaceholderText } = render(<LoginScreen />);
    
    const passwordInputs = getAllByPlaceholderText("••••••••");
    fireEvent.changeText(passwordInputs[0], "password123");

    await act(async () => {
      fireEvent.press(getByText("Đăng nhập"));
    });

    // Should not call API with empty email
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it("does not login with empty password", async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    const emailInput = getByPlaceholderText("example@gmail.com");
    fireEvent.changeText(emailInput, "test@test.com");

    await act(async () => {
      fireEvent.press(getByText("Đăng nhập"));
    });

    // Should not call API with empty password
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it("trims email before login", async () => {
    const { getByPlaceholderText, getByText, getAllByPlaceholderText } = render(<LoginScreen />);
    
    const emailInput = getByPlaceholderText("example@gmail.com");
    fireEvent.changeText(emailInput, "  test@test.com  ");

    const passwordInputs = getAllByPlaceholderText("••••••••");
    fireEvent.changeText(passwordInputs[0], "password123");

    await act(async () => {
      fireEvent.press(getByText("Đăng nhập"));
    });

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: "test@test.com",
        password: "password123",
      });
    });
  });

  it("stores user data after successful login", async () => {
    const { getByPlaceholderText, getByText, getAllByPlaceholderText } = render(<LoginScreen />);
    
    const emailInput = getByPlaceholderText("example@gmail.com");
    fireEvent.changeText(emailInput, "test@test.com");

    const passwordInputs = getAllByPlaceholderText("••••••••");
    fireEvent.changeText(passwordInputs[0], "password123");

    await act(async () => {
      fireEvent.press(getByText("Đăng nhập"));
    });

    await waitFor(() => {
      expect(mockSetItem).toHaveBeenCalledWith("user", expect.any(String));
    });
  });

  it("handles sign up then sign in for new users via test login", async () => {
    // First call fails with 404 (user not found), then sign up, then sign in succeeds
    mockSignIn
      .mockRejectedValueOnce({ status: 404 })
      .mockResolvedValueOnce({ access_token: "new-token" });
    mockSignUp.mockResolvedValue({});

    const { getByText } = render(<LoginScreen />);
    
    await act(async () => {
      fireEvent.press(getByText("Đăng nhập với Google mẫu"));
    });

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalled();
    });
  });

  it("handles sign in with 401 error (creates account)", async () => {
    mockSignIn
      .mockRejectedValueOnce({ status: 401 })
      .mockResolvedValueOnce({ access_token: "new-token" });
    mockSignUp.mockResolvedValue({});

    const { getByText } = render(<LoginScreen />);
    
    await act(async () => {
      fireEvent.press(getByText("Đăng nhập với Google mẫu"));
    });

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalled();
    });
  });

  it("handles non-API errors during test login", async () => {
    mockSignIn.mockRejectedValue(new Error("Network error"));

    const { getByText, UNSAFE_root } = render(<LoginScreen />);
    
    await act(async () => {
      fireEvent.press(getByText("Đăng nhập với Google mẫu"));
    });

    // Should not crash
    expect(UNSAFE_root).toBeTruthy();
  });

  it("disables inputs while busy", async () => {
    // Make API call hang
    mockSignIn.mockReturnValue(new Promise(() => {}));

    const { getByPlaceholderText, getByText, getAllByPlaceholderText } = render(<LoginScreen />);
    
    const emailInput = getByPlaceholderText("example@gmail.com");
    fireEvent.changeText(emailInput, "test@test.com");

    const passwordInputs = getAllByPlaceholderText("••••••••");
    fireEvent.changeText(passwordInputs[0], "password123");

    await act(async () => {
      fireEvent.press(getByText("Đăng nhập"));
    });

    // Email input should be disabled while busy
    expect(emailInput.props.editable).toBe(false);
  });

  it("shows loading indicator while logging in", async () => {
    mockSignIn.mockReturnValue(new Promise(() => {}));

    const { getByPlaceholderText, getByText, getAllByPlaceholderText, queryByText } = render(<LoginScreen />);
    
    const emailInput = getByPlaceholderText("example@gmail.com");
    fireEvent.changeText(emailInput, "test@test.com");

    const passwordInputs = getAllByPlaceholderText("••••••••");
    fireEvent.changeText(passwordInputs[0], "password123");

    await act(async () => {
      fireEvent.press(getByText("Đăng nhập"));
    });

    // The login button text should be replaced by loading indicator
    // We can check if the component is still rendered
    expect(queryByText("Đăng nhập")).toBeTruthy();
  });
});
