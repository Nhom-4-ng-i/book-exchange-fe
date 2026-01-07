import { render, waitFor } from "@testing-library/react-native";
import React from "react";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn().mockResolvedValue("fake-token"),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

const mockRouterPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
  useFocusEffect: jest.fn(),
}));

jest.mock("@sentry/react-native", () => ({
  captureException: jest.fn(),
  withScope: jest.fn((callback) =>
    callback({
      setTag: jest.fn(),
      setContext: jest.fn(),
      setLevel: jest.fn(),
    })
  ),
}));

const mockGetPosts = jest.fn();
const mockGetCourses = jest.fn();
const mockGetPost = jest.fn();
const mockInsertOrder = jest.fn();

jest.mock("@/api", () => ({
  PostsService: {
    getPostsListRouteApiPostsGet: (...args: any[]) => mockGetPosts(...args),
    getPostRouteApiPostsPostIdGet: (...args: any[]) => mockGetPost(...args),
  },
  CoursesService: {
    getCoursesListRouteApiCoursesGet: () => mockGetCourses(),
  },
  OrdersService: {
    insertOrderRouteApiOrdersPost: (...args: any[]) => mockInsertOrder(...args),
  },
  OpenAPI: { BASE: "", TOKEN: "" },
}));

jest.mock("@/components/BottomNav", () => {
  const { View, Text } = require("react-native");
  return function MockBottomNav() {
    return (
      <View testID="bottom-nav">
        <Text>BottomNav</Text>
      </View>
    );
  };
});

jest.mock("@/components/HeaderHome", () => {
  const { View, Text, Pressable } = require("react-native");
  return function MockHeaderHome({ onSearchPress }: any) {
    return (
      <View testID="header-home">
        <Text>HeaderHome</Text>
        <Pressable onPress={onSearchPress} testID="search-button">
          <Text>Search</Text>
        </Pressable>
      </View>
    );
  };
});

jest.mock("@/components/posts/PostDetailModal", () => {
  const { View, Text, Pressable } = require("react-native");
  return function MockPostDetailModal({ visible, onClose, postId }: any) {
    if (!visible) return null;
    return (
      <View testID="post-detail-modal">
        <Text>Post Detail Modal</Text>
        {postId && <Text>Post ID: {postId}</Text>}
        <Pressable onPress={onClose} testID="close-detail-modal-button">
          <Text>Close</Text>
        </Pressable>
      </View>
    );
  };
});

jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

jest.mock("@/icons/IconSearch", () => {
  const { View } = require("react-native");
  return function MockIconSearch() {
    return <View testID="icon-search" />;
  };
});

jest.mock("@/icons/IconArrowDown", () => {
  const { View } = require("react-native");
  return function MockIconArrowDown() {
    return <View testID="icon-arrow-down" />;
  };
});

jest.mock("@/icons/IconBack", () => {
  const { View } = require("react-native");
  return function MockIconBack() {
    return <View testID="icon-back" />;
  };
});

import HomeIndex from "@/app/home/index";
import { useFocusEffect } from "expo-router";

describe("HomeIndex", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup useFocusEffect to call the callback immediately
    (useFocusEffect as jest.Mock).mockImplementation((callback: () => void) => {
      React.useEffect(() => {
        callback();
      }, []);
    });
    
    mockGetPosts.mockResolvedValue([
      {
        id: 1,
        title: "Sách Toán",
        author: "Nguyễn Văn A",
        course: "Toán cao cấp",
        book_status: "Mới",
        price: 100000,
        original_price: 120000,
        avatar_url: "http://example.com/math.jpg",
        seller_phone: "0123456789",
      },
      {
        id: 2,
        title: "Sách Văn",
        author: "Trần Thị B",
        course: "Văn học",
        book_status: "Cũ",
        price: 50000,
        original_price: 60000,
        avatar_url: "http://example.com/literature.jpg",
        seller_phone: "0987654321",
      },
    ]);
    mockGetCourses.mockResolvedValue([
      { id: 1, name: "Toán cao cấp" },
      { id: 2, name: "Văn học" },
    ]);
    mockGetPost.mockResolvedValue({
      id: 1,
      title: "Sách Toán",
      author: "Nguyễn Văn A",
      course: "Toán cao cấp",
      book_status: "Mới",
      price: 100000,
      seller_name: "Seller Name",
      seller_phone: "0123456789",
    });
    mockInsertOrder.mockResolvedValue({});
  });

  it("renders correctly", async () => {
    const { getByText } = render(<HomeIndex />);
    await waitFor(() => {
      expect(getByText("Sách Toán")).toBeTruthy();
    });
  });

  it("calls API on mount", async () => {
    render(<HomeIndex />);
    await waitFor(() => {
      expect(mockGetPosts).toHaveBeenCalled();
    });
  });

  it("calls courses API on mount", async () => {
    render(<HomeIndex />);
    await waitFor(() => {
      expect(mockGetCourses).toHaveBeenCalled();
    });
  });

  it("shows add new post button", async () => {
    const { getByText } = render(<HomeIndex />);
    await waitFor(() => {
      expect(getByText("+ Đăng sách/tài liệu mới")).toBeTruthy();
    });
  });

  it("shows empty message when no posts", async () => {
    mockGetPosts.mockResolvedValueOnce([]);
    const { getByText } = render(<HomeIndex />);
    await waitFor(() => {
      expect(getByText("Không có bài đăng.")).toBeTruthy();
    });
  });

  it("handles API error for courses gracefully", async () => {
    mockGetCourses.mockRejectedValueOnce(new Error("Courses API Error"));
    const { getByText } = render(<HomeIndex />);
    await waitFor(() => {
      expect(getByText("Tất cả")).toBeTruthy();
    });
  });

  it("shows post list", async () => {
    const { getByText } = render(<HomeIndex />);
    await waitFor(() => {
      expect(getByText("Sách Toán")).toBeTruthy();
    });
  });

  it("shows bottom navigation", async () => {
    const { getByTestId } = render(<HomeIndex />);
    await waitFor(() => {
      expect(getByTestId("bottom-nav")).toBeTruthy();
    });
  });

  it("shows header component", async () => {
    const { getByTestId } = render(<HomeIndex />);
    await waitFor(() => {
      expect(getByTestId("header-home")).toBeTruthy();
    });
  });

  it("handles posts API error gracefully", async () => {
    mockGetPosts.mockRejectedValueOnce(new Error("API Error"));
    const { UNSAFE_root } = render(<HomeIndex />);
    await waitFor(() => {
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
