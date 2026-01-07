import { render, waitFor } from "@testing-library/react-native";
import React from "react";

// Mock dependencies
jest.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
}));

jest.mock("expo-constants", () => ({
  default: {
    expoConfig: {
      extra: {
        googleSignIn: {
          webClientId: "test-web-client-id",
        },
      },
    },
  },
}));

jest.mock("@sentry/react-native", () => ({
  captureException: jest.fn(),
  withScope: jest.fn((callback) => callback({ setTag: jest.fn(), setContext: jest.fn(), setLevel: jest.fn() })),
}));

jest.mock("@/api", () => ({
  AuthService: {
    signInRouteApiAuthSignInPost: jest.fn(),
    signUpRouteApiAuthSignUpPost: jest.fn(),
  },
  UserService: {
    getMyProfileRouteApiUserMeGet: jest.fn(),
  },
  OpenAPI: {
    BASE: "",
    TOKEN: "",
  },
}));

// Import sau khi mock
import LoginScreen from "@/app/auth/login/index";

describe("LoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const AsyncStorage = require("@react-native-async-storage/async-storage").default;
    AsyncStorage.getItem.mockResolvedValue(null);
    AsyncStorage.removeItem.mockResolvedValue(undefined);
  });

  it("renders login screen correctly", async () => {
    const { getByText, UNSAFE_root } = render(<LoginScreen />);
    
    // Component should render without crashing
    expect(UNSAFE_root).toBeTruthy();
    
    await waitFor(() => {
      expect(getByText("Chào mừng bạn trở lại 👋")).toBeTruthy();
    }, { timeout: 3000 });
  });

  it("shows all form elements", async () => {
    const { getByText } = render(<LoginScreen />);
    
    await waitFor(() => {
      expect(getByText("Đăng nhập vào tài khoản của bạn")).toBeTruthy();
      expect(getByText("Email")).toBeTruthy();
      expect(getByText("Mật khẩu")).toBeTruthy();
      expect(getByText("Đăng nhập")).toBeTruthy();
    }, { timeout: 3000 });
  });

  it("shows register link", async () => {
    const { getByText } = render(<LoginScreen />);
    
    await waitFor(() => {
      expect(getByText("Chưa có tài khoản?")).toBeTruthy();
      expect(getByText("Đăng ký")).toBeTruthy();
    }, { timeout: 3000 });
  });

  it("shows Google login button", async () => {
    const { getByText } = render(<LoginScreen />);
    
    await waitFor(() => {
      expect(getByText("Đăng nhập với Google mẫu")).toBeTruthy();
    }, { timeout: 3000 });
  });
});

