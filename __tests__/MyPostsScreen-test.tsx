import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

// Mock dependencies before importing the component
jest.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

const mockBack = jest.fn();
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    back: mockBack,
  }),
  // Do nothing in useFocusEffect - the test will manage state manually
  useFocusEffect: jest.fn(),
}));

jest.mock("@sentry/react-native", () => ({
  captureException: jest.fn(),
  withScope: jest.fn((callback) => callback({ 
    setTag: jest.fn(), 
    setContext: jest.fn(), 
    setLevel: jest.fn() 
  })),
}));

const mockGetMyPosts = jest.fn();
const mockCancelPost = jest.fn();
jest.mock("@/api", () => ({
  UserService: {
    getMyPostsRouteApiUserPostsGet: () => mockGetMyPosts(),
  },
  PostsService: {
    cancelPostRouteApiPostsPostIdCancelPost: (id: number) => mockCancelPost(id),
  },
}));

jest.mock("@/components/ConfirmationModal", () => {
  const { View, Pressable, Text } = require("react-native");
  return function MockConfirmationModal({ visible, onConfirm, onClose }: any) {
    if (!visible) return null;
    return (
      <View testID="confirmation-modal">
        <Pressable testID="confirm-delete-btn" onPress={onConfirm}>
          <Text>Xóa</Text>
        </Pressable>
        <Pressable testID="cancel-delete-btn" onPress={onClose}>
          <Text>Hủy</Text>
        </Pressable>
      </View>
    );
  };
});

jest.mock("@/components/SuccessModal", () => {
  const { View, Pressable, Text } = require("react-native");
  return function MockSuccessModal({ visible, onClose }: any) {
    if (!visible) return null;
    return (
      <View testID="success-modal">
        <Pressable testID="close-success-btn" onPress={onClose}>
          <Text>Đóng</Text>
        </Pressable>
      </View>
    );
  };
});

jest.mock("@/components/posts/PostDetailModal", () => {
  const { View, Pressable, Text } = require("react-native");
  return function MockPostDetailModal({ visible, onClose, renderActions }: any) {
    if (!visible) return null;
    return (
      <View testID="post-detail-modal">
        <Pressable testID="close-modal-btn" onPress={onClose}>
          <Text>Đóng</Text>
        </Pressable>
        {renderActions && renderActions({ id: 1 })}
      </View>
    );
  };
});

