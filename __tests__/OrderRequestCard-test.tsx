import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

// Mock icons
jest.mock("@/icons/IconMessenger2", () => {
  const { View } = require("react-native");
  return function MockIcon() {
    return <View testID="icon-messenger" />;
  };
});

jest.mock("@/icons/IconPhoneOutline", () => {
  const { View } = require("react-native");
  return function MockIcon() {
    return <View testID="icon-phone-outline" />;
  };
});

jest.mock("@/icons/IconProfileUser", () => {
  const { View } = require("react-native");
  return function MockIcon() {
    return <View testID="icon-profile-user" />;
  };
});

jest.mock("expo-image", () => ({
  Image: ({ source, style }: any) => {
    const { View } = require("react-native");
    return <View testID="mock-expo-image" style={style} />;
  },
}));

import { OrderRequestCard } from "@/components/profile/OrderRequestCard";

describe("OrderRequestCard", () => {
  const mockOnAccept = jest.fn();
  const mockOnReject = jest.fn();
  const mockOnChat = jest.fn();
  const mockOnMarkSold = jest.fn();

  const defaultProps = {
    bookTitle: "Sách Toán Cao Cấp",
    price: 150000,
    imageUri: "https://example.com/book.jpg",
    buyerName: "Nguyễn Văn A",
    buyerPhone: "0123456789",
    requestedAt: "01/01/2024 10:00",
    onAccept: mockOnAccept,
    onReject: mockOnReject,
    onChat: mockOnChat,
    onMarkSold: mockOnMarkSold,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders order request card correctly", () => {
    const { getByText } = render(<OrderRequestCard {...defaultProps} />);
    expect(getByText("Sách Toán Cao Cấp")).toBeTruthy();
    expect(getByText("150.000đ")).toBeTruthy();
    expect(getByText("Nguyễn Văn A")).toBeTruthy();
  });

  it("shows pending status by default", () => {
    const { getByText } = render(<OrderRequestCard {...defaultProps} />);
    expect(getByText("Chờ xác nhận")).toBeTruthy();
  });

  it("shows accept and reject buttons when pending", () => {
    const { getByText } = render(<OrderRequestCard {...defaultProps} status="pending" />);
    expect(getByText("✓ Chấp nhận")).toBeTruthy();
    expect(getByText("✗ Từ chối")).toBeTruthy();
  });

  it("calls onAccept when accept button is pressed", () => {
    const { getByText } = render(<OrderRequestCard {...defaultProps} status="pending" />);
    fireEvent.press(getByText("✓ Chấp nhận"));
    expect(mockOnAccept).toHaveBeenCalled();
  });

  it("calls onReject when reject button is pressed", () => {
    const { getByText } = render(<OrderRequestCard {...defaultProps} status="pending" />);
    fireEvent.press(getByText("✗ Từ chối"));
    expect(mockOnReject).toHaveBeenCalled();
  });

  it("shows accepted status", () => {
    const { getByText } = render(<OrderRequestCard {...defaultProps} status="accepted" />);
    expect(getByText("Đã chấp nhận")).toBeTruthy();
  });

  it("shows chat and mark sold buttons when accepted", () => {
    const { getByText } = render(<OrderRequestCard {...defaultProps} status="accepted" />);
    expect(getByText("Chat")).toBeTruthy();
    expect(getByText("✓ Đã bán")).toBeTruthy();
  });

  it("calls onMarkSold when mark sold button is pressed", () => {
    const { getByText } = render(<OrderRequestCard {...defaultProps} status="accepted" />);
    fireEvent.press(getByText("✓ Đã bán"));
    expect(mockOnMarkSold).toHaveBeenCalled();
  });

  it("shows rejected status", () => {
    const { getByText } = render(<OrderRequestCard {...defaultProps} status="rejected" />);
    expect(getByText("Đã từ chối")).toBeTruthy();
  });

  it("shows completed status", () => {
    const { getByText } = render(<OrderRequestCard {...defaultProps} status="completed" />);
    expect(getByText("Hoàn thành")).toBeTruthy();
  });

  it("renders completed card with different structure", () => {
    const { getByText, queryByText } = render(
      <OrderRequestCard {...defaultProps} status="completed" />
    );
    expect(getByText("Hoàn thành")).toBeTruthy();
    expect(queryByText("✓ Chấp nhận")).toBeNull();
  });

  it("formats phone number correctly", () => {
    const { getByText } = render(<OrderRequestCard {...defaultProps} buyerPhone="123456789" />);
    expect(getByText("0123456789")).toBeTruthy();
  });

  it("shows request time", () => {
    const { getByText } = render(<OrderRequestCard {...defaultProps} />);
    expect(getByText(/Yêu cầu lúc: 01\/01\/2024/)).toBeTruthy();
  });

  it("renders with isFirst prop", () => {
    const { UNSAFE_root } = render(<OrderRequestCard {...defaultProps} isFirst={true} />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it("renders with isLast prop", () => {
    const { UNSAFE_root } = render(<OrderRequestCard {...defaultProps} isLast={true} />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it("renders with isSingle prop", () => {
    const { UNSAFE_root } = render(<OrderRequestCard {...defaultProps} isSingle={true} />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it("renders image", () => {
    const { getByTestId } = render(<OrderRequestCard {...defaultProps} />);
    expect(getByTestId("mock-expo-image")).toBeTruthy();
  });

  it("shows buyer info section", () => {
    const { getByText } = render(<OrderRequestCard {...defaultProps} />);
    expect(getByText("Người mua:")).toBeTruthy();
  });
});

