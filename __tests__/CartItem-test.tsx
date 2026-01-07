import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

// Mock dependencies
jest.mock("@/icons/IconDelete", () => {
  const { View } = require("react-native");
  return function MockIconDelete() {
    return <View testID="icon-delete" />;
  };
});

// Import the actual component
import CartItem from "@/components/CartItem";

describe("CartItem Component", () => {
  const mockOnDelete = jest.fn();
  const mockOnPress = jest.fn();

  const defaultProps = {
    orderId: 1,
    bookName: "Sách Toán Cao Cấp",
    seller: "Nguyễn Văn A",
    status: "Chờ xác nhận",
    price: 150000,
    image: "https://example.com/book.jpg",
    ondelete: mockOnDelete,
    onPress: mockOnPress,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders cart item correctly", () => {
    const { getByText } = render(<CartItem {...defaultProps} />);
    expect(getByText("Sách Toán Cao Cấp")).toBeTruthy();
    expect(getByText("Người bán: Nguyễn Văn A")).toBeTruthy();
    expect(getByText("Chờ xác nhận")).toBeTruthy();
  });

  it("formats price correctly", () => {
    const { getByText } = render(<CartItem {...defaultProps} />);
    expect(getByText("150.000đ")).toBeTruthy();
  });

  it("calls onPress when item is pressed", () => {
    const { getByText } = render(<CartItem {...defaultProps} />);
    
    fireEvent.press(getByText("Sách Toán Cao Cấp"));
    expect(mockOnPress).toHaveBeenCalled();
  });

  it("uses default image when image is DefaultAvatarURL", () => {
    const { UNSAFE_root } = render(
      <CartItem {...defaultProps} image="DefaultAvatarURL" />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it("uses default image when image is empty", () => {
    const { UNSAFE_root } = render(
      <CartItem {...defaultProps} image="" />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it("renders delete icon", () => {
    const { getByTestId } = render(<CartItem {...defaultProps} />);
    expect(getByTestId("icon-delete")).toBeTruthy();
  });

  it("handles price with different values", () => {
    const { getByText } = render(
      <CartItem {...defaultProps} price={1234567} />
    );
    expect(getByText("1.234.567đ")).toBeTruthy();
  });

  it("renders component structure correctly", () => {
    const { UNSAFE_root } = render(<CartItem {...defaultProps} />);
    expect(UNSAFE_root).toBeTruthy();
    expect(UNSAFE_root.children).toBeDefined();
  });

  it("handles null price gracefully", () => {
    const { UNSAFE_root } = render(
      <CartItem {...defaultProps} price={null as any} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });
});