jest.mock("@/components/profile/PostCard", () => ({
  PostCard: ({ id, title, onDelete, onEdit }: any) => {
    const { View, Text, Pressable } = require("react-native");
    return (
      <View testID={`post-card-${id}`}>
        <Text>{title}</Text>
        <Pressable testID={`delete-post-${id}`} onPress={() => onDelete(id)}>
          <Text>Xóa</Text>
        </Pressable>
        <Pressable testID={`edit-post-${id}`} onPress={() => onEdit(id)}>
          <Text>Sửa</Text>
        </Pressable>
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

// Import sau khi mock
import MyPostsScreen from "@/app/profile/my-posts";
const { useFocusEffect } = require("expo-router");

describe("MyPostsScreen", () => {
  let focusCallback: () => void;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetMyPosts.mockResolvedValue([
      {
        id: 1,
        book_title: "Sách bán 1",
        course: "Toán",
        book_status: "Mới",
        price: 100000,
        status: "SELLING",
        avatar_url: "https://example.com/img.jpg",
      },
      {
        id: 2,
        book_title: "Sách bán 2",
        course: "Lý",
        book_status: "Cũ",
        price: 50000,
        status: "selling",
      },
      {
        id: 3,
        book_title: "Sách đã bán",
        course: "Hóa",
        book_status: "Mới",
        price: 200000,
        status: "SOLD",
      },
    ]);
    mockCancelPost.mockResolvedValue({});
    
    // Store the callback so we can call it after render
    useFocusEffect.mockImplementation((callback: () => void) => {
      focusCallback = callback;
    });
  });

  const renderAndTriggerFocus = async () => {
    const result = render(<MyPostsScreen />);
    // Trigger the focus effect callback
    await act(async () => {
      if (focusCallback) {
        focusCallback();
      }
    });
    return result;
  };

  it("renders my posts screen correctly after loading", async () => {
    const { getByText } = await renderAndTriggerFocus();
    
    await waitFor(() => {
      expect(getByText("Bài đăng của tôi")).toBeTruthy();
    });
  });

  it("shows selling posts section", async () => {
    const { getByText } = await renderAndTriggerFocus();
    
    await waitFor(() => {
      expect(getByText(/Đang bán/i)).toBeTruthy();
    });
  });

  it("shows sold posts section", async () => {
    const { getAllByText } = await renderAndTriggerFocus();
    
    await waitFor(() => {
      expect(getAllByText(/Đã bán/i).length).toBeGreaterThan(0);
    });
  });

  it("displays selling posts", async () => {
    const { getByText } = await renderAndTriggerFocus();
    
    await waitFor(() => {
      expect(getByText("Sách bán 1")).toBeTruthy();
      expect(getByText("Sách bán 2")).toBeTruthy();
    });
  });

  it("displays sold posts", async () => {
    const { getByText } = await renderAndTriggerFocus();
    
    await waitFor(() => {
      expect(getByText("Sách đã bán")).toBeTruthy();
    });
  });

  it("shows delete confirmation when delete is clicked", async () => {
    const { getByTestId, queryByTestId } = await renderAndTriggerFocus();
    
    await waitFor(() => {
      expect(getByTestId("delete-post-1")).toBeTruthy();
    });

    expect(queryByTestId("confirmation-modal")).toBeNull();
    fireEvent.press(getByTestId("delete-post-1"));

    await waitFor(() => {
      expect(getByTestId("confirmation-modal")).toBeTruthy();
    });
  });

  it("cancels delete when cancel is clicked", async () => {
    const { getByTestId, queryByTestId } = await renderAndTriggerFocus();
    
    await waitFor(() => {
      expect(getByTestId("delete-post-1")).toBeTruthy();
    });

    fireEvent.press(getByTestId("delete-post-1"));

    await waitFor(() => {
      expect(getByTestId("confirmation-modal")).toBeTruthy();
    });

    fireEvent.press(getByTestId("cancel-delete-btn"));

    await waitFor(() => {
      expect(queryByTestId("confirmation-modal")).toBeNull();
    });
  });

  it("deletes post when confirmed", async () => {
    const { getByTestId } = await renderAndTriggerFocus();
    
    await waitFor(() => {
      expect(getByTestId("delete-post-1")).toBeTruthy();
    });

    fireEvent.press(getByTestId("delete-post-1"));

    await waitFor(() => {
      expect(getByTestId("confirmation-modal")).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByTestId("confirm-delete-btn"));
    });

    await waitFor(() => {
      expect(mockCancelPost).toHaveBeenCalledWith(1);
    });
  });

  it("navigates to edit post when edit is clicked", async () => {
    const { getByTestId } = await renderAndTriggerFocus();
    
    await waitFor(() => {
      expect(getByTestId("edit-post-1")).toBeTruthy();
    });

    fireEvent.press(getByTestId("edit-post-1"));

    expect(mockPush).toHaveBeenCalled();
  });

  it("shows empty message when no selling posts", async () => {
    mockGetMyPosts.mockResolvedValue([
      {
        id: 3,
        book_title: "Sách đã bán",
        course: "Hóa",
        book_status: "Mới",
        price: 200000,
        status: "SOLD",
      },
    ]);

    const { getByText } = await renderAndTriggerFocus();
    
    await waitFor(() => {
      expect(getByText("Bạn chưa có bài đăng đang bán.")).toBeTruthy();
    });
  });

  it("shows empty message when no sold posts", async () => {
    mockGetMyPosts.mockResolvedValue([
      {
        id: 1,
        book_title: "Sách bán 1",
        course: "Toán",
        book_status: "Mới",
        price: 100000,
        status: "SELLING",
      },
    ]);

    const { getByText } = await renderAndTriggerFocus();
    
    await waitFor(() => {
      expect(getByText("Chưa có cuốn nào được đánh dấu đã bán.")).toBeTruthy();
    });
  });

  it("handles API error gracefully", async () => {
    mockGetMyPosts.mockRejectedValue(new Error("API Error"));

    const { getByText } = await renderAndTriggerFocus();
    
    await waitFor(() => {
      expect(getByText("Không thể tải danh sách bài đăng.")).toBeTruthy();
    });
  });
});
