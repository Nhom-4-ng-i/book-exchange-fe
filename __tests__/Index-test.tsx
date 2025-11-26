import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

import * as Sentry from "@sentry/react-native";
import HomeScreen from "../src/app/home";

jest.mock("@sentry/react-native", () => ({
  captureMessage: jest.fn(),
  captureException: jest.fn(),
}));

// Dùng string component đơn giản để tránh lỗi jest.mock out-of-scope variables
jest.mock("@/components/BottomNav", () => "BottomNav");
jest.mock("@/components/HeaderHome", () => "HeaderHome");

jest.mock("expo-status-bar", () => ({
  StatusBar: () => null,
}));

const mockCaptureMessage = Sentry.captureMessage as jest.MockedFunction<
  typeof Sentry.captureMessage
>;
const mockCaptureException = Sentry.captureException as jest.MockedFunction<
  typeof Sentry.captureException
>;

describe("<HomeScreen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("hiển thị nút đăng sách", () => {
    const { getByText } = render(<HomeScreen />);

    expect(getByText("+ Đăng sách/tài liệu mới")).toBeTruthy();
  });

  test("hiển thị đầy đủ danh mục", () => {
    const { getByText, getAllByText } = render(<HomeScreen />);

    expect(getByText("Tất cả")).toBeTruthy();
    expect(getAllByText("Ngoại ngữ")).toHaveLength(3);
  });

  test("render danh sách sách với đủ số lượng", () => {
    const { getAllByText } = render(<HomeScreen />);

    const bookTitles = getAllByText("Giải tích");
    expect(bookTitles).toHaveLength(6);
    expect(getAllByText("120.000đ").length).toBeGreaterThan(0);
  });

  test("nhấn nút đăng sách sẽ gửi message và exception qua Sentry và throw error", () => {
    const { getByText } = render(<HomeScreen />);

    const button = getByText("+ Đăng sách/tài liệu mới");

    expect(() => {
      fireEvent.press(button);
    }).toThrow();

    expect(mockCaptureMessage).toHaveBeenCalledWith(
      "Test Sentry từ nút + Đăng sách/tài liệu mới – Nhóm 4 test crash"
    );
    expect(mockCaptureException).toHaveBeenCalled();
  });
});