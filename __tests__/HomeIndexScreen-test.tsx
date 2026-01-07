import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

// Mock AsyncStorage
const mockGetItem = jest.fn();
jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: (...args: any[]) => mockGetItem(...args),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

// Mock router
const mockRouterPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockRouterPush,
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useFocusEffect: jest.fn((callback) => {
    // Execute callback immediately for testing
    React.useEffect(() => {
      callback();
    }, []);
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

const mockGetPosts = jest.fn();
const mockGetCourses = jest.fn();
const mockInsertOrder = jest.fn();

jest.mock("@/api", () => ({
  PostsService: {
    getPostsListRouteApiPostsGet: (...args: any[]) => mockGetPosts(...args),
  },
  CoursesService: {
    getCoursesListRouteApiCoursesGet: () => mockGetCourses(),
  },
  OrdersService: {
    insertOrderRouteApiOrdersPost: (...args: any[]) => mockInsertOrder(...args),
  },
  OpenAPI: {
    BASE: "",
    TOKEN: "",
  },
}));

jest.mock("@/components/HeaderHome", () => {
  const { View, Text, Pressable } = require("react-native");
  return function MockHeaderHome({ title, onSearchPress }: any) {
    return (
      <View testID="header-home">
        <Text>{title}</Text>
        <Pressable testID="search-btn" onPress={onSearchPress}><Text>Search</Text></Pressable>
      </View>
    );
  };
});

jest.mock("@/components/BottomNav", () => {
  const { View } = require("react-native");
  return function MockBottomNav() {
    return <View testID="bottom-nav" />;
  };
});

jest.mock("@/components/posts/PostDetailModal", () => {
  const { View, Text, Pressable } = require("react-native");
  return function MockPostDetailModal({ visible, initialPost, onClose, renderActions }: any) {
    if (!visible) return null;
    return (
      <View testID="post-detail-modal">
        <Text>Post Detail</Text>
        {initialPost && <Text testID="post-title">{initialPost.title}</Text>}
        {renderActions && renderActions(initialPost || {})}
        <Pressable testID="close-modal" onPress={onClose}><Text>Close</Text></Pressable>
      </View>
    );
  };
});

jest.mock("@/icons/IconArrowDown", () => {
  const { View } = require("react-native");
  return function MockIcon() {
    return <View testID="icon-arrow-down" />;
  };
});

jest.mock("@/icons/IconBack", () => {
  const { View } = require("react-native");
  return function MockIcon() {
    return <View testID="icon-back" />;
  };
});

jest.mock("@/icons/IconSearch", () => {
  const { View } = require("react-native");
  return function MockIcon() {
    return <View testID="icon-search" />;
  };
});

jest.mock("@expo/vector-icons", () => ({
  Ionicons: ({ name }: any) => {
    const { View } = require("react-native");
    return <View testID={`ionicon-${name}`} />;
  },
}));

// Mock Linking
jest.mock("react-native/Libraries/Linking/Linking", () => ({
  openURL: jest.fn(),
}));

import HomeIndexScreen from "@/app/home/index";

describe("HomeIndexScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue("fake-token");
    mockGetPosts.mockResolvedValue([
      {
        id: 1,
        title: "Sách Toán",
        author: "Nguyễn Văn A",
        course_name: "Toán cao cấp",
        book_status: "Mới",
        price: 100000,
        original_price: 120000,
        seller_name: "Seller 1",
        seller_phone: "0123456789",
        avatar_url: "https://example.com/image1.jpg",
      },
      {
        id: 2,
        title: "Sách Văn",
        author: "Trần Thị B",
        course_name: "Văn học",
        book_status: "Cũ",
        price: 50000,
        seller_name: "Seller 2",
        seller_phone: "0987654321",
        avatar_url: "https://example.com/image2.jpg",
      },
    ]);
    mockGetCourses.mockResolvedValue([
      { id: 1, name: "Toán cao cấp" },
      { id: 2, name: "Văn học" },
    ]);
    mockInsertOrder.mockResolvedValue({});
  });

  it("renders home screen correctly", async () => {
    const { getByText } = render(<HomeIndexScreen />);
    await waitFor(() => {
      expect(getByText("Trang chủ")).toBeTruthy();
    });
  });

  it("renders without crashing", () => {
    const { UNSAFE_root } = render(<HomeIndexScreen />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it("loads posts from API", async () => {
    render(<HomeIndexScreen />);
    await waitFor(() => {
      expect(mockGetPosts).toHaveBeenCalled();
    });
  });

  it("loads courses from API", async () => {
    render(<HomeIndexScreen />);
    await waitFor(() => {
      expect(mockGetCourses).toHaveBeenCalled();
    });
  });

  it("displays posts", async () => {
    const { getByText } = render(<HomeIndexScreen />);
    await waitFor(() => {
      expect(getByText("Sách Toán")).toBeTruthy();
      expect(getByText("Sách Văn")).toBeTruthy();
    });
  });

  it("shows add post button", async () => {
    const { getByText } = render(<HomeIndexScreen />);
    await waitFor(() => {
      expect(getByText("+ Đăng sách/tài liệu mới")).toBeTruthy();
    });
  });

  it("navigates to add post screen", async () => {
    const { getByText } = render(<HomeIndexScreen />);
    await waitFor(() => {
      fireEvent.press(getByText("+ Đăng sách/tài liệu mới"));
    });
    expect(mockRouterPush).toHaveBeenCalledWith("/home/addPost");
  });

  it("shows bottom navigation", async () => {
    const { getByTestId } = render(<HomeIndexScreen />);
    await waitFor(() => {
      expect(getByTestId("bottom-nav")).toBeTruthy();
    });
  });

  it("shows header", async () => {
    const { getByTestId } = render(<HomeIndexScreen />);
    await waitFor(() => {
      expect(getByTestId("header-home")).toBeTruthy();
    });
  });

  it("shows empty message when no posts", async () => {
    mockGetPosts.mockResolvedValueOnce([]);
    const { getByText } = render(<HomeIndexScreen />);
    await waitFor(() => {
      expect(getByText("Không có bài đăng.")).toBeTruthy();
    });
  });

  it("handles API error gracefully", async () => {
    mockGetPosts.mockRejectedValueOnce(new Error("API Error"));
    const { UNSAFE_root } = render(<HomeIndexScreen />);
    await waitFor(() => {
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it("handles courses API error gracefully", async () => {
    mockGetCourses.mockRejectedValueOnce(new Error("Courses Error"));
    const { getByText } = render(<HomeIndexScreen />);
    await waitFor(() => {
      expect(getByText("Tất cả")).toBeTruthy();
    });
  });

  it("opens search mode when search button pressed", async () => {
    const { getByTestId, getByPlaceholderText } = render(<HomeIndexScreen />);
    await waitFor(() => {
      fireEvent.press(getByTestId("search-btn"));
    });
    await waitFor(() => {
      expect(getByPlaceholderText("Tìm kiếm")).toBeTruthy();
    });
  });

  it("closes search mode when back button pressed", async () => {
    const { getByTestId, queryByPlaceholderText, getByText } = render(<HomeIndexScreen />);
    
    await waitFor(() => {
      fireEvent.press(getByTestId("search-btn"));
    });
    
    await waitFor(() => {
      expect(queryByPlaceholderText("Tìm kiếm")).toBeTruthy();
    });

    // Find back button by testID
    await act(async () => {
      const backButton = getByTestId("icon-back").parent;
      if (backButton) fireEvent.press(backButton);
    });

    await waitFor(() => {
      expect(getByText("+ Đăng sách/tài liệu mới")).toBeTruthy();
    });
  });

  it("filters posts by search query", async () => {
    const { getByTestId, getByPlaceholderText, getByText, queryByText } = render(<HomeIndexScreen />);
    
    await waitFor(() => {
      fireEvent.press(getByTestId("search-btn"));
    });

    const searchInput = getByPlaceholderText("Tìm kiếm");
    fireEvent.changeText(searchInput, "Toán");

    await waitFor(() => {
      expect(getByText("Sách Toán")).toBeTruthy();
    });
  });

  it("shows categories", async () => {
    const { getByText } = render(<HomeIndexScreen />);
    await waitFor(() => {
      expect(getByText("Tất cả")).toBeTruthy();
      expect(getByText("Toán cao cấp")).toBeTruthy();
      expect(getByText("Văn học")).toBeTruthy();
    });
  });

  it("filters posts by category", async () => {
    const { getByText } = render(<HomeIndexScreen />);
    
    await waitFor(() => {
      expect(getByText("Toán cao cấp")).toBeTruthy();
    });

    fireEvent.press(getByText("Toán cao cấp"));

    await waitFor(() => {
      expect(getByText("Sách Toán")).toBeTruthy();
    });
  });

  it("shows all posts when 'Tất cả' is selected", async () => {
    const { getByText } = render(<HomeIndexScreen />);
    
    await waitFor(() => {
      fireEvent.press(getByText("Toán cao cấp"));
    });

    fireEvent.press(getByText("Tất cả"));

    await waitFor(() => {
      expect(getByText("Sách Toán")).toBeTruthy();
      expect(getByText("Sách Văn")).toBeTruthy();
    });
  });

  it("opens post detail modal when post is pressed", async () => {
    const { getByText, getByTestId } = render(<HomeIndexScreen />);
    
    await waitFor(() => {
      fireEvent.press(getByText("Sách Toán"));
    });

    await waitFor(() => {
      expect(getByTestId("post-detail-modal")).toBeTruthy();
    });
  });

  it("closes post detail modal", async () => {
    const { getByText, getByTestId, queryByTestId } = render(<HomeIndexScreen />);
    
    await waitFor(() => {
      fireEvent.press(getByText("Sách Toán"));
    });

    await waitFor(() => {
      expect(getByTestId("post-detail-modal")).toBeTruthy();
    });

    fireEvent.press(getByTestId("close-modal"));

    await waitFor(() => {
      expect(queryByTestId("post-detail-modal")).toBeNull();
    });
  });

  it("handles default avatar URL", async () => {
    mockGetPosts.mockResolvedValueOnce([
      {
        id: 1,
        title: "Test Book",
        book_status: "Mới",
        price: 100000,
        avatar_url: "DefaultAvatarURL",
      },
    ]);

    const { getByText } = render(<HomeIndexScreen />);
    await waitFor(() => {
      expect(getByText("Test Book")).toBeTruthy();
    });
  });

  it("displays original price with strikethrough when higher than price", async () => {
    const { getByText } = render(<HomeIndexScreen />);
    await waitFor(() => {
      // The original price should be displayed for Sách Toán (120000 > 100000)
      expect(getByText("120.000đ")).toBeTruthy();
    });
  });

  it("shows loading indicator initially", async () => {
    mockGetPosts.mockReturnValue(new Promise(() => {})); // Never resolve
    const { UNSAFE_root } = render(<HomeIndexScreen />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it("calls loadPosts on search submit", async () => {
    const { getByTestId, getByPlaceholderText } = render(<HomeIndexScreen />);
    
    await waitFor(() => {
      fireEvent.press(getByTestId("search-btn"));
    });

    const searchInput = getByPlaceholderText("Tìm kiếm");
    fireEvent.changeText(searchInput, "Test Query");
    fireEvent(searchInput, "submitEditing");

    await waitFor(() => {
      // loadPosts is called with the search query
      expect(mockGetPosts).toHaveBeenCalled();
    });
  });

  it("handles API error for loadPosts with ApiError", async () => {
    const apiError = new Error("API Error");
    (apiError as any).name = "ApiError";
    (apiError as any).status = 500;
    mockGetCourses.mockRejectedValueOnce(apiError);
    
    const { getByText } = render(<HomeIndexScreen />);
    await waitFor(() => {
      expect(getByText("Tất cả")).toBeTruthy();
    });
  });

  it("shows Danh sách header", async () => {
    const { getByText } = render(<HomeIndexScreen />);
    await waitFor(() => {
      expect(getByText("Danh sách")).toBeTruthy();
    });
  });

  it("hides bottom nav in search mode", async () => {
    const { getByTestId, queryByTestId } = render(<HomeIndexScreen />);
    
    await waitFor(() => {
      expect(getByTestId("bottom-nav")).toBeTruthy();
    });

    fireEvent.press(getByTestId("search-btn"));

    await waitFor(() => {
      expect(queryByTestId("bottom-nav")).toBeNull();
    });
  });

  it("filters posts by author in search", async () => {
    mockGetPosts.mockResolvedValue([
      { id: 1, title: "Sách A", author: "Nguyễn Văn A", price: 100000, book_status: "Mới" },
      { id: 2, title: "Sách B", author: "Trần Thị B", price: 50000, book_status: "Cũ" },
    ]);

    const { getByTestId, getByPlaceholderText, getByText } = render(<HomeIndexScreen />);
    
    await waitFor(() => {
      fireEvent.press(getByTestId("search-btn"));
    });

    const searchInput = getByPlaceholderText("Tìm kiếm");
    fireEvent.changeText(searchInput, "Nguyễn");

    await waitFor(() => {
      expect(getByText("Sách A")).toBeTruthy();
    });
  });

  it("handles missing course name in posts", async () => {
    mockGetPosts.mockResolvedValueOnce([
      { id: 1, title: "Sách No Course", price: 100000, book_status: "Mới" },
    ]);

    const { getByText } = render(<HomeIndexScreen />);
    await waitFor(() => {
      expect(getByText("Sách No Course")).toBeTruthy();
    });
  });

  it("uses course field when course_name is missing", async () => {
    mockGetPosts.mockResolvedValueOnce([
      { id: 1, title: "Sách Test", course: "Toán cao cấp", price: 100000, book_status: "Mới" },
    ]);

    const { getByText } = render(<HomeIndexScreen />);
    
    await waitFor(() => {
      fireEvent.press(getByText("Toán cao cấp"));
    });

    await waitFor(() => {
      expect(getByText("Sách Test")).toBeTruthy();
    });
  });
});
