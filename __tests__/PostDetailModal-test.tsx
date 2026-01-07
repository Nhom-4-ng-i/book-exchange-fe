import { render, waitFor } from "@testing-library/react-native";
import React from "react";

// Mock dependencies
jest.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: jest.fn().mockResolvedValue("fake-token"),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

jest.mock("@sentry/react-native", () => ({
  captureException: jest.fn(),
  withScope: jest.fn(),
}));

jest.mock("@expo/vector-icons", () => ({
  Ionicons: ({ name, size, color }: any) => {
    const { View } = require("react-native");
    return <View testID={`ionicons-${name}`} />;
  },
}));

const mockGetPost = jest.fn();
jest.mock("@/api", () => ({
  PostsService: {
    getPostRouteApiPostsPostIdGet: (id: number) => mockGetPost(id),
  },
  OpenAPI: {
    BASE: "",
    TOKEN: "",
  },
}));

jest.mock("@/icons/IconLocation", () => {
  const { View } = require("react-native");
  return function MockIconLocation() {
    return <View testID="icon-location" />;
  };
});

jest.mock("@/icons/PhoneIcon", () => {
  const { View } = require("react-native");
  return function MockPhoneIcon() {
    return <View testID="icon-phone" />;
  };
});

import PostDetailModal from "@/components/posts/PostDetailModal";
import { Pressable, Text } from "react-native";

describe("PostDetailModal", () => {
  const mockOnClose = jest.fn();

  const mockPost = {
    id: 1,
    title: "Sách Toán Cao Cấp",
    author: "Nguyễn Văn A",
    course_name: "Toán cao cấp",
    price: 150000,
    original_price: 200000,
    book_status: "Mới 90%",
    description: "Sách còn mới, không ghi chép",
    location: "Khu A - ĐHBK",
    seller_name: "Trần Văn B",
    seller_phone: "0123456789",
    avatar_url: "https://example.com/book.jpg",
    created_at: "2024-01-01T10:00:00Z",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetPost.mockResolvedValue(mockPost);
  });

  it("does not render when not visible", () => {
    const { queryByText } = render(
      <PostDetailModal visible={false} onClose={mockOnClose} />
    );
    expect(queryByText("Sách Toán Cao Cấp")).toBeNull();
  });

  it("renders modal when visible with initial post", () => {
    const { getByText } = render(
      <PostDetailModal
        visible={true}
        initialPost={mockPost}
        onClose={mockOnClose}
      />
    );
    expect(getByText("Sách Toán Cao Cấp")).toBeTruthy();
  });

  it("shows book details", () => {
    const { getByText } = render(
      <PostDetailModal
        visible={true}
        initialPost={mockPost}
        onClose={mockOnClose}
      />
    );
    expect(getByText(/Tác giả: Nguyễn Văn A/)).toBeTruthy();
    expect(getByText(/Tên môn: Toán cao cấp/)).toBeTruthy();
  });

  it("shows prices correctly", () => {
    const { getByText } = render(
      <PostDetailModal
        visible={true}
        initialPost={mockPost}
        onClose={mockOnClose}
      />
    );
    expect(getByText("150.000đ")).toBeTruthy();
    expect(getByText("200.000đ")).toBeTruthy();
  });

  it("shows savings percentage", () => {
    const { getByText } = render(
      <PostDetailModal
        visible={true}
        initialPost={mockPost}
        onClose={mockOnClose}
      />
    );
    expect(getByText(/Tiết kiệm 25%/)).toBeTruthy();
  });

  it("shows description", () => {
    const { getByText } = render(
      <PostDetailModal
        visible={true}
        initialPost={mockPost}
        onClose={mockOnClose}
      />
    );
    expect(getByText("Mô tả")).toBeTruthy();
    expect(getByText(/Trạng thái: Mới 90%/)).toBeTruthy();
  });

  it("shows seller information", () => {
    const { getByText } = render(
      <PostDetailModal
        visible={true}
        initialPost={mockPost}
        onClose={mockOnClose}
      />
    );
    expect(getByText("Người bán")).toBeTruthy();
    expect(getByText("Trần Văn B")).toBeTruthy();
  });

  it("shows location", () => {
    const { getByText, getByTestId } = render(
      <PostDetailModal
        visible={true}
        initialPost={mockPost}
        onClose={mockOnClose}
      />
    );
    expect(getByText("Khu A - ĐHBK")).toBeTruthy();
    expect(getByTestId("icon-location")).toBeTruthy();
  });

  it("shows phone number", () => {
    const { getByText, getByTestId } = render(
      <PostDetailModal
        visible={true}
        initialPost={mockPost}
        onClose={mockOnClose}
      />
    );
    expect(getByText("0123456789")).toBeTruthy();
    expect(getByTestId("icon-phone")).toBeTruthy();
  });

  it("renders custom actions when provided", () => {
    const { getByText } = render(
      <PostDetailModal
        visible={true}
        initialPost={mockPost}
        onClose={mockOnClose}
        renderActions={(post) => (
          <Pressable>
            <Text>Đặt mua</Text>
          </Pressable>
        )}
      />
    );
    expect(getByText("Đặt mua")).toBeTruthy();
  });

  it("renders with postId", () => {
    const { UNSAFE_root } = render(
      <PostDetailModal
        visible={true}
        postId={1}
        onClose={mockOnClose}
      />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it("handles default avatar URL", () => {
    const postWithDefaultAvatar = {
      ...mockPost,
      avatar_url: "DefaultAvatarURL",
    };
    
    const { UNSAFE_root } = render(
      <PostDetailModal
        visible={true}
        initialPost={postWithDefaultAvatar}
        onClose={mockOnClose}
      />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it("handles missing description", () => {
    const postWithoutDesc = {
      ...mockPost,
      description: null,
    };
    
    const { getByText } = render(
      <PostDetailModal
        visible={true}
        initialPost={postWithoutDesc}
        onClose={mockOnClose}
      />
    );
    expect(getByText(/Chưa có mô tả/)).toBeTruthy();
  });

  it("handles missing phone number", () => {
    const postWithoutPhone = {
      ...mockPost,
      seller_phone: null,
    };
    
    const { getByText } = render(
      <PostDetailModal
        visible={true}
        initialPost={postWithoutPhone}
        onClose={mockOnClose}
      />
    );
    expect(getByText("Chưa có số điện thoại")).toBeTruthy();
  });

  it("handles API error gracefully with initial post", async () => {
    mockGetPost.mockRejectedValue(new Error("API Error"));
    
    const { UNSAFE_root } = render(
      <PostDetailModal
        visible={true}
        postId={1}
        initialPost={mockPost}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it("shows person icon", () => {
    const { getByTestId } = render(
      <PostDetailModal
        visible={true}
        initialPost={mockPost}
        onClose={mockOnClose}
      />
    );
    expect(getByTestId("ionicons-person")).toBeTruthy();
  });
});
