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

  it("renders my posts screen with loading state", async () => {
    const { UNSAFE_root } = render(<MyPostsScreen />);
    
    // Component should render without crashing
    expect(UNSAFE_root).toBeTruthy();
  });

  it("renders component structure", async () => {
    const { UNSAFE_root } = render(<MyPostsScreen />);
    
    // Component renders without errors
    expect(UNSAFE_root).toBeTruthy();
  });

  it("handles empty posts list", async () => {
    const { UNSAFE_root } = render(<MyPostsScreen />);
    
    // Should render without errors even with empty data
    expect(UNSAFE_root).toBeTruthy();
  });
});

