import { render } from "@testing-library/react-native";
import React from "react";

// Mock dependencies
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  router: {
    push: jest.fn(),
  },
  useFocusEffect: jest.fn(),
}));

jest.mock("@sentry/react-native", () => ({
  captureException: jest.fn(),
}));

jest.mock("@/api", () => ({
  UserService: {
    getMyProfileRouteApiUserMeGet: jest.fn().mockResolvedValue({
      user_id: "1",
      email: "test@test.com",
      name: "Test User",
      role: "user",
      phone: "0123456789",
    }),
  },
  OpenAPI: {
    BASE: "",
    TOKEN: async () => "fake-token",
  },
}));

jest.mock("@/components/profile/ProfileHeader", () => ({
  ProfileHeader: () => {
    const { View } = require("react-native");
    return <View testID="profile-header" />;
  },
}));

jest.mock("@/components/profile/ProfileStat", () => ({
  ProfileStat: () => {
    const { View } = require("react-native");
    return <View testID="profile-stat" />;
  },
}));

jest.mock("@/components/profile/ProfileActionCard", () => ({
  ProfileActionCard: () => {
    const { View } = require("react-native");
    return <View testID="profile-action-card" />;
  },
}));

jest.mock("@/components/BottomNav", () => {
  const React = require("react");
  const { View } = require("react-native");
  return function MockBottomNav() {
    return <View testID="bottom-nav" />;
  };
});

// Import sau khi mock
import ProfileIndexScreen from "@/app/profile/index";

describe("ProfileIndexScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders profile screen correctly", async () => {
    const { UNSAFE_root } = render(<ProfileIndexScreen />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it("renders without crashing", () => {
    const { UNSAFE_root } = render(<ProfileIndexScreen />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it("initializes correctly", async () => {
    const { UNSAFE_root } = render(<ProfileIndexScreen />);
    
    // Component should render
    expect(UNSAFE_root).toBeTruthy();
  });
});

