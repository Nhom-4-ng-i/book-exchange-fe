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
  withScope: jest.fn((callback) => callback({ setTag: jest.fn(), setContext: jest.fn(), setLevel: jest.fn() })),
}));

// Mock router
const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
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
}));

// Mock googleAuth
jest.mock("googleAuth", () => ({
  loadGoogleSignin: jest.fn().mockResolvedValue({
    GoogleSignin: {
      configure: jest.fn(),
      hasPlayServices: jest.fn().mockResolvedValue(true),
      signIn: jest.fn().mockResolvedValue({
        data: { user: { email: "google@test.com", name: "Google User" } },
      }),
    },
    statusCodes: { SIGN_IN_CANCELLED: "CANCELLED", PLAY_SERVICES_NOT_AVAILABLE: "PLAY_SERVICES" },
    isErrorWithCode: jest.fn().mockReturnValue(false),
    isSuccessResponse: jest.fn().mockReturnValue(true),
    isCancelledResponse: jest.fn().mockReturnValue(false),
  }),
}));

// Import component
import RegisterScreen from "@/app/auth/register/index";

describe("RegisterScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue(null);
    mockSetItem.mockResolvedValue(undefined);
    mockSignIn.mockResolvedValue({ access_token: "new-token" });
    mockSignUp.mockResolvedValue({});
    mockGetProfile.mockResolvedValue({ id: 1, name: "New User" });
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

  it("renders without crashing", () => {
    const { UNSAFE_root } = render(<RegisterScreen />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it("shows or separator", async () => {
    const { getByText } = render(<RegisterScreen />);

    await waitFor(() => {
      expect(getByText("hoặc")).toBeTruthy();
    });
  });

  it("renders form structure", async () => {
    const { UNSAFE_root } = render(<RegisterScreen />);
    await waitFor(() => {
      expect(UNSAFE_root.children).toBeDefined();
    });
  });

  it("handles name input changes", async () => {
    const { getByPlaceholderText } = render(<RegisterScreen />);

    await waitFor(() => {
      const nameInput = getByPlaceholderText("Nguyễn Văn A");
      fireEvent.changeText(nameInput, "Test User");
      expect(nameInput.props.value).toBe("Test User");
    });
  });

  it("handles email input changes", async () => {
    const { getByPlaceholderText } = render(<RegisterScreen />);

    await waitFor(() => {
      const emailInput = getByPlaceholderText("example@gmail.com");
      fireEvent.changeText(emailInput, "test@example.com");
      expect(emailInput.props.value).toBe("test@example.com");
    });
  });

  it("handles password input changes", async () => {
    const { getAllByPlaceholderText } = render(<RegisterScreen />);

    await waitFor(() => {
      const passwordInputs = getAllByPlaceholderText("••••••••");
      if (passwordInputs.length > 0) {
        fireEvent.changeText(passwordInputs[0], "mypassword");
        expect(passwordInputs[0].props.value).toBe("mypassword");
      }
    });
  });

  it("navigates to login when login link pressed", async () => {
    const { getByText } = render(<RegisterScreen />);

    await waitFor(() => {
      const loginLink = getByText("Đăng nhập");
      fireEvent.press(loginLink);
      expect(mockPush).toHaveBeenCalledWith("/auth/login");
    });
  });

  it("calls register API when create account button pressed with valid data", async () => {
    const { getByPlaceholderText, getAllByText, getAllByPlaceholderText } = render(<RegisterScreen />);

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText("Nguyễn Văn A"), "New User");
      fireEvent.changeText(getByPlaceholderText("example@gmail.com"), "new@test.com");
    });

    const passwordInputs = getAllByPlaceholderText("••••••••");
    fireEvent.changeText(passwordInputs[0], "password123");

    const createButtons = getAllByText("Tạo tài khoản");
    
    await act(async () => {
      fireEvent.press(createButtons[1]); // Press the button (second one)
    });

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalled();
    });
  });

  it("calls sign in after successful registration", async () => {
    const { getByPlaceholderText, getAllByText, getAllByPlaceholderText } = render(<RegisterScreen />);

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText("Nguyễn Văn A"), "New User");
      fireEvent.changeText(getByPlaceholderText("example@gmail.com"), "new@test.com");
    });

    const passwordInputs = getAllByPlaceholderText("••••••••");
    fireEvent.changeText(passwordInputs[0], "password123");

    const createButtons = getAllByText("Tạo tài khoản");
    
    await act(async () => {
      fireEvent.press(createButtons[1]);
    });

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalled();
    });
  });

  it("persists session after successful registration", async () => {
    const { getByPlaceholderText, getAllByText, getAllByPlaceholderText } = render(<RegisterScreen />);

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText("Nguyễn Văn A"), "New User");
      fireEvent.changeText(getByPlaceholderText("example@gmail.com"), "new@test.com");
    });

    const passwordInputs = getAllByPlaceholderText("••••••••");
    fireEvent.changeText(passwordInputs[0], "password123");

    const createButtons = getAllByText("Tạo tài khoản");
    
    await act(async () => {
      fireEvent.press(createButtons[1]);
    });

    await waitFor(() => {
      expect(mockSetItem).toHaveBeenCalledWith("access_token", "new-token");
    });
  });

  it("navigates to phone screen after successful registration", async () => {
    const { getByPlaceholderText, getAllByText, getAllByPlaceholderText } = render(<RegisterScreen />);

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText("Nguyễn Văn A"), "New User");
      fireEvent.changeText(getByPlaceholderText("example@gmail.com"), "new@test.com");
    });

    const passwordInputs = getAllByPlaceholderText("••••••••");
    fireEvent.changeText(passwordInputs[0], "password123");

    const createButtons = getAllByText("Tạo tài khoản");
    
    await act(async () => {
      fireEvent.press(createButtons[1]);
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/auth/phone");
    });
  });

  it("handles registration error gracefully", async () => {
    mockSignUp.mockRejectedValue(new Error("Registration failed"));

    const { getByPlaceholderText, getAllByText, getAllByPlaceholderText } = render(<RegisterScreen />);

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText("Nguyễn Văn A"), "New User");
      fireEvent.changeText(getByPlaceholderText("example@gmail.com"), "new@test.com");
    });

    const passwordInputs = getAllByPlaceholderText("••••••••");
    fireEvent.changeText(passwordInputs[0], "password123");

    const createButtons = getAllByText("Tạo tài khoản");
    
    await act(async () => {
      fireEvent.press(createButtons[1]);
    });

    // Should not crash and screen should still be visible
    await waitFor(() => {
      expect(getAllByText("Tạo tài khoản").length).toBeGreaterThan(0);
    });
  });

  it("shows name placeholder", async () => {
    const { getByPlaceholderText } = render(<RegisterScreen />);

    await waitFor(() => {
      expect(getByPlaceholderText("Nguyễn Văn A")).toBeTruthy();
    });
  });

  it("shows email placeholder", async () => {
    const { getByPlaceholderText } = render(<RegisterScreen />);

    await waitFor(() => {
      expect(getByPlaceholderText("example@gmail.com")).toBeTruthy();
    });
  });

  it("shows password placeholder", async () => {
    const { getAllByPlaceholderText } = render(<RegisterScreen />);

    await waitFor(() => {
      expect(getAllByPlaceholderText("••••••••").length).toBeGreaterThan(0);
    });
  });

  it("does not register with empty name", async () => {
    const { getByPlaceholderText, getAllByText, getAllByPlaceholderText } = render(<RegisterScreen />);

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText("example@gmail.com"), "test@example.com");
    });

    const passwordInputs = getAllByPlaceholderText("••••••••");
    fireEvent.changeText(passwordInputs[0], "password123");

    const createButtons = getAllByText("Tạo tài khoản");
    
    await act(async () => {
      fireEvent.press(createButtons[1]);
    });

    // Should not call API with empty name
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it("does not register with empty email", async () => {
    const { getByPlaceholderText, getAllByText, getAllByPlaceholderText } = render(<RegisterScreen />);

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText("Nguyễn Văn A"), "Test User");
    });

    const passwordInputs = getAllByPlaceholderText("••••••••");
    fireEvent.changeText(passwordInputs[0], "password123");

    const createButtons = getAllByText("Tạo tài khoản");
    
    await act(async () => {
      fireEvent.press(createButtons[1]);
    });

    // Should not call API with empty email
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it("does not register with empty password", async () => {
    const { getByPlaceholderText, getAllByText } = render(<RegisterScreen />);

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText("Nguyễn Văn A"), "Test User");
      fireEvent.changeText(getByPlaceholderText("example@gmail.com"), "test@example.com");
    });

    const createButtons = getAllByText("Tạo tài khoản");
    
    await act(async () => {
      fireEvent.press(createButtons[1]);
    });

    // Should not call API with empty password
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it("trims name and email before registering", async () => {
    const { getByPlaceholderText, getAllByText, getAllByPlaceholderText } = render(<RegisterScreen />);

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText("Nguyễn Văn A"), "  Test User  ");
      fireEvent.changeText(getByPlaceholderText("example@gmail.com"), "  test@example.com  ");
    });

    const passwordInputs = getAllByPlaceholderText("••••••••");
    fireEvent.changeText(passwordInputs[0], "password123");

    const createButtons = getAllByText("Tạo tài khoản");
    
    await act(async () => {
      fireEvent.press(createButtons[1]);
    });

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("stores user data after successful registration", async () => {
    const { getByPlaceholderText, getAllByText, getAllByPlaceholderText } = render(<RegisterScreen />);

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText("Nguyễn Văn A"), "New User");
      fireEvent.changeText(getByPlaceholderText("example@gmail.com"), "new@test.com");
    });

    const passwordInputs = getAllByPlaceholderText("••••••••");
    fireEvent.changeText(passwordInputs[0], "password123");

    const createButtons = getAllByText("Tạo tài khoản");
    
    await act(async () => {
      fireEvent.press(createButtons[1]);
    });

    await waitFor(() => {
      expect(mockSetItem).toHaveBeenCalledWith("user", expect.any(String));
    });
  });

  it("disables inputs while busy", async () => {
    // Make API call hang
    mockSignUp.mockReturnValue(new Promise(() => {}));

    const { getByPlaceholderText, getAllByText, getAllByPlaceholderText } = render(<RegisterScreen />);

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText("Nguyễn Văn A"), "New User");
      fireEvent.changeText(getByPlaceholderText("example@gmail.com"), "new@test.com");
    });

    const passwordInputs = getAllByPlaceholderText("••••••••");
    fireEvent.changeText(passwordInputs[0], "password123");

    const createButtons = getAllByText("Tạo tài khoản");
    
    await act(async () => {
      fireEvent.press(createButtons[1]);
    });

    // Name input should be disabled while busy
    expect(getByPlaceholderText("Nguyễn Văn A").props.editable).toBe(false);
  });

  it("handles sign in failure after successful sign up", async () => {
    mockSignIn.mockRejectedValue(new Error("Sign in failed"));

    const { getByPlaceholderText, getAllByText, getAllByPlaceholderText, UNSAFE_root } = render(<RegisterScreen />);

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText("Nguyễn Văn A"), "New User");
      fireEvent.changeText(getByPlaceholderText("example@gmail.com"), "new@test.com");
    });

    const passwordInputs = getAllByPlaceholderText("••••••••");
    fireEvent.changeText(passwordInputs[0], "password123");

    const createButtons = getAllByText("Tạo tài khoản");
    
    await act(async () => {
      fireEvent.press(createButtons[1]);
    });

    // Should not crash
    expect(UNSAFE_root).toBeTruthy();
  });

  it("handles profile fetch failure gracefully", async () => {
    mockGetProfile.mockRejectedValue(new Error("Profile fetch failed"));

    const { getByPlaceholderText, getAllByText, getAllByPlaceholderText, UNSAFE_root } = render(<RegisterScreen />);

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText("Nguyễn Văn A"), "New User");
      fireEvent.changeText(getByPlaceholderText("example@gmail.com"), "new@test.com");
    });

    const passwordInputs = getAllByPlaceholderText("••••••••");
    fireEvent.changeText(passwordInputs[0], "password123");

    const createButtons = getAllByText("Tạo tài khoản");
    
    await act(async () => {
      fireEvent.press(createButtons[1]);
    });

    // Should not crash
    expect(UNSAFE_root).toBeTruthy();
  });

  it("shows correct call to signUp with proper parameters", async () => {
    const { getByPlaceholderText, getAllByText, getAllByPlaceholderText } = render(<RegisterScreen />);

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText("Nguyễn Văn A"), "John Doe");
      fireEvent.changeText(getByPlaceholderText("example@gmail.com"), "john@example.com");
    });

    const passwordInputs = getAllByPlaceholderText("••••••••");
    fireEvent.changeText(passwordInputs[0], "securepass");

    const createButtons = getAllByText("Tạo tài khoản");
    
    await act(async () => {
      fireEvent.press(createButtons[1]);
    });

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        password: "securepass",
      });
    });
  });

  it("shows correct call to signIn after signUp", async () => {
    const { getByPlaceholderText, getAllByText, getAllByPlaceholderText } = render(<RegisterScreen />);

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText("Nguyễn Văn A"), "John Doe");
      fireEvent.changeText(getByPlaceholderText("example@gmail.com"), "john@example.com");
    });

    const passwordInputs = getAllByPlaceholderText("••••••••");
    fireEvent.changeText(passwordInputs[0], "securepass");

    const createButtons = getAllByText("Tạo tài khoản");
    
    await act(async () => {
      fireEvent.press(createButtons[1]);
    });

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: "john@example.com",
        password: "securepass",
      });
    });
  });
});
