import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

// Mock dependencies
const mockGetItem = jest.fn();
jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: (...args: any[]) => mockGetItem(...args),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

const mockRouterBack = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: mockRouterBack,
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

const mockGetMySales = jest.fn();
const mockAcceptOrder = jest.fn();
const mockRejectOrder = jest.fn();
const mockCompleteOrder = jest.fn();

jest.mock("@/api", () => ({
  UserService: {
    getMySalesRouteApiUserSalesGet: () => mockGetMySales(),
  },
  OrdersService: {
    acceptOrderRouteApiOrdersOrderIdAcceptPost: (...args: any[]) => mockAcceptOrder(...args),
    rejectOrderRouteApiOrdersOrderIdRejectPost: (...args: any[]) => mockRejectOrder(...args),
    completeOrderRouteApiOrdersOrderIdCompletePost: (...args: any[]) => mockCompleteOrder(...args),
  },
  OpenAPI: { BASE: "", TOKEN: "" },
}));

jest.mock("@/components/ConfirmationModal", () => {
  const { View, Text, Pressable } = require("react-native");
  return function MockConfirmationModal({ visible, title, message, onConfirm, onClose, confirmText, cancelText }: any) {
    if (!visible) return null;
    return (
      <View testID="confirmation-modal">
        <Text>{title}</Text>
        <Text>{message}</Text>
        <Pressable testID="confirm-btn" onPress={onConfirm}><Text>{confirmText}</Text></Pressable>
        <Pressable testID="cancel-btn" onPress={onClose}><Text>{cancelText}</Text></Pressable>
      </View>
    );
  };
});

jest.mock("@/components/profile/OrderRequestCard", () => ({
  OrderRequestCard: ({ bookTitle, status, onAccept, onReject, onChat, onMarkSold }: any) => {
    const { View, Text, Pressable } = require("react-native");
    return (
      <View testID={`order-card-${status}`}>
        <Text>{bookTitle}</Text>
        <Text>{status}</Text>
        {onAccept && <Pressable testID="accept-btn" onPress={onAccept}><Text>Accept</Text></Pressable>}
        {onReject && <Pressable testID="reject-btn" onPress={onReject}><Text>Reject</Text></Pressable>}
        {onChat && <Pressable testID="chat-btn" onPress={onChat}><Text>Chat</Text></Pressable>}
        {onMarkSold && <Pressable testID="mark-sold-btn" onPress={onMarkSold}><Text>Mark Sold</Text></Pressable>}
      </View>
    );
  },
}));

jest.mock("@/icons/IconBack", () => {
  const { View } = require("react-native");
  return function MockIconBack() {
    return <View testID="icon-back" />;
  };
});

jest.mock("expo-image", () => ({
  Image: () => null,
}));

// Import component
import BuyerManagementScreen from "@/app/profile/buyer-management";

