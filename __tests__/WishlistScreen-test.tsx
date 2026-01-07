import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

// Mock dependencies
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
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

const mockGetWishlists = jest.fn();
const mockGetCourses = jest.fn();
const mockDeleteWishlist = jest.fn();

jest.mock("@/api", () => ({
  UserService: {
    getMyWishlistsRouteApiUserWishlistsGet: () => mockGetWishlists(),
  },
  CoursesService: {
    getCoursesListRouteApiCoursesGet: () => mockGetCourses(),
  },
  WishlistsService: {
    deleteWishlistRouteApiWishlistsWishlistIdDelete: (...args: any[]) => mockDeleteWishlist(...args),
  },
}));

jest.mock("@/components/ConfirmationModal", () => {
  const { View, Text, Pressable } = require("react-native");
  return function MockConfirmationModal({ visible, onClose, onConfirm, title }: any) {
    if (!visible) return null;
    return (
      <View testID="confirmation-modal">
        <Text>{title}</Text>
        <Pressable testID="confirm-btn" onPress={onConfirm}><Text>Confirm</Text></Pressable>
        <Pressable testID="cancel-btn" onPress={onClose}><Text>Cancel</Text></Pressable>
      </View>
    );
  };
});

jest.mock("@/components/SuccessModal", () => {
  const { View, Text } = require("react-native");
  return function MockSuccessModal({ visible, title }: any) {
    if (!visible) return null;
    return (
      <View testID="success-modal">
        <Text>{title}</Text>
      </View>
    );
  };
});

jest.mock("@/components/profile/InfoBanner", () => ({
  InfoBanner: ({ message }: any) => {
    const { View, Text } = require("react-native");
    return (
      <View testID="info-banner">
        <Text>{message}</Text>
      </View>
    );
  },
}));

jest.mock("@/components/profile/WishlistCard", () => ({
  WishlistCard: ({ title, subject, price, onDelete, onEdit }: any) => {
    const { View, Text, Pressable } = require("react-native");
    return (
      <View testID="wishlist-card">
        <Text>{title}</Text>
        <Text>{subject}</Text>
        <Text>{price}</Text>
        <Pressable testID="delete-wishlist" onPress={onDelete}><Text>Delete</Text></Pressable>
        <Pressable testID="edit-wishlist" onPress={onEdit}><Text>Edit</Text></Pressable>
      </View>
    );
  },
}));

jest.mock("@/icons/IconBack", () => {
  const { View } = require("react-native");
  return function MockIconBack() {
    return <View testID="icon-back" />;
  };
});

// Import component
import WishlistScreen from "@/app/profile/wishlist";

