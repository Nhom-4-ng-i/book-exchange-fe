import { render, waitFor } from "@testing-library/react-native";
import React from "react";

// Mock dependencies
jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn().mockImplementation((key: string) => {
      if (key === "access_token") return Promise.resolve("fake-token");
      if (key === "user") return Promise.resolve(JSON.stringify({ id: 1, name: "Test User" }));
      return Promise.resolve(null);
    }),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

const mockRouterPush = jest.fn();
const mockRouterReplace = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockRouterPush,
    replace: mockRouterReplace,
    back: jest.fn(),
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

const mockGetProfile = jest.fn();
const mockGetMyPosts = jest.fn();
const mockGetMySales = jest.fn();

jest.mock("@/api", () => ({
  UserService: {
    getMyProfileRouteApiUserMeGet: () => mockGetProfile(),
    getMyPostsRouteApiUserPostsGet: () => mockGetMyPosts(),
    getMySalesRouteApiUserSalesGet: () => mockGetMySales(),
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
  const { View, Text } = require("react-native");
  return function MockHeaderHome({ title }: any) {
    return (
      <View testID="header">
        <Text>{title}</Text>
      </View>
    );
  };
});

jest.mock("@/components/profile/ProfileHeader", () => ({
  ProfileHeader: ({ name, phone }: any) => {
    const { View, Text } = require("react-native");
    return (
      <View testID="profile-header">
        <Text testID="profile-name">{name}</Text>
        <Text testID="profile-phone">{phone}</Text>
      </View>
    );
  },
}));

jest.mock("@/components/profile/ProfileStat", () => ({
  ProfileStat: ({ label, value }: any) => {
    const { View, Text } = require("react-native");
    return (
      <View testID="profile-stat">
        <Text>{label}</Text>
        <Text>{value}</Text>
      </View>
    );
  },
}));

jest.mock("@/components/profile/ProfileActionCard", () => ({
  ProfileActionCard: ({ title, count }: any) => {
    const { View, Text } = require("react-native");
    return (
      <View testID="action-card">
        <Text>{title}</Text>
        {count !== undefined && <Text>{count}</Text>}
      </View>
    );
  },
}));

jest.mock("@/icons/IconHeart", () => {
  const { View } = require("react-native");
  return function MockIcon() {
    return <View testID="icon-heart" />;
  };
});

jest.mock("@/icons/IconPost", () => {
  const { View } = require("react-native");
  return function MockIcon() {
    return <View testID="icon-post" />;
  };
});

jest.mock("@/icons/IconUser", () => {
  const { View } = require("react-native");
  return function MockIcon() {
    return <View testID="icon-user" />;
  };
});

jest.mock("expo-status-bar", () => ({
  StatusBar: () => null,
}));

// Import component
import ProfileScreen from "@/app/profile/index";

describe("ProfileScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    const AsyncStorage = require("@react-native-async-storage/async-storage").default;
    AsyncStorage.getItem.mockImplementation((key: string) => {
      if (key === "access_token") return Promise.resolve("fake-token");
      if (key === "user") return Promise.resolve(JSON.stringify({ id: 1, name: "Test User" }));
      return Promise.resolve(null);
    });

    mockGetProfile.mockResolvedValue({
      user_id: "1",
      name: "Test User",
      email: "test@test.com",
      phone: "0123456789",
      count_posts: 5,
      count_sold_orders: 3,
      count_completed_orders: 2,
    });
    mockGetMyPosts.mockResolvedValue([
      { id: 1, post_status: "Đang bán" },
      { id: 2, post_status: "Đã bán" },
    ]);
    mockGetMySales.mockResolvedValue({
      pending: [{ order_id: 1 }],
      accepted: [],
      completed: [],
      rejected: [],
    });
  });

  it("renders profile screen correctly", async () => {
    const { UNSAFE_root } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it("calls APIs on mount", async () => {
    render(<ProfileScreen />);

    await waitFor(() => {
      expect(mockGetProfile).toHaveBeenCalled();
    });
  });

  it("handles API error gracefully", async () => {
    mockGetProfile.mockRejectedValueOnce(new Error("API Error"));
    const { UNSAFE_root } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it("redirects to login when no user data", async () => {
    const AsyncStorage = require("@react-native-async-storage/async-storage").default;
    AsyncStorage.getItem.mockImplementation((key: string) => {
      if (key === "access_token") return Promise.resolve("fake-token");
      if (key === "user") return Promise.resolve(null);
      return Promise.resolve(null);
    });

    render(<ProfileScreen />);

    await waitFor(() => {
      expect(mockRouterReplace).toHaveBeenCalledWith("/auth/login");
    });
  });

  it("renders without crashing", async () => {
    const { UNSAFE_root } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it("renders component tree", async () => {
    const { UNSAFE_root } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(UNSAFE_root.children).toBeDefined();
    });
  });
});
