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
    const { getByText } = render(<WishlistEditScreen />);
    await waitFor(() => {
      expect(getByText("Cập nhật Wishlist")).toBeTruthy();
    }, { timeout: 3000 });
  });

  it("shows back icon after loading", async () => {
    const { getByTestId } = render(<WishlistEditScreen />);
    await waitFor(() => {
      expect(getByTestId("icon-back")).toBeTruthy();
    }, { timeout: 3000 });
  });

  it("shows info banner after loading", async () => {
    const { getByTestId } = render(<WishlistEditScreen />);
    await waitFor(() => {
      expect(getByTestId("info-banner")).toBeTruthy();
    }, { timeout: 3000 });
  });

  it("handles courses API error gracefully", async () => {
    mockGetCourses.mockRejectedValueOnce(new Error("API Error"));
    const { UNSAFE_root } = render(<WishlistEditScreen />);
    await waitFor(() => {
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it("shows course selector label after loading", async () => {
    const { getByText } = render(<WishlistEditScreen />);
    await waitFor(() => {
      expect(getByText("Môn học (không bắt buộc)")).toBeTruthy();
    }, { timeout: 3000 });
  });

  it("shows title label after loading", async () => {
    const { getByText } = render(<WishlistEditScreen />);
    await waitFor(() => {
      expect(getByText("Tên sách/tài liệu cần tìm *")).toBeTruthy();
    }, { timeout: 3000 });
  });

  it("shows page header after loading", async () => {
    const { getByText } = render(<WishlistEditScreen />);
    await waitFor(() => {
      expect(getByText("Chỉnh sửa Wishlist")).toBeTruthy();
    }, { timeout: 3000 });
  });

  it("shows price label after loading", async () => {
    const { getByText } = render(<WishlistEditScreen />);
    await waitFor(() => {
      expect(getByText("Giá tối đa (không bắt buộc)")).toBeTruthy();
    }, { timeout: 3000 });
  });

  it("shows example section after loading", async () => {
    const { getByText } = render(<WishlistEditScreen />);
    await waitFor(() => {
      expect(getByText("Ví dụ Wishlist:")).toBeTruthy();
    }, { timeout: 3000 });
  });

  it("populates form with existing data from params", async () => {
    const { getByPlaceholderText } = render(<WishlistEditScreen />);
    await waitFor(() => {
      const titleInput = getByPlaceholderText("VD: Giải tích 2");
      expect(titleInput.props.value).toBe("Test Wishlist");
    }, { timeout: 3000 });
  });

  it("populates price field from params", async () => {
    const { getByPlaceholderText } = render(<WishlistEditScreen />);
    await waitFor(() => {
      const priceInput = getByPlaceholderText("VD: 120000");
      expect(priceInput.props.value).toBe("100000");
    }, { timeout: 3000 });
  });

  it("can edit title", async () => {
    const { getByPlaceholderText } = render(<WishlistEditScreen />);
    
    let input: any;
    await waitFor(() => {
      input = getByPlaceholderText("VD: Giải tích 2");
      expect(input).toBeTruthy();
    }, { timeout: 3000 });

    fireEvent.changeText(input, "Updated Wishlist");
    
    expect(input.props.value).toBe("Updated Wishlist");
  });

  it("can edit price", async () => {
    const { getByPlaceholderText } = render(<WishlistEditScreen />);
    
    let input: any;
    await waitFor(() => {
      input = getByPlaceholderText("VD: 120000");
      expect(input).toBeTruthy();
    }, { timeout: 3000 });

    fireEvent.changeText(input, "50000");
    
    expect(input.props.value).toBe("50000");
  });

  it("calls update API on submit", async () => {
    const { getByText, getByPlaceholderText } = render(<WishlistEditScreen />);
    
    await waitFor(() => {
      const input = getByPlaceholderText("VD: Giải tích 2");
      expect(input.props.value).toBe("Test Wishlist");
    }, { timeout: 3000 });

    await act(async () => {
      fireEvent.press(getByText("Cập nhật Wishlist"));
    });

    await waitFor(() => {
      expect(mockUpdateWishlist).toHaveBeenCalled();
    });
  });

  it("shows success modal after successful update", async () => {
    const { getByText, getByTestId } = render(<WishlistEditScreen />);
    
    await waitFor(() => {
      expect(getByText("Cập nhật Wishlist")).toBeTruthy();
    }, { timeout: 3000 });

    await act(async () => {
      fireEvent.press(getByText("Cập nhật Wishlist"));
    });

    await waitFor(() => {
      expect(getByTestId("success-modal")).toBeTruthy();
      expect(getByText("Cập nhật thành công!")).toBeTruthy();
    });
  });

  it("navigates back when back button pressed", async () => {
    const { getByTestId } = render(<WishlistEditScreen />);
    
    await waitFor(() => {
      expect(getByTestId("icon-back")).toBeTruthy();
    }, { timeout: 3000 });

    fireEvent.press(getByTestId("icon-back"));

    expect(mockRouterBack).toHaveBeenCalled();
  });

  it("navigates back when success modal is closed", async () => {
    const { getByText, getByTestId } = render(<WishlistEditScreen />);
    
    await waitFor(() => {
      expect(getByText("Cập nhật Wishlist")).toBeTruthy();
    }, { timeout: 3000 });

    await act(async () => {
      fireEvent.press(getByText("Cập nhật Wishlist"));
    });

    await waitFor(() => {
      expect(getByTestId("success-modal")).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByTestId("close-modal"));
    });

    expect(mockRouterBack).toHaveBeenCalled();
  });

  it("shows error message on failed submission", async () => {
    mockUpdateWishlist.mockRejectedValueOnce(new Error("Update failed"));
    
    const { getByText } = render(<WishlistEditScreen />);
    
    await waitFor(() => {
      expect(getByText("Cập nhật Wishlist")).toBeTruthy();
    }, { timeout: 3000 });

    await act(async () => {
      fireEvent.press(getByText("Cập nhật Wishlist"));
    });

    await waitFor(() => {
      expect(getByText("Không thể cập nhật wishlist. Vui lòng thử lại.")).toBeTruthy();
    });
  });

  it("selects course from the loaded course list", async () => {
    const { getByText } = render(<WishlistEditScreen />);
    
    await waitFor(() => {
      // Course should be selected from params (course_id: "1" -> Giải tích 1)
      expect(getByText("Giải tích 1")).toBeTruthy();
    }, { timeout: 3000 });
  });

  it("can open course selection modal", async () => {
    const { getByText } = render(<WishlistEditScreen />);
    
    await waitFor(() => {
      expect(getByText("Giải tích 1")).toBeTruthy();
    }, { timeout: 3000 });

    await act(async () => {
      fireEvent.press(getByText("Giải tích 1"));
    });

    await waitFor(() => {
      expect(getByText("Chọn môn học")).toBeTruthy();
      expect(getByText("Đóng")).toBeTruthy();
    });
  });

  it("can clear selected course", async () => {
    const { getByText } = render(<WishlistEditScreen />);
    
    await waitFor(() => {
      expect(getByText("Bỏ chọn môn học")).toBeTruthy();
    }, { timeout: 3000 });

    await act(async () => {
      fireEvent.press(getByText("Bỏ chọn môn học"));
    });

    await waitFor(() => {
      expect(getByText("Chọn môn học")).toBeTruthy();
    });
  });
});
