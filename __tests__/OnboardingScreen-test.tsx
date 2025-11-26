import { render } from "@testing-library/react-native";
import React from "react";

import HomeScreen from "../src/app/home";

jest.mock("@/components/BottomNav", () => {
  const React = require("react");
  const { Text } = require("react-native");
  const MockBottomNav = () => <Text>BottomNav</Text>;
  MockBottomNav.displayName = "MockBottomNav";
  return MockBottomNav;
});
jest.mock("@/components/HeaderHome", () => {
  const React = require("react");
  const { Text } = require("react-native");
  const MockHeaderHome = ({ title }: { title: string }) => <Text>{title}</Text>;
  MockHeaderHome.displayName = "MockHeaderHome";
  return MockHeaderHome;
});
jest.mock("expo-status-bar", () => ({
  StatusBar: () => null,
}));

describe("<HomeScreen />", () => {
  test("hiển thị tiêu đề và nút đăng sách", () => {
    const { getByText } = render(<HomeScreen />);

    expect(getByText("Trang chủ")).toBeTruthy();
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
});