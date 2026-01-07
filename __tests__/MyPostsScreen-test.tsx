import { render, waitFor } from "@testing-library/react-native";
import React from "react";

// Mock dependencies
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useFocusEffect: jest.fn((callback) => {
    // Do nothing in tests to avoid calling fetchMyPosts
  }),
}));

jest.mock("@sentry/react-native", () => ({
  captureException: jest.fn(),
  withScope: jest.fn((callback) => callback({ 
    setTag: jest.fn(), 
    setContext: jest.fn(), 
    setLevel: jest.fn() 
  })),
}));

jest.mock("@/api", () => ({
  UserService: {
    getMyPostsRouteApiUserPostsGet: jest.fn().mockResolvedValue([
      {
        id: 1,
        book_title: "Test Book",
        course: "Toán",
        book_status: "Mới",
        price: 100000,
        status: "SELLING",
        avatar_url: "https://example.com/image.jpg",
      },
      {
        id: 2,
        book_title: "Sold Book",
        course: "Lý",
        book_status: "Cũ",
        price: 50000,
        status: "SOLD",
        avatar_url: "https://example.com/image2.jpg",
      },
    ]),
  },
  PostsService: {
    deletePostRouteApiPostsPostIdDelete: jest.fn().mockResolvedValue({}),
  },
}));

jest.mock("@/components/ConfirmationModal", () => {
  const React = require("react");
  const { View } = require("react-native");
  return function MockConfirmationModal() {
    return <View testID="confirmation-modal" />;
  };
});

jest.mock("@/components/SuccessModal", () => {
  const React = require("react");
  const { View } = require("react-native");
  return function MockSuccessModal() {
    return <View testID="success-modal" />;
  };
});

jest.mock("@/components/posts/PostDetailModal", () => {
  const React = require("react");
  const { View } = require("react-native");
  return function MockPostDetailModal() {
    return <View testID="post-detail-modal" />;
  };
});

jest.mock("@/components/profile/PostCard", () => ({
  PostCard: () => {
    const { View } = require("react-native");
    return <View testID="post-card" />;
  },
}));

jest.mock("@/icons/IconBack", () => {
  const React = require("react");
  const { View } = require("react-native");
  return function MockIconBack() {
    return <View testID="icon-back" />;
  };
});

// Import sau khi mock
import MyPostsScreen from "@/app/profile/my-posts";

describe("MyPostsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders my posts screen correctly", async () => {
    const { getByText } = render(<MyPostsScreen />);
    
    await waitFor(() => {
      expect(getByText("Bài đăng của tôi")).toBeTruthy();
    });
  });

  it("shows selling and sold tabs", async () => {
    const { getByText } = render(<MyPostsScreen />);
    
    await waitFor(() => {
      expect(getByText(/Đang bán/i)).toBeTruthy();
      expect(getByText(/Đã bán/i)).toBeTruthy();
    });
  });

  it("loads and displays posts", async () => {
    const { getAllByTestId } = render(<MyPostsScreen />);
    
    await waitFor(() => {
      const postCards = getAllByTestId("post-card");
      expect(postCards.length).toBeGreaterThan(0);
    });
  });
});

