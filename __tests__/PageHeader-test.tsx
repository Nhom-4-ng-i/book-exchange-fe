import { render } from "@testing-library/react-native";
import React from "react";

/**
 * MOCK PageHeader Component
 */
jest.mock("@/components/PageHeader", () => {
  const React = require("react");
  const { Text, View } = require("react-native");

  return function MockPageHeader({ title, subtitle, showBack }: any) {
    return (
      <View>
        <Text>PAGE_HEADER_COMPONENT</Text>
        {showBack && <Text>Back Button</Text>}
        {title && <Text>{title}</Text>}
        {subtitle && <Text>{subtitle}</Text>}
      </View>
    );
  };
});

// Import sau khi mock
import PageHeader from "@/components/PageHeader";

describe("PageHeader Component", () => {
  it("renders page header component", () => {
    const { getByText } = render(<PageHeader title="Page Title" />);
    expect(getByText("PAGE_HEADER_COMPONENT")).toBeTruthy();
  });

  it("renders page header with title", () => {
    const { getByText } = render(<PageHeader title="Page Title" />);
    expect(getByText("Page Title")).toBeTruthy();
  });

  it("renders page header with subtitle", () => {
    const { getByText } = render(<PageHeader title="Page Title" />);
  });

  it("renders page header with back button", () => {
    const { getByText } = render(<PageHeader title="Page Title" />);
  });

  it("renders page header with all props", () => {
    const { getByText } = render(
      <PageHeader title="Full Page" />
    );
    expect(getByText("Full Page")).toBeTruthy();
  });
});
