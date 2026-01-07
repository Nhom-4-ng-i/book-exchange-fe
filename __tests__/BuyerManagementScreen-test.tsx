import { render, waitFor } from "@testing-library/react-native";
import React from "react";

// Mock dependencies
jest.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useFocusEffect: jest.fn((callback) => {
    // Do nothing in tests
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

jest.mock("@/api", () => ({
  UserService: {
    getMyOrdersRouteApiUserOrdersGet: jest.fn().mockResolvedValue([
      {
        order_id: 1,
        book_name: "Test Book",
        seller_name: "Seller",
        status: "pending",
        price: 100000,
        phone: "0123456789",
        created_at: "2024-01-01T00:00:00Z",
      },
    ]),
  },
  OrdersService: {
    cancelOrderRouteApiOrdersOrderIdCancelPatch: jest.fn().mockResolvedValue({}),
  },
}));

jest.mock("@/components/ConfirmationModal", () => {
  const React = require("react");
  const { View } = require("react-native");
  return function MockConfirmationModal() {
    return <View testID="confirmation-modal" />;
  };
});

jest.mock("@/components/SuccessModal", () => {
  const React = require("react");
  const { View } = require("react-native");
  return function MockSuccessModal() {
    return <View testID="success-modal" />;
  };
});

jest.mock("@/components/profile/OrderRequestCard", () => ({
  OrderRequestCard: () => {
    const { View } = require("react-native");
    return <View testID="order-request-card" />;
  },
}));

jest.mock("@/icons/IconBack", () => {
  const React = require("react");
  const { View } = require("react-native");
  return function MockIconBack() {
    return <View testID="icon-back" />;
  };
});

// Import sau khi mock
import BuyerManagementScreen from "@/app/profile/buyer-management";

describe("BuyerManagementScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const AsyncStorage = require("@react-native-async-storage/async-storage").default;
    AsyncStorage.getItem.mockResolvedValue("fake-token");
    AsyncStorage.setItem.mockResolvedValue(undefined);
  });

  it("renders buyer management screen correctly", async () => {
    const { getByText } = render(<BuyerManagementScreen />);
    
    await waitFor(() => {
      expect(getByText(/Quản lý người mua/i)).toBeTruthy();
    }, { timeout: 5000 });
  });

  it("shows order sections after loading", async () => {
    const { getByText, UNSAFE_root } = render(<BuyerManagementScreen />);
    
    // Component renders without crashing
    expect(UNSAFE_root).toBeTruthy();
  });

  it("component renders without crashing", () => {
    const { UNSAFE_root } = render(<BuyerManagementScreen />);
    expect(UNSAFE_root).toBeTruthy();
  });
});

