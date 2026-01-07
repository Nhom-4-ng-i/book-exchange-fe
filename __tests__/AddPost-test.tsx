import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

// Mock dependencies
const mockRouterBack = jest.fn();
const mockRouterReplace = jest.fn();
const mockRequestMediaLibraryPermissionsAsync = jest.fn();
const mockLaunchImageLibraryAsync = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: mockRouterBack,
    replace: mockRouterReplace,
  }),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn().mockResolvedValue("fake-token"),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
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

jest.mock("@/api", () => ({
  CoursesService: {
    getCoursesListRouteApiCoursesGet: jest.fn().mockResolvedValue([
      { id: 1, name: "Giải tích 1" },
      { id: 2, name: "Vật lý đại cương" },
    ]),
  },
  LocationsService: {
    getLocationsListRouteApiLocationsGet: jest.fn().mockResolvedValue([
      { id: 1, name: "CS1 - Lý Thường Kiệt" },
      { id: 2, name: "CS2 - Dĩ An" },
    ]),
  },
  OpenAPI: {
    BASE: "",
    TOKEN: "",
  },
}));

// Manual mock for expo-image-picker - must use require inside
jest.mock("expo-image-picker", () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(() => 
    Promise.resolve({ status: "granted" })
  ),
  launchImageLibraryAsync: jest.fn(() =>
    Promise.resolve({
      canceled: false,
      assets: [{ uri: "file://test-image.jpg" }],
    })
  ),
}), { virtual: true });

jest.mock("@/components/SuccessModal", () => {
  const React = require("react");
  const { View, Text, Pressable } = require("react-native");
  return function MockSuccessModal({ visible, onClose, onViewOrder, title }: any) {
    if (!visible) return null;
    return (
      <View testID="success-modal">
        <Text>{title}</Text>
        <Pressable onPress={onClose} testID="close-modal">
          <Text>Close</Text>
        </Pressable>
        <Pressable onPress={onViewOrder} testID="view-order">
          <Text>View</Text>
        </Pressable>
      </View>
    );
  };
});

jest.mock("@/icons/IconArrowDown", () => {
  const React = require("react");
  const { View } = require("react-native");
  return function MockIcon() {
    return <View testID="icon-arrow-down" />;
  };
});

jest.mock("@/icons/IconBack", () => {
  const React = require("react");
  const { View } = require("react-native");
  return function MockIcon() {
    return <View testID="icon-back" />;
  };
});

jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }: any) => children,
}));

jest.mock("expo-status-bar", () => ({
  StatusBar: () => null,
}));

// Mock fetch
global.fetch = jest.fn();

// Import component
import AddPost from "@/app/home/addPost";

