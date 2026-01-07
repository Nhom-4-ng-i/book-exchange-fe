import { render, waitFor } from "@testing-library/react-native";
import React from "react";

// Mock dependencies
jest.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: jest.fn(),
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
import RegisterScreen from "@/app/auth/register/index";

describe("RegisterScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders register screen correctly", async () => {
    const { getAllByText } = render(<RegisterScreen />);
    
    await waitFor(() => {
      const elements = getAllByText("Tạo tài khoản");
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it("shows all form elements", async () => {
    const { getByText } = render(<RegisterScreen />);
    
    await waitFor(() => {
      expect(getByText("Hãy nhập thông tin để đăng ký tài khoản nào!")).toBeTruthy();
      expect(getByText("Họ và tên")).toBeTruthy();
      expect(getByText("Email")).toBeTruthy();
      expect(getByText("Mật khẩu")).toBeTruthy();
    });
  });

  it("shows login link", async () => {
    const { getByText } = render(<RegisterScreen />);
    
    await waitFor(() => {
      expect(getByText("Đã có tài khoản?")).toBeTruthy();
      expect(getByText("Đăng nhập")).toBeTruthy();
    });
  });

  it("renders create account button", async () => {
    const { getAllByText } = render(<RegisterScreen />);
    
    await waitFor(() => {
      const buttons = getAllByText("Tạo tài khoản");
      expect(buttons.length).toBe(2); // Title and button
    });
  });
});