describe("BuyerManagementScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue("fake-token");
    mockGetMySales.mockResolvedValue({
      pending: [],
      accepted: [],
      completed: [],
      rejected: [],
    });
    mockAcceptOrder.mockResolvedValue({});
    mockRejectOrder.mockResolvedValue({});
    mockCompleteOrder.mockResolvedValue({});
  });

  it("renders buyer management screen correctly", async () => {
    const { getByText } = render(<BuyerManagementScreen />);
    await waitFor(() => {
      expect(getByText(/Quản lý người mua/i)).toBeTruthy();
    });
  });

  it("component renders without crashing", async () => {
    const { UNSAFE_root } = render(<BuyerManagementScreen />);
    await waitFor(() => {
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it("calls API on mount", async () => {
    render(<BuyerManagementScreen />);
    await waitFor(() => {
      expect(mockGetMySales).toHaveBeenCalled();
    });
  });

  it("shows loading indicator initially", async () => {
    mockGetMySales.mockReturnValue(new Promise(() => {})); // Never resolve
    const { UNSAFE_root } = render(<BuyerManagementScreen />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it("handles API error gracefully", async () => {
    mockGetMySales.mockRejectedValueOnce(new Error("API Error"));
    const { getByText } = render(<BuyerManagementScreen />);
    await waitFor(() => {
      expect(getByText(/Không thể tải danh sách yêu cầu/i)).toBeTruthy();
    });
  });

  it("shows back icon", async () => {
    const { getByTestId } = render(<BuyerManagementScreen />);
    await waitFor(() => {
      expect(getByTestId("icon-back")).toBeTruthy();
    });
  });

  it("handles back navigation", async () => {
    const { getByTestId } = render(<BuyerManagementScreen />);
    await waitFor(() => {
      fireEvent.press(getByTestId("icon-back").parent!);
    });
    expect(mockRouterBack).toHaveBeenCalled();
  });

  it("shows empty state messages when no orders", async () => {
    const { getByText } = render(<BuyerManagementScreen />);
    await waitFor(() => {
      expect(getByText("Không có yêu cầu mới")).toBeTruthy();
      expect(getByText("Không có yêu cầu đã chấp nhận")).toBeTruthy();
      expect(getByText("Không có yêu cầu bị từ chối")).toBeTruthy();
      expect(getByText("Không có yêu cầu đã hoàn thành")).toBeTruthy();
    });
  });

  it("displays pending orders", async () => {
    mockGetMySales.mockResolvedValueOnce({
      pending: [
        { order_id: 1, title: "Sách Toán", price: 100000, buyer_name: "Nguyen", buyer_phone: "0123456789", order_time: "2024-01-15" },
      ],
      accepted: [],
      completed: [],
      rejected: [],
    });

    const { getByText, getByTestId } = render(<BuyerManagementScreen />);
    await waitFor(() => {
      expect(getByText("Sách Toán")).toBeTruthy();
      expect(getByTestId("order-card-pending")).toBeTruthy();
    });
  });

  it("displays accepted orders", async () => {
    mockGetMySales.mockResolvedValueOnce({
      pending: [],
      accepted: [
        { order_id: 2, title: "Sách Văn", price: 50000, buyer_name: "Tran", buyer_phone: "0987654321", order_time: "2024-01-16" },
      ],
      completed: [],
      rejected: [],
    });

    const { getByText, getByTestId } = render(<BuyerManagementScreen />);
    await waitFor(() => {
      expect(getByText("Sách Văn")).toBeTruthy();
      expect(getByTestId("order-card-accepted")).toBeTruthy();
    });
  });

  it("displays completed orders", async () => {
    mockGetMySales.mockResolvedValueOnce({
      pending: [],
      accepted: [],
      completed: [
        { order_id: 3, title: "Sách Lý", price: 80000, buyer_name: "Le", buyer_phone: "0111222333", order_time: "2024-01-17" },
      ],
      rejected: [],
    });

    const { getByText, getByTestId } = render(<BuyerManagementScreen />);
    await waitFor(() => {
      expect(getByText("Sách Lý")).toBeTruthy();
      expect(getByTestId("order-card-completed")).toBeTruthy();
    });
  });

  it("displays rejected orders", async () => {
    mockGetMySales.mockResolvedValueOnce({
      pending: [],
      accepted: [],
      completed: [],
      rejected: [
        { order_id: 4, title: "Sách Hóa", price: 60000, buyer_name: "Pham", buyer_phone: "0222333444", order_time: "2024-01-18" },
      ],
    });

    const { getByText, getByTestId } = render(<BuyerManagementScreen />);
    await waitFor(() => {
      expect(getByText("Sách Hóa")).toBeTruthy();
      expect(getByTestId("order-card-rejected")).toBeTruthy();
    });
  });

  it("shows confirmation modal when accepting order", async () => {
    mockGetMySales.mockResolvedValueOnce({
      pending: [
        { order_id: 1, title: "Sách Toán", price: 100000, buyer_name: "Nguyen", buyer_phone: "0123456789", order_time: "2024-01-15" },
      ],
      accepted: [],
      completed: [],
      rejected: [],
    });

    const { getByTestId, queryByTestId } = render(<BuyerManagementScreen />);
    
    await waitFor(() => {
      expect(getByTestId("accept-btn")).toBeTruthy();
    });

    expect(queryByTestId("confirmation-modal")).toBeNull();

    await act(async () => {
      fireEvent.press(getByTestId("accept-btn"));
    });

    await waitFor(() => {
      expect(getByTestId("confirmation-modal")).toBeTruthy();
    });
  });

  it("shows confirmation modal when rejecting order", async () => {
    mockGetMySales.mockResolvedValueOnce({
      pending: [
        { order_id: 1, title: "Sách Toán", price: 100000, buyer_name: "Nguyen", buyer_phone: "0123456789", order_time: "2024-01-15" },
      ],
      accepted: [],
      completed: [],
      rejected: [],
    });

    const { getByTestId } = render(<BuyerManagementScreen />);
    
    await waitFor(() => {
      expect(getByTestId("reject-btn")).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByTestId("reject-btn"));
    });

    await waitFor(() => {
      expect(getByTestId("confirmation-modal")).toBeTruthy();
    });
  });

  it("calls accept order API when confirmed", async () => {
    mockGetMySales.mockResolvedValue({
      pending: [
        { order_id: 1, title: "Sách Toán", price: 100000, buyer_name: "Nguyen", buyer_phone: "0123456789", order_time: "2024-01-15" },
      ],
      accepted: [],
      completed: [],
      rejected: [],
    });

    const { getByTestId } = render(<BuyerManagementScreen />);
    
    await waitFor(() => {
      expect(getByTestId("accept-btn")).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByTestId("accept-btn"));
    });

    await waitFor(() => {
      expect(getByTestId("confirmation-modal")).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByTestId("confirm-btn"));
    });

    await waitFor(() => {
      expect(mockAcceptOrder).toHaveBeenCalledWith(1);
    });
  });

  it("calls reject order API when confirmed", async () => {
    mockGetMySales.mockResolvedValue({
      pending: [
        { order_id: 1, title: "Sách Toán", price: 100000, buyer_name: "Nguyen", buyer_phone: "0123456789", order_time: "2024-01-15" },
      ],
      accepted: [],
      completed: [],
      rejected: [],
    });

    const { getByTestId } = render(<BuyerManagementScreen />);
    
    await waitFor(() => {
      expect(getByTestId("reject-btn")).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByTestId("reject-btn"));
    });

    await act(async () => {
      fireEvent.press(getByTestId("confirm-btn"));
    });

    await waitFor(() => {
      expect(mockRejectOrder).toHaveBeenCalledWith(1);
    });
  });

  it("calls complete order API when marking as sold", async () => {
    mockGetMySales.mockResolvedValue({
      pending: [],
      accepted: [
        { order_id: 2, title: "Sách Văn", price: 50000, buyer_name: "Tran", buyer_phone: "0987654321", order_time: "2024-01-16" },
      ],
      completed: [],
      rejected: [],
    });

    const { getByTestId } = render(<BuyerManagementScreen />);
    
    await waitFor(() => {
      expect(getByTestId("mark-sold-btn")).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByTestId("mark-sold-btn"));
    });

    await act(async () => {
      fireEvent.press(getByTestId("confirm-btn"));
    });

    await waitFor(() => {
      expect(mockCompleteOrder).toHaveBeenCalledWith(2);
    });
  });

  it("cancels confirmation modal", async () => {
    mockGetMySales.mockResolvedValue({
      pending: [
        { order_id: 1, title: "Sách Toán", price: 100000, buyer_name: "Nguyen", buyer_phone: "0123456789", order_time: "2024-01-15" },
      ],
      accepted: [],
      completed: [],
      rejected: [],
    });

    const { getByTestId, queryByTestId } = render(<BuyerManagementScreen />);
    
    await waitFor(() => {
      expect(getByTestId("accept-btn")).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByTestId("accept-btn"));
    });

    await waitFor(() => {
      expect(getByTestId("confirmation-modal")).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByTestId("cancel-btn"));
    });

    await waitFor(() => {
      expect(queryByTestId("confirmation-modal")).toBeNull();
    });
  });

  it("handles missing token error", async () => {
    mockGetItem.mockResolvedValueOnce(null);
    
    const { UNSAFE_root } = render(<BuyerManagementScreen />);
    await waitFor(() => {
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it("shows section headers with counts", async () => {
    mockGetMySales.mockResolvedValueOnce({
      pending: [
        { order_id: 1, title: "Sách 1", price: 100000, buyer_name: "A", buyer_phone: "0123", order_time: "2024-01-15" },
        { order_id: 2, title: "Sách 2", price: 100000, buyer_name: "B", buyer_phone: "0456", order_time: "2024-01-16" },
      ],
      accepted: [
        { order_id: 3, title: "Sách 3", price: 50000, buyer_name: "C", buyer_phone: "0789", order_time: "2024-01-17" },
      ],
      completed: [],
      rejected: [],
    });

    const { getByText } = render(<BuyerManagementScreen />);
    await waitFor(() => {
      expect(getByText("Yêu cầu mới (2)")).toBeTruthy();
      expect(getByText("Đã chấp nhận (1)")).toBeTruthy();
    });
  });

  it("shows description texts", async () => {
    const { getByText } = render(<BuyerManagementScreen />);
    await waitFor(() => {
      expect(getByText(/Có người muốn mua sách/)).toBeTruthy();
      expect(getByText(/Sách đang chờ giao dịch/)).toBeTruthy();
    });
  });

  it("handles null response gracefully", async () => {
    mockGetMySales.mockResolvedValueOnce(null);
    
    const { getByText } = render(<BuyerManagementScreen />);
    await waitFor(() => {
      expect(getByText("Không có yêu cầu mới")).toBeTruthy();
    });
  });

  it("handles default avatar URL", async () => {
    mockGetMySales.mockResolvedValueOnce({
      pending: [
        { order_id: 1, title: "Sách Toán", price: 100000, buyer_name: "Nguyen", buyer_phone: "0123456789", order_time: "2024-01-15", avatar_url: "DefaultAvatarURL" },
      ],
      accepted: [],
      completed: [],
      rejected: [],
    });

    const { getByText } = render(<BuyerManagementScreen />);
    await waitFor(() => {
      expect(getByText("Sách Toán")).toBeTruthy();
    });
  });
});