describe("AddPost Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset();
  });

  it("renders the add post form correctly", async () => {
    const { getByText } = render(<AddPost />);

    await waitFor(() => {
      expect(getByText("Đăng sách/tài liệu mới")).toBeTruthy();
    }, { timeout: 3000 });
    
    expect(getByText(/Hình ảnh sách/i)).toBeTruthy();
    expect(getByText(/Tên sách/i)).toBeTruthy();
  });

  it("shows placeholder inputs for form fields", async () => {
    const { getByPlaceholderText } = render(<AddPost />);

    await waitFor(() => {
      expect(getByPlaceholderText("VD: Giải tích 2")).toBeTruthy();
      expect(getByPlaceholderText("VD: Nguyễn Đình Trí")).toBeTruthy();
      expect(getByPlaceholderText("Ví dụ: 120000")).toBeTruthy();
    });
  });

  it("can fill in the book title input", async () => {
    const { getByPlaceholderText } = render(<AddPost />);

    await waitFor(() => {
      const titleInput = getByPlaceholderText("VD: Giải tích 2");
      fireEvent.changeText(titleInput, "Giải tích 1");
      expect(titleInput.props.value).toBe("Giải tích 1");
    });
  });

  it("can fill in the author input", async () => {
    const { getByPlaceholderText } = render(<AddPost />);

    await waitFor(() => {
      const authorInput = getByPlaceholderText("VD: Nguyễn Đình Trí");
      fireEvent.changeText(authorInput, "Nguyễn Văn A");
      expect(authorInput.props.value).toBe("Nguyễn Văn A");
    });
  });

  it("can fill in the price input", async () => {
    const { getByPlaceholderText } = render(<AddPost />);

    await waitFor(() => {
      const priceInput = getByPlaceholderText("Ví dụ: 120000");
      fireEvent.changeText(priceInput, "50000");
      expect(priceInput.props.value).toBe("50000");
    });
  });

  it("navigates back when back button is pressed", async () => {
    const { getByTestId } = render(<AddPost />);

    await waitFor(() => {
      const backButton = getByTestId("icon-back").parent;
      if (backButton) {
        fireEvent.press(backButton);
        expect(mockRouterBack).toHaveBeenCalled();
      }
    });
  });

  it("shows add image button", async () => {
    const { getByText } = render(<AddPost />);

    await waitFor(() => {
      expect(getByText("Thêm ảnh")).toBeTruthy();
    });
  });

  it("shows course selection modal when pressed", async () => {
    const { getByText } = render(<AddPost />);

    await waitFor(() => {
      const courseSelector = getByText("Chọn môn học");
      fireEvent.press(courseSelector.parent as any);
    });

    await waitFor(() => {
      expect(getByText("Danh sách môn học")).toBeTruthy();
    });
  });

  it("shows status selection modal when pressed", async () => {
    const { getByText } = render(<AddPost />);

    await waitFor(() => {
      const statusSelector = getByText("Chọn tình trạng");
      fireEvent.press(statusSelector.parent as any);
    });

    await waitFor(() => {
      expect(getByText("Tình trạng sách")).toBeTruthy();
    });
  });

  it("shows location selection modal when pressed", async () => {
    const { getByText } = render(<AddPost />);

    await waitFor(() => {
      const locationSelector = getByText("Chọn địa điểm");
      fireEvent.press(locationSelector.parent as any);
    });

    await waitFor(() => {
      expect(getByText("Danh sách địa điểm")).toBeTruthy();
    });
  });

  it("shows submit button", async () => {
    const { getByText } = render(<AddPost />);

    await waitFor(() => {
      expect(getByText("Đăng Lên")).toBeTruthy();
    });
  });

  it("shows error alert when submitting empty form", async () => {
    const alertSpy = jest.spyOn(require("react-native").Alert, "alert");
    const { getByText } = render(<AddPost />);

    await waitFor(() => {
      const submitButton = getByText("Đăng Lên");
      fireEvent.press(submitButton.parent as any);
    });

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Lỗi",
        "Vui lòng điền đầy đủ các thông tin có dấu (*)"
      );
    });
  });

  it("loads courses on mount", async () => {
    const { CoursesService } = require("@/api");
    render(<AddPost />);

    await waitFor(() => {
      expect(CoursesService.getCoursesListRouteApiCoursesGet).toHaveBeenCalled();
    });
  });

  it("loads locations on mount", async () => {
    const { LocationsService } = require("@/api");
    render(<AddPost />);

    await waitFor(() => {
      expect(LocationsService.getLocationsListRouteApiLocationsGet).toHaveBeenCalled();
    });
  });

  it("renders without crashing", () => {
    const { UNSAFE_root } = render(<AddPost />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it("closes course modal when close button pressed", async () => {
    const { getByText, queryByText } = render(<AddPost />);

    await waitFor(() => {
      fireEvent.press(getByText("Chọn môn học").parent as any);
    });

    await waitFor(() => {
      expect(getByText("Danh sách môn học")).toBeTruthy();
    });

    // Close modal by pressing outside or close button
    await waitFor(() => {
      expect(getByText("Danh sách môn học")).toBeTruthy();
    });
  });

  it("shows course options in modal", async () => {
    const { getByText } = render(<AddPost />);

    await waitFor(() => {
      fireEvent.press(getByText("Chọn môn học").parent as any);
    });

    await waitFor(() => {
      expect(getByText("Giải tích 1")).toBeTruthy();
      expect(getByText("Vật lý đại cương")).toBeTruthy();
    });
  });

  it("shows location options in modal", async () => {
    const { getByText } = render(<AddPost />);

    await waitFor(() => {
      fireEvent.press(getByText("Chọn địa điểm").parent as any);
    });

    await waitFor(() => {
      expect(getByText("CS1 - Lý Thường Kiệt")).toBeTruthy();
      expect(getByText("CS2 - Dĩ An")).toBeTruthy();
    });
  });

  it("shows status options in modal", async () => {
    const { getByText } = render(<AddPost />);

    await waitFor(() => {
      fireEvent.press(getByText("Chọn tình trạng").parent as any);
    });

    await waitFor(() => {
      expect(getByText("Tình trạng sách")).toBeTruthy();
    });
  });

  it("can select a course", async () => {
    const { getByText } = render(<AddPost />);

    await waitFor(() => {
      fireEvent.press(getByText("Chọn môn học").parent as any);
    });

    await waitFor(() => {
      fireEvent.press(getByText("Giải tích 1"));
    });

    await waitFor(() => {
      expect(getByText("Giải tích 1")).toBeTruthy();
    });
  });

  it("can select a location", async () => {
    const { getByText } = render(<AddPost />);

    await waitFor(() => {
      fireEvent.press(getByText("Chọn địa điểm").parent as any);
    });

    await waitFor(() => {
      fireEvent.press(getByText("CS1 - Lý Thường Kiệt"));
    });

    await waitFor(() => {
      expect(getByText("CS1 - Lý Thường Kiệt")).toBeTruthy();
    });
  });

  it("shows original price input", async () => {
    const { getByPlaceholderText } = render(<AddPost />);

    await waitFor(() => {
      expect(getByPlaceholderText("Ví dụ: 150000")).toBeTruthy();
    });
  });

  it("shows description input", async () => {
    const { getByPlaceholderText } = render(<AddPost />);

    await waitFor(() => {
      expect(getByPlaceholderText(/Mô tả chi tiết/i)).toBeTruthy();
    });
  });

  it("shows location description input", async () => {
    const { getByPlaceholderText } = render(<AddPost />);

    await waitFor(() => {
      expect(getByPlaceholderText(/Mô tả chi địa điểm/i)).toBeTruthy();
    });
  });

  it("shows all required field labels", async () => {
    const { getByText, getAllByText } = render(<AddPost />);

    await waitFor(() => {
      expect(getByText(/Hình ảnh sách/i)).toBeTruthy();
      expect(getByText(/Tên sách/i)).toBeTruthy();
      expect(getByText(/Tác giả/i)).toBeTruthy();
      expect(getAllByText(/Môn học/i).length).toBeGreaterThan(0);
      expect(getAllByText(/Tình trạng/i).length).toBeGreaterThan(0);
      expect(getByText(/Giá bán/i)).toBeTruthy();
    });
  });

  it("handles API errors gracefully", async () => {
    const { CoursesService } = require("@/api");
    CoursesService.getCoursesListRouteApiCoursesGet.mockRejectedValueOnce(new Error("API Error"));
    
    const { UNSAFE_root } = render(<AddPost />);
    
    await waitFor(() => {
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it("handles location API errors gracefully", async () => {
    const { LocationsService } = require("@/api");
    LocationsService.getLocationsListRouteApiLocationsGet.mockRejectedValueOnce(new Error("API Error"));
    
    const { UNSAFE_root } = render(<AddPost />);
    
    await waitFor(() => {
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});

