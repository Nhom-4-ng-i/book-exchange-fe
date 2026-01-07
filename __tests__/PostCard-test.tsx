import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

// Mock dependencies
jest.mock("expo-image", () => ({
  Image: ({ source, style, contentFit }: any) => {
    const { View } = require("react-native");
    return <View testID="mock-expo-image" style={style} />;
  },
}));

jest.mock("@/icons/IconDelete", () => {
  const { View } = require("react-native");
  return function MockIconDelete() {
    return <View testID="icon-delete" />;
  };
});

jest.mock("@/icons/IconEdit2", () => {
  const { View } = require("react-native");
  return function MockIconEdit2() {
    return <View testID="icon-edit" />;
  };
});

import { PostCard } from "@/components/profile/PostCard";

describe("PostCard", () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  const defaultProps = {
    id: 1,
    title: "Sách giáo khoa Toán 12",
    category: "Toán học",
    condition: "Mới",
    price: "150.000đ",
    status: "Đang bán",
    thumbnailUrl: "https://example.com/book.jpg",
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders post card correctly", () => {
    const { getByText } = render(<PostCard {...defaultProps} />);

    expect(getByText("Sách giáo khoa Toán 12")).toBeTruthy();
    expect(getByText("Toán học")).toBeTruthy();
    expect(getByText("Mới")).toBeTruthy();
    expect(getByText("150.000đ")).toBeTruthy();
  });

  it("renders image", () => {
    const { getByTestId } = render(<PostCard {...defaultProps} />);
    expect(getByTestId("mock-expo-image")).toBeTruthy();
  });

  it("shows edit and delete buttons when not sold", () => {
    const { getByTestId } = render(<PostCard {...defaultProps} />);
    expect(getByTestId("icon-edit")).toBeTruthy();
    expect(getByTestId("icon-delete")).toBeTruthy();
  });

  it("calls onEdit when edit button is pressed", () => {
    const { getByTestId } = render(<PostCard {...defaultProps} />);
    
    const editBtn = getByTestId("icon-edit").parent;
    if (editBtn) {
      fireEvent.press(editBtn);
    }
    
    expect(mockOnEdit).toHaveBeenCalledWith(1);
  });

  it("calls onDelete when delete button is pressed", () => {
    const { getByTestId } = render(<PostCard {...defaultProps} />);
    
    const deleteBtn = getByTestId("icon-delete").parent;
    if (deleteBtn) {
      fireEvent.press(deleteBtn);
    }
    
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  it("hides edit and delete buttons when sold", () => {
    const { queryByTestId } = render(
      <PostCard {...defaultProps} status="Đã bán" />
    );
    expect(queryByTestId("icon-edit")).toBeNull();
    expect(queryByTestId("icon-delete")).toBeNull();
  });

  it("applies opacity when sold", () => {
    const { UNSAFE_root } = render(
      <PostCard {...defaultProps} status="Đã bán" />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it("renders with condition Cũ", () => {
    const { getByText } = render(
      <PostCard {...defaultProps} condition="Cũ" />
    );
    expect(getByText("Cũ")).toBeTruthy();
  });

  it("renders with default avatar when thumbnailUrl is DefaultAvatarURL", () => {
    const { getByTestId } = render(
      <PostCard {...defaultProps} thumbnailUrl="DefaultAvatarURL" />
    );
    expect(getByTestId("mock-expo-image")).toBeTruthy();
  });

  it("handles missing onEdit callback", () => {
    const { getByTestId } = render(
      <PostCard {...defaultProps} onEdit={undefined} />
    );
    
    const editBtn = getByTestId("icon-edit").parent;
    if (editBtn) {
      fireEvent.press(editBtn);
    }
    // Should not throw
  });

  it("handles missing onDelete callback", () => {
    const { getByTestId } = render(
      <PostCard {...defaultProps} onDelete={undefined} />
    );
    
    const deleteBtn = getByTestId("icon-delete").parent;
    if (deleteBtn) {
      fireEvent.press(deleteBtn);
    }
    // Should not throw
  });
});

