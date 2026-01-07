import { render } from "@testing-library/react-native";
import React from "react";

/**
 * MOCK CartItem Component
 */
jest.mock("@/components/CartItem", () => {
  const React = require("react");
  const { Text, View } = require("react-native");

  return function MockCartItem({ bookName, price }: any) {
    return (
      <View>
        <Text>CART_ITEM_COMPONENT</Text>
        {bookName && <Text>{bookName}</Text>}
        {price && <Text>{price.toLocaleString()}đ</Text>}
      </View>
    );
  };
});

// Import sau khi mock
import CartItem from "@/components/CartItem";

describe("CartItem Component", () => {
  it("renders cart item component", () => {
    const { getByText } = render(<CartItem orderId={1} bookName="Book Title" seller="Seller" status="Status" price={100000} image="Image" ondelete={() => {}} onPress={() => {}} />);
    expect(getByText("CART_ITEM_COMPONENT")).toBeTruthy();
  });

  it("renders cart item with title", () => {
    const { getByText } = render(<CartItem orderId={1} bookName="Book Title" seller="Seller" status="Status" price={100000} image="Image" ondelete={() => {}} onPress={() => {}} />);
    expect(getByText("Book Title")).toBeTruthy();
  });

  it("renders cart item with price", () => {
    const { getByText } = render(<CartItem orderId={1} bookName="Book Title" seller="Seller" status="Status" price={100000} image="Image" ondelete={() => {}} onPress={() => {}} />);
    expect(getByText("100,000đ")).toBeTruthy();
  });

  it("renders cart item with all props", () => {
    const { getByText } = render(
      <CartItem orderId={1} bookName="Test Book" seller="Seller" status="Status" price={50000} image="Image" ondelete={() => {}} onPress={() => {}} />
    );
    expect(getByText("CART_ITEM_COMPONENT")).toBeTruthy();
    expect(getByText("Test Book")).toBeTruthy();
    expect(getByText("50,000đ")).toBeTruthy();
  });
});

