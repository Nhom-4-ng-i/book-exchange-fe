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
    id: "123",
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

const mockGetCourses = jest.fn();
const mockGetLocations = jest.fn();
const mockGetPostById = jest.fn();
const mockUpdatePost = jest.fn();

jest.mock("@/api", () => ({
  CoursesService: {
    getCoursesListRouteApiCoursesGet: () => mockGetCourses(),
  },
  LocationsService: {
    getLocationsListRouteApiLocationsGet: () => mockGetLocations(),
  },
  PostsService: {
    getPostByIdRouteApiPostsPostIdGet: (...args: any[]) => mockGetPostById(...args),
    updatePostRouteApiPostsPostIdPut: (...args: any[]) => mockUpdatePost(...args),
  },
  OpenAPI: { BASE: "", TOKEN: "" },
}));

jest.mock("expo-image-picker", () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: "granted" })
  ),
  launchImageLibraryAsync: jest.fn(() =>
    Promise.resolve({ canceled: false, assets: [{ uri: "file://test.jpg" }] })
  ),
}), { virtual: true });

jest.mock("@/components/SuccessModal", () => {
  const { View } = require("react-native");
  return function MockSuccessModal() { return <View testID="success-modal" />; };
});

jest.mock("@/icons/IconArrowDown", () => {
  const { View } = require("react-native");
  return function MockIcon() { return <View testID="icon-arrow-down" />; };
});

jest.mock("@/icons/IconBack", () => {
  const { View } = require("react-native");
  return function MockIcon() { return <View testID="icon-back" />; };
});

jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

import EditPostScreen from "@/app/profile/edit-post";

describe("EditPostScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCourses.mockResolvedValue([
      { id: 1, name: "Giải tích 1" },
      { id: 2, name: "Đại số tuyến tính" },
    ]);
    mockGetLocations.mockResolvedValue([
      { id: 1, name: "CS1" },
      { id: 2, name: "CS2" },
    ]);
    mockGetPostById.mockResolvedValue({
      id: 123,
      book_title: "Test Book",
      author: "Test Author",
      course_id: 1,
      book_status_id: 1,
      price: 50000,
      original_price: 60000,
      location_id: 1,
      avatar_url: "http://example.com/image.jpg",
      description: "Test description",
    });
    mockUpdatePost.mockResolvedValue({});
  });

  it("renders without crashing", async () => {
    const { UNSAFE_root } = render(<EditPostScreen />);
    await waitFor(() => {
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it("renders component tree", async () => {
    const { UNSAFE_root } = render(<EditPostScreen />);
    await waitFor(() => {
      expect(UNSAFE_root.children).toBeDefined();
    });
  });

  it("fetches courses on mount", async () => {
    render(<EditPostScreen />);
    await waitFor(() => {
      expect(mockGetCourses).toHaveBeenCalled();
    });
  });

  it("fetches locations on mount", async () => {
    render(<EditPostScreen />);
    await waitFor(() => {
      expect(mockGetLocations).toHaveBeenCalled();
    });
  });

  it("renders with post id param", async () => {
    const { UNSAFE_root } = render(<EditPostScreen />);
    await waitFor(() => {
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it("handles courses API error gracefully", async () => {
    mockGetCourses.mockRejectedValueOnce(new Error("API Error"));
    const { UNSAFE_root } = render(<EditPostScreen />);
    await waitFor(() => {
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it("handles locations API error gracefully", async () => {
    mockGetLocations.mockRejectedValueOnce(new Error("API Error"));
    const { UNSAFE_root } = render(<EditPostScreen />);
    await waitFor(() => {
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it("handles post fetch error gracefully", async () => {
    mockGetPostById.mockRejectedValueOnce(new Error("API Error"));
    const { UNSAFE_root } = render(<EditPostScreen />);
    await waitFor(() => {
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
