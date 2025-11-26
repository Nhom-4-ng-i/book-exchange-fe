import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";

import { useRouter } from "expo-router";
import LoginScreen from "../src/app/auth/login";

const mockUseAuthRequest = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("expo-auth-session/providers/google", () => ({
  useAuthRequest: (...args: any[]) => mockUseAuthRequest(...args),
}));

jest.mock("expo-web-browser", () => ({
  maybeCompleteAuthSession: jest.fn(),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    removeItem: jest.fn(async () => {}),
  },
}));

jest.mock("../src/icons/IconFacebook", () => () => null);
jest.mock("../src/icons/IconGoogle", () => () => null);

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockReplace = jest.fn();
const mockPush = jest.fn();

const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
const consoleErrorSpy = jest
  .spyOn(console, "error")
  .mockImplementation(() => {});

describe("<LoginScreen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthRequest.mockReturnValue([
      { some: "request" },
      null,
      jest.fn(), // promptAsync
    ]);
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    } as any);
  });

  test("hiển thị tiêu đề và các nút đăng nhập", () => {
    const { getByText } = render(<LoginScreen />);

    expect(getByText("Chào mừng bạn trở lại 👋")).toBeTruthy();
    expect(getByText("Đăng nhập vào tài khoản của bạn")).toBeTruthy();
    expect(getByText("Đăng nhập với Google")).toBeTruthy();
    expect(getByText("Đăng nhập với Apple")).toBeTruthy();
    expect(getByText("Đăng nhập với Facebook")).toBeTruthy();
  });

  test("bấm các nút đăng nhập sẽ điều hướng đến màn hình nhập số điện thoại", () => {
    const { getByText } = render(<LoginScreen />);

    fireEvent.press(getByText("Đăng nhập với Google"));
    fireEvent.press(getByText("Đăng nhập với Apple"));
    fireEvent.press(getByText("Đăng nhập với Facebook"));

    expect(mockPush).toHaveBeenCalledWith("/auth/phone");
    expect(mockPush).toHaveBeenCalledTimes(3);
  });

  //hi
  //hi

  test("response Google thành công sẽ gọi fetchUserInfo và điều hướng /success", async () => {
    // giả lập response thành công từ Google
    mockUseAuthRequest.mockReturnValue([
      { some: "request" },
      {
        type: "success",
        authentication: { accessToken: "ACCESS_TOKEN_123" },
      } as any,
      jest.fn(),
    ]);

    const fetchMock = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ name: "Test User" }),
    });
    (global as any).fetch = fetchMock;

    render(<LoginScreen />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: "Bearer ACCESS_TOKEN_123" },
        }
      );
      expect(mockPush).toHaveBeenCalledWith("/success");
    });
  });

  test("fetchUserInfo lỗi sẽ hiển thị Alert lỗi", async () => {
    mockUseAuthRequest.mockReturnValue([
      { some: "request" },
      {
        type: "success",
        authentication: { accessToken: "BAD_TOKEN" },
      } as any,
      jest.fn(),
    ]);

    const fetchMock = jest.fn().mockRejectedValue(new Error("network error"));
    (global as any).fetch = fetchMock;

    const alertSpy = jest
      .spyOn(Alert, "alert")
      .mockImplementation(() => undefined);

    render(<LoginScreen />);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Lỗi",
        "Không thể lấy thông tin người dùng"
      );
    });
  });

  test("DEV TOOL vào lại onboarding sẽ xóa cờ onboarded và điều hướng /onboarding", async () => {
    (global as any).__DEV__ = true;

    const { getByText } = render(<LoginScreen />);

    const devTitle = getByText("DEV TOOL – NHÓM 4");
    expect(devTitle).toBeTruthy();

    const button = getByText("VÀO LẠI ONBOARDING");
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/onboarding");
    });
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});