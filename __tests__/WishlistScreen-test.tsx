import { render, waitFor } from "@testing-library/react-native";
import React from "react";

// Mock dependencies
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
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
    getMyWishlistsRouteApiUserWishlistsGet: jest.fn().mockResolvedValue([
      {
        id: 1,
        user_id: "user1",
        title: "Test Wishlist",
        course_id: 1,
        max_price: 100000,
        created_at: "2024-01-01T00:00:00Z",
      },
    ]),
  },
  CoursesService: {
    getCoursesListRouteApiCoursesGet: jest.fn().mockResolvedValue([
      { id: 1, name: "Toán" },
      { id: 2, name: "Lý" },
    ]),
  },
  WishlistsService: {
    deleteWishlistRouteApiWishlistsWishlistIdDelete: jest.fn().mockResolvedValue({}),
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

jest.mock("@/components/profile/InfoBanner", () => ({
  InfoBanner: () => {
    const { View } = require("react-native");
    return <View testID="info-banner" />;
  },
}));

jest.mock("@/components/profile/WishlistCard", () => ({
  WishlistCard: () => {
    const { View } = require("react-native");
    return <View testID="wishlist-card" />;
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
import WishlistScreen from "@/app/profile/wishlist";

describe("WishlistScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders wishlist screen correctly", async () => {
    const { getByText } = render(<WishlistScreen />);
    
    await waitFor(() => {
      expect(getByText("Quản lý Wishlist")).toBeTruthy();
    });
  });

  it("shows create wishlist button", async () => {
    const { getByText } = render(<WishlistScreen />);
    
    await waitFor(() => {
      expect(getByText(/Thêm Wishlist/i)).toBeTruthy();
    });
  });

  it("loads and displays wishlists", async () => {
    const { getByTestId } = render(<WishlistScreen />);
    
    await waitFor(() => {
      expect(getByTestId("wishlist-card")).toBeTruthy();
    });
  });
});