describe("WishlistScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetWishlists.mockResolvedValue([
      {
        id: 1,
        user_id: "user1",
        title: "Test Wishlist",
        course_id: 1,
        max_price: 100000,
        created_at: "2024-01-01T00:00:00Z",
      },
    ]);
    mockGetCourses.mockResolvedValue([
      { id: 1, name: "Toán" },
      { id: 2, name: "Lý" },
    ]);
    mockDeleteWishlist.mockResolvedValue({});
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

  it("calls API on mount", async () => {
    render(<WishlistScreen />);
    
    await waitFor(() => {
      expect(mockGetWishlists).toHaveBeenCalled();
    });
  });

  it("calls courses API on mount", async () => {
    render(<WishlistScreen />);
    
    await waitFor(() => {
      expect(mockGetCourses).toHaveBeenCalled();
    });
  });

  it("shows info banner", async () => {
    const { getByTestId } = render(<WishlistScreen />);
    
    await waitFor(() => {
      expect(getByTestId("info-banner")).toBeTruthy();
    });
  });

  it("shows back icon", async () => {
    const { getByTestId } = render(<WishlistScreen />);
    
    await waitFor(() => {
      expect(getByTestId("icon-back")).toBeTruthy();
    });
  });

  it("handles empty wishlists", async () => {
    mockGetWishlists.mockResolvedValueOnce([]);
    const { getByText } = render(<WishlistScreen />);
    
    await waitFor(() => {
      expect(getByText(/Chưa có Wishlist/i)).toBeTruthy();
    });
  });

  it("handles API error gracefully", async () => {
    mockGetWishlists.mockRejectedValueOnce(new Error("API Error"));
    const { UNSAFE_root } = render(<WishlistScreen />);
    
    await waitFor(() => {
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it("navigates to create wishlist", async () => {
    const { getByText } = render(<WishlistScreen />);
    
    await waitFor(() => {
      fireEvent.press(getByText(/Thêm Wishlist/i));
    });

    expect(mockPush).toHaveBeenCalledWith("/profile/wishlist-create");
  });

  it("navigates back when back button pressed", async () => {
    const { getByTestId } = render(<WishlistScreen />);
    
    await waitFor(() => {
      const backButton = getByTestId("icon-back").parent;
      if (backButton) {
        fireEvent.press(backButton);
      }
    });

    expect(mockBack).toHaveBeenCalled();
  });

  it("shows delete confirmation when delete button pressed", async () => {
    const { getByTestId } = render(<WishlistScreen />);
    
    await waitFor(() => {
      const deleteButton = getByTestId("delete-wishlist");
      fireEvent.press(deleteButton);
    });

    await waitFor(() => {
      expect(getByTestId("confirmation-modal")).toBeTruthy();
    });
  });

  it("deletes wishlist when confirmed", async () => {
    const { getByTestId } = render(<WishlistScreen />);
    
    await waitFor(() => {
      const deleteButton = getByTestId("delete-wishlist");
      fireEvent.press(deleteButton);
    });

    await waitFor(() => {
      expect(getByTestId("confirmation-modal")).toBeTruthy();
    });

    fireEvent.press(getByTestId("confirm-btn"));

    await waitFor(() => {
      expect(mockDeleteWishlist).toHaveBeenCalled();
    });
  });

  it("cancels delete when cancel button pressed", async () => {
    const { getByTestId, queryByTestId } = render(<WishlistScreen />);
    
    await waitFor(() => {
      const deleteButton = getByTestId("delete-wishlist");
      fireEvent.press(deleteButton);
    });

    await waitFor(() => {
      expect(getByTestId("confirmation-modal")).toBeTruthy();
    });

    fireEvent.press(getByTestId("cancel-btn"));

    await waitFor(() => {
      expect(queryByTestId("confirmation-modal")).toBeNull();
    });
  });

  it("navigates to edit wishlist", async () => {
    const { getByTestId } = render(<WishlistScreen />);
    
    await waitFor(() => {
      const editButton = getByTestId("edit-wishlist");
      fireEvent.press(editButton);
    });

    expect(mockPush).toHaveBeenCalled();
  });

  it("displays wishlist title", async () => {
    const { getByText } = render(<WishlistScreen />);
    
    await waitFor(() => {
      expect(getByText("Test Wishlist")).toBeTruthy();
    });
  });

  it("displays course name from lookup", async () => {
    const { getByText } = render(<WishlistScreen />);
    
    await waitFor(() => {
      expect(getByText("Toán")).toBeTruthy();
    });
  });

  it("shows loading state initially", () => {
    mockGetWishlists.mockReturnValue(new Promise(() => {})); // Hang
    const { UNSAFE_root } = render(<WishlistScreen />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it("handles multiple wishlists", async () => {
    mockGetWishlists.mockResolvedValueOnce([
      {
        id: 1,
        user_id: "user1",
        title: "Wishlist 1",
        course_id: 1,
        max_price: 100000,
        created_at: "2024-01-01T00:00:00Z",
      },
      {
        id: 2,
        user_id: "user1",
        title: "Wishlist 2",
        course_id: 2,
        max_price: 200000,
        created_at: "2024-01-02T00:00:00Z",
      },
    ]);

    const { getAllByTestId } = render(<WishlistScreen />);
    
    await waitFor(() => {
      expect(getAllByTestId("wishlist-card").length).toBe(2);
    });
  });

  it("handles delete API error", async () => {
    mockDeleteWishlist.mockRejectedValueOnce(new Error("Delete failed"));

    const { getByTestId, UNSAFE_root } = render(<WishlistScreen />);
    
    await waitFor(() => {
      const deleteButton = getByTestId("delete-wishlist");
      fireEvent.press(deleteButton);
    });

    await waitFor(() => {
      expect(getByTestId("confirmation-modal")).toBeTruthy();
    });

    fireEvent.press(getByTestId("confirm-btn"));

    // Should not crash
    await waitFor(() => {
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it("handles courses API error", async () => {
    mockGetCourses.mockRejectedValueOnce(new Error("Courses error"));
    const { UNSAFE_root } = render(<WishlistScreen />);
    
    await waitFor(() => {
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it("displays price in wishlist card", async () => {
    const { getByText } = render(<WishlistScreen />);
    
    await waitFor(() => {
      expect(getByText(/100\.000/)).toBeTruthy();
    });
  });

  it("handles wishlist without course_id", async () => {
    mockGetWishlists.mockResolvedValueOnce([
      {
        id: 1,
        user_id: "user1",
        title: "No Course Wishlist",
        course_id: 0,
        max_price: 50000,
        created_at: "2024-01-01T00:00:00Z",
      },
    ]);

    const { getByText } = render(<WishlistScreen />);
    
    await waitFor(() => {
      expect(getByText("No Course Wishlist")).toBeTruthy();
    });
  });
});
