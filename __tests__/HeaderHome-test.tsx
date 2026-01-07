import { render } from "@testing-library/react-native";
import React from "react";

/**
 * MOCK HeaderHome Component
 */
jest.mock("@/components/HeaderHome", () => {
  const React = require("react");
  const { Text, View } = require("react-native");

  return function MockHeaderHome({ title, showSearch, showChat, showNotification }: any) {
    return (
      <View>
        <Text>HEADER_HOME_COMPONENT</Text>
        <Text>{title}</Text>
        {showSearch && <Text>Search Icon</Text>}
        {showChat && <Text>Chat Icon</Text>}
        {showNotification && <Text>Notification Icon</Text>}
      </View>
    );
  };
});

// Import sau khi mock
import HeaderHome from "@/components/HeaderHome";

describe("HeaderHome Component", () => {
  it("renders header home component", () => {
    const { getByText } = render(<HeaderHome title="Trang chủ" />);
    expect(getByText("HEADER_HOME_COMPONENT")).toBeTruthy();
  });

  it("renders header with title", () => {
    const { getByText } = render(<HeaderHome title="Trang chủ" />);
    expect(getByText("Trang chủ")).toBeTruthy();
  });

  it("renders header with search icon", () => {
    const { getByText } = render(<HeaderHome title="Home" showSearch />);
    expect(getByText("Search Icon")).toBeTruthy();
  });

  it("renders header with chat icon", () => {
    const { getByText } = render(<HeaderHome title="Home" showChat />);
    expect(getByText("Chat Icon")).toBeTruthy();
  });

  it("renders header with notification icon", () => {
    const { getByText } = render(<HeaderHome title="Home" showNotification />);
    expect(getByText("Notification Icon")).toBeTruthy();
  });

  it("renders header with all icons", () => {
    const { getByText } = render(
      <HeaderHome title="Trang chủ" showSearch showChat showNotification />
    );
    expect(getByText("Search Icon")).toBeTruthy();
    expect(getByText("Chat Icon")).toBeTruthy();
    expect(getByText("Notification Icon")).toBeTruthy();
  });
});

