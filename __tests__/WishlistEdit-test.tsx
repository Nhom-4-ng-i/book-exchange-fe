import { render, waitFor } from "@testing-library/react-native";
import React from "react";

// Mock dependencies
const mockRouterBack = jest.fn();
const mockRouterReplace = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: mockRouterBack,
    replace: mockRouterReplace,
  }),
  useLocalSearchParams: () => ({
    id: "1",
    title: "Test Wishlist",
    course_id: "1",
    max_price: "100000",
  }),
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

const mockGetCourses = jest.fn();
const mockUpdateWishlist = jest.fn();

jest.mock("@/api", () => ({
  CoursesService: {
    getCoursesListRouteApiCoursesGet: () => mockGetCourses(),
  },
  WishlistsService: {
    updateWishlistRouteApiWishlistsWishlistIdPut: (...args: any[]) => mockUpdateWishlist(...args),
  },
}));

jest.mock("lucide-react-native", () => ({
  ChevronDown: () => null,
}));

jest.mock("@/components/SuccessModal", () => {
  const { View, Text, Pressable } = require("react-native");
  return function MockSuccessModal({ visible, onClose, title }: any) {
    if (!visible) return null;
    return (
      <View testID="success-modal">
        <Text>{title}</Text>
        <Pressable testID="close-modal" onPress={onClose}><Text>Close</Text></Pressable>
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

jest.mock("@/icons/IconBack", () => {
  const { View } = require("react-native");
  return function MockIcon() {
    return <View testID="icon-back" />;
  };
});

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }: any) => children,
}));

import WishlistEditScreen from "@/app/profile/wishlist-edit";

describe("WishlistEditScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCourses.mockResolvedValue([
      { id: 1, name: "Giải tích 1" },
      { id: 2, name: "Đại số tuyến tính" },
    ]);
    mockUpdateWishlist.mockResolvedValue({});
  });

  it("renders without crashing", async () => {
    const { UNSAFE_root } = render(<WishlistEditScreen />);
    await waitFor(() => {
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it("loads courses on mount", async () => {
    render(<WishlistEditScreen />);
    await waitFor(() => {
      expect(mockGetCourses).toHaveBeenCalled();
    });
  });

  it("renders component tree", async () => {
    const { UNSAFE_root } = render(<WishlistEditScreen />);
    await waitFor(() => {
      expect(UNSAFE_root.children).toBeDefined();
    });
  });

  it("shows save button after loading", async () => {
    const { findByText } = render(<WishlistEditScreen />);
    const button = await findByText("Cập nhật Wishlist");
    expect(button).toBeTruthy();
  });

  it("shows back icon after loading", async () => {
    const { findByTestId } = render(<WishlistEditScreen />);
    const icon = await findByTestId("icon-back");
    expect(icon).toBeTruthy();
  });

  it("shows info banner after loading", async () => {
    const { findByTestId } = render(<WishlistEditScreen />);
    const banner = await findByTestId("info-banner");
    expect(banner).toBeTruthy();
  });

  it("handles courses API error gracefully", async () => {
    mockGetCourses.mockRejectedValueOnce(new Error("API Error"));
    const { UNSAFE_root } = render(<WishlistEditScreen />);
    await waitFor(() => {
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it("shows course selector label after loading", async () => {
    const { findByText } = render(<WishlistEditScreen />);
    const label = await findByText("Môn học (không bắt buộc)");
    expect(label).toBeTruthy();
  });

  it("shows title label after loading", async () => {
    const { findByText } = render(<WishlistEditScreen />);
    const label = await findByText("Tên sách/tài liệu cần tìm *");
    expect(label).toBeTruthy();
  });

  it("shows page header after loading", async () => {
    const { findByText } = render(<WishlistEditScreen />);
    const header = await findByText("Chỉnh sửa Wishlist");
    expect(header).toBeTruthy();
  });

  it("shows price label after loading", async () => {
    const { findByText } = render(<WishlistEditScreen />);
    const label = await findByText("Giá tối đa (không bắt buộc)");
    expect(label).toBeTruthy();
  });

  it("shows example section after loading", async () => {
    const { findByText } = render(<WishlistEditScreen />);
    const example = await findByText("Ví dụ Wishlist:");
    expect(example).toBeTruthy();
  });

  it("renders form fields", async () => {
    const { findByPlaceholderText } = render(<WishlistEditScreen />);
    const titleInput = await findByPlaceholderText("VD: Giải tích 2");
    expect(titleInput).toBeTruthy();
  });

  it("renders price field", async () => {
    const { findByPlaceholderText } = render(<WishlistEditScreen />);
    const priceInput = await findByPlaceholderText("VD: 120000");
    expect(priceInput).toBeTruthy();
  });

  it("renders submit button", async () => {
    const { findByText } = render(<WishlistEditScreen />);
    const button = await findByText("Cập nhật Wishlist");
    expect(button).toBeTruthy();
  });

  it("renders back button", async () => {
    const { findByTestId } = render(<WishlistEditScreen />);
    const backButton = await findByTestId("icon-back");
    expect(backButton).toBeTruthy();
  });
});
