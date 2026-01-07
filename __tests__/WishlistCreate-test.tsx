import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

// Mock dependencies
const mockRouterBack = jest.fn();
const mockRouterReplace = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: mockRouterBack,
    replace: mockRouterReplace,
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
const mockCreateWishlist = jest.fn();

jest.mock("@/api", () => ({
  CoursesService: {
    getCoursesListRouteApiCoursesGet: () => mockGetCourses(),
  },
  WishlistsService: {
    insertWishlistRouteApiWishlistsPost: (...args: any[]) => mockCreateWishlist(...args),
  },
}));

jest.mock("lucide-react-native", () => ({
  ChevronDown: "ChevronDown",
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

import WishlistCreateScreen from "@/app/profile/wishlist-create";

describe("WishlistCreateScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCourses.mockResolvedValue([
      { id: 1, name: "Giải tích 1" },
      { id: 2, name: "Đại số tuyến tính" },
    ]);
    mockCreateWishlist.mockResolvedValue({ id: 1 });
  });

  it("renders without crashing", async () => {
    const { UNSAFE_root } = render(<WishlistCreateScreen />);
    await waitFor(() => {
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it("loads courses on mount", async () => {
    render(<WishlistCreateScreen />);
    await waitFor(() => {
      expect(mockGetCourses).toHaveBeenCalled();
    });
  });

  it("renders component tree", async () => {
    const { UNSAFE_root } = render(<WishlistCreateScreen />);
    await waitFor(() => {
      expect(UNSAFE_root.children).toBeDefined();
    });
  });

  it("shows title input", async () => {
    const { getByPlaceholderText } = render(<WishlistCreateScreen />);
    await waitFor(() => {
      expect(getByPlaceholderText("VD: Giải tích 2")).toBeTruthy();
    });
  });

  it("shows price input", async () => {
    const { getByPlaceholderText } = render(<WishlistCreateScreen />);
    await waitFor(() => {
      expect(getByPlaceholderText("VD: 120000")).toBeTruthy();
    });
  });

  it("shows create button", async () => {
    const { getByText } = render(<WishlistCreateScreen />);
    await waitFor(() => {
      expect(getByText("+ Thêm Wishlist mới")).toBeTruthy();
    });
  });

  it("shows back icon", async () => {
    const { getByTestId } = render(<WishlistCreateScreen />);
    await waitFor(() => {
      expect(getByTestId("icon-back")).toBeTruthy();
    });
  });

  it("shows info banner", async () => {
    const { getByTestId } = render(<WishlistCreateScreen />);
    await waitFor(() => {
      expect(getByTestId("info-banner")).toBeTruthy();
    });
  });

  it("can fill title input", async () => {
    const { getByPlaceholderText } = render(<WishlistCreateScreen />);
    await waitFor(() => {
      const input = getByPlaceholderText("VD: Giải tích 2");
      fireEvent.changeText(input, "My Wishlist");
      expect(input.props.value).toBe("My Wishlist");
    });
  });

  it("handles courses API error gracefully", async () => {
    mockGetCourses.mockRejectedValueOnce(new Error("API Error"));
    const { UNSAFE_root } = render(<WishlistCreateScreen />);
    await waitFor(() => {
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it("shows course selector label", async () => {
    const { getByText } = render(<WishlistCreateScreen />);
    await waitFor(() => {
      expect(getByText("Môn học (không bắt buộc)")).toBeTruthy();
    });
  });

  it("shows title label", async () => {
    const { getByText } = render(<WishlistCreateScreen />);
    await waitFor(() => {
      expect(getByText("Tên sách/tài liệu cần tìm *")).toBeTruthy();
    });
  });

  it("shows page header", async () => {
    const { getByText } = render(<WishlistCreateScreen />);
    await waitFor(() => {
      expect(getByText("Tạo Wishlist")).toBeTruthy();
    });
  });

  it("shows price label", async () => {
    const { getByText } = render(<WishlistCreateScreen />);
    await waitFor(() => {
      expect(getByText("Giá tối đa (không bắt buộc)")).toBeTruthy();
    });
  });

  it("shows course dropdown default text", async () => {
    const { getByText } = render(<WishlistCreateScreen />);
    await waitFor(() => {
      expect(getByText("Chọn môn học")).toBeTruthy();
    });
  });

  it("shows example section", async () => {
    const { getByText } = render(<WishlistCreateScreen />);
    await waitFor(() => {
      expect(getByText("Ví dụ Wishlist:")).toBeTruthy();
    });
  });

  it("enables submit when title is filled", async () => {
    const { getByPlaceholderText, getByText } = render(<WishlistCreateScreen />);
    
    await waitFor(() => {
      const input = getByPlaceholderText("VD: Giải tích 2");
      fireEvent.changeText(input, "Test Book");
    });

    await waitFor(() => {
      const submitButton = getByText("+ Thêm Wishlist mới").parent;
      expect(submitButton).toBeTruthy();
    });
  });

  it("calls API on submit", async () => {
    const { getByPlaceholderText, getByText } = render(<WishlistCreateScreen />);
    
    await waitFor(() => {
      const input = getByPlaceholderText("VD: Giải tích 2");
      fireEvent.changeText(input, "Test Book");
    });

    await act(async () => {
      fireEvent.press(getByText("+ Thêm Wishlist mới"));
    });

    await waitFor(() => {
      expect(mockCreateWishlist).toHaveBeenCalled();
    });
  });
});
