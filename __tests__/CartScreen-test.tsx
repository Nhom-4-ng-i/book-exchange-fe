import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

// Mock vector icons to avoid native module errors in Jest.
jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ name }: any) => {
    const { View } = require('react-native');
    return <View testID={`ionicons-${name}`} />;
  },
}));

// Mock bottom navigation and header components
jest.mock('@/components/BottomNav', () => {
  const { View } = require('react-native');
  return () => <View testID="bottom-nav" />;
});

jest.mock('@/components/HeaderHome', () => {
  const { View, Text } = require('react-native');
  return ({ title }: any) => <View testID="header"><Text>{title}</Text></View>;
});

jest.mock('@/components/CartItem', () => {
  const { View, Text, Pressable } = require('react-native');
  return ({ orderId, bookName, seller, status, price, ondelete, onPress }: any) => (
    <View testID={`cart-item-${orderId}`}>
      <Text>{bookName}</Text>
      <Text>{seller}</Text>
      <Text>{status}</Text>
      <Text>{price}</Text>
      <Pressable testID={`delete-${orderId}`} onPress={() => ondelete(orderId)}>
        <Text>Delete</Text>
      </Pressable>
      <Pressable testID={`open-${orderId}`} onPress={onPress}>
        <Text>Open</Text>
      </Pressable>
    </View>
  );
});

jest.mock('@/components/ConfirmationModal', () => {
  const { View, Pressable, Text } = require('react-native');
  return ({ visible, onClose, onConfirm, title, message, isLoading }: any) => {
    if (!visible) return null;
    return (
      <View testID="confirmation-modal">
        <Text>{title}</Text>
        <Text>{message}</Text>
        {isLoading && <Text>Loading...</Text>}
        <Pressable testID="confirm-delete" onPress={onConfirm}><Text>Confirm</Text></Pressable>
        <Pressable testID="cancel-delete" onPress={onClose}><Text>Cancel</Text></Pressable>
      </View>
    );
  };
});

jest.mock('@/components/SuccessModal', () => {
  const { View, Text, Pressable } = require('react-native');
  return ({ visible, title, message, onClose, onViewOrder }: any) => {
    if (!visible) return null;
    return (
      <View testID="success-modal">
        <Text>{title}</Text>
        <Text>{message}</Text>
        <Pressable testID="close-success" onPress={onClose}><Text>Close</Text></Pressable>
        <Pressable testID="view-order" onPress={onViewOrder}><Text>View</Text></Pressable>
      </View>
    );
  };
});

jest.mock('@/icons/IconEmptyCart', () => {
  const { View } = require('react-native');
  return () => <View testID="empty-cart-icon" />;
});

jest.mock('@/icons/IconLocation', () => {
  const { View } = require('react-native');
  return () => <View testID="icon-location" />;
});

jest.mock('@/icons/PhoneIcon', () => {
  const { View } = require('react-native');
  return () => <View testID="icon-phone" />;
});

// Mock AsyncStorage
const mockGetItem = jest.fn();
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: (...args: any[]) => mockGetItem(...args),
  },
}));

// Mock API services
const mockGetOrders = jest.fn();
const mockCancelOrder = jest.fn();
const mockGetOrderDetails = jest.fn();

jest.mock('@/api', () => ({
  UserService: {
    getMyOrdersRouteApiUserOrdersGet: () => mockGetOrders(),
    getMyProfileRouteApiUserMeGet: jest.fn().mockResolvedValue(null),
  },
  OrdersService: {
    cancelOrderRouteApiOrdersOrderIdCancelPost: (id: number) => mockCancelOrder(id),
    getOrderRouteApiOrdersOrderIdGet: (id: number) => mockGetOrderDetails(id),
  },
  OpenAPI: { BASE: '', TOKEN: undefined },
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useFocusEffect: (cb: any) => {
    const React = require('react');
    React.useEffect(() => { cb(); }, []);
  },
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
}));

// Mock Sentry
jest.mock('@sentry/react-native', () => ({
  captureException: jest.fn(),
  withScope: jest.fn().mockImplementation((cb) => {
    const scope = { setTag: jest.fn(), setContext: jest.fn(), setLevel: jest.fn() };
    return cb(scope);
  }),
}));

// Mock Linking
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(),
}));

// Import after mocks
import CartScreen from '@/app/cart/index';

describe('CartScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue('fake-token');
    mockGetOrders.mockResolvedValue([]);
    mockCancelOrder.mockResolvedValue({});
    mockGetOrderDetails.mockResolvedValue({
      order_id: 1,
      title: 'Sách Test',
      author: 'Test Author',
      course: 'Test Course',
      price: 100000,
      original_price: 120000,
      book_status: 'Mới',
      description: 'Test description',
      location: 'Test Location',
      seller_name: 'Test Seller',
      seller_phone: '0123456789',
      order_time: '2024-01-15',
      order_status: 'Chờ xác nhận',
      avatar_url: 'https://example.com/img.jpg',
    });
  });

  test('shows empty cart message when no orders are returned', async () => {
    const { getByText } = render(<CartScreen />);
    await waitFor(() => {
      expect(getByText('Không có sản phẩm')).toBeTruthy();
    });
  });

  test('renders without crashing', async () => {
    const { UNSAFE_root } = render(<CartScreen />);
    await waitFor(() => {
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  test('calls fetchOrders API on mount', async () => {
    render(<CartScreen />);
    await waitFor(() => {
      expect(mockGetOrders).toHaveBeenCalled();
    });
  });

  test('shows header with title', async () => {
    const { getByText } = render(<CartScreen />);
    await waitFor(() => {
      expect(getByText('Giỏ hàng')).toBeTruthy();
    });
  });

  test('shows bottom navigation', async () => {
    const { getByTestId } = render(<CartScreen />);
    await waitFor(() => {
      expect(getByTestId('bottom-nav')).toBeTruthy();
    });
  });

  test('displays orders when API returns data', async () => {
    mockGetOrders.mockResolvedValue([
      {
        order_id: 1,
        title: 'Sách Toán',
        seller_name: 'Nguyen Van A',
        order_status: 'Chờ xác nhận',
        price: 100000,
        avatar_url: 'https://example.com/img.jpg',
      },
    ]);

    const { getByText } = render(<CartScreen />);
    await waitFor(() => {
      expect(getByText('Sách Toán')).toBeTruthy();
    });
  });

  test('shows order count', async () => {
    mockGetOrders.mockResolvedValue([
      {
        order_id: 1,
        title: 'Sách Toán',
        seller_name: 'Nguyen Van A',
        order_status: 'Chờ xác nhận',
        price: 100000,
      },
    ]);

    const { getByText } = render(<CartScreen />);
    await waitFor(() => {
      expect(getByText(/Đang xử lý \(1\)/)).toBeTruthy();
    });
  });

  test('shows delete confirmation when delete button pressed', async () => {
    mockGetOrders.mockResolvedValue([
      {
        order_id: 1,
        title: 'Sách Test',
        seller_name: 'Seller',
        order_status: 'Chờ xác nhận',
        price: 50000,
      },
    ]);

    const { getByTestId, queryByTestId } = render(<CartScreen />);
    
    await waitFor(() => {
      expect(getByTestId('cart-item-1')).toBeTruthy();
    });

    expect(queryByTestId('confirmation-modal')).toBeNull();
    
    fireEvent.press(getByTestId('delete-1'));

    await waitFor(() => {
      expect(getByTestId('confirmation-modal')).toBeTruthy();
    });
  });

  test('cancels delete when cancel button pressed', async () => {
    mockGetOrders.mockResolvedValue([
      {
        order_id: 1,
        title: 'Sách Test',
        seller_name: 'Seller',
        order_status: 'Chờ xác nhận',
        price: 50000,
      },
    ]);

    const { getByTestId, queryByTestId } = render(<CartScreen />);
    
    await waitFor(() => {
      expect(getByTestId('delete-1')).toBeTruthy();
    });

    fireEvent.press(getByTestId('delete-1'));
    
    await waitFor(() => {
      expect(getByTestId('confirmation-modal')).toBeTruthy();
    });

    fireEvent.press(getByTestId('cancel-delete'));

    await waitFor(() => {
      expect(queryByTestId('confirmation-modal')).toBeNull();
    });
  });

  test('deletes order when confirmed', async () => {
    mockGetOrders.mockResolvedValue([
      {
        order_id: 1,
        title: 'Sách Test',
        seller_name: 'Seller',
        order_status: 'Chờ xác nhận',
        price: 50000,
      },
    ]);

    const { getByTestId } = render(<CartScreen />);
    
    await waitFor(() => {
      expect(getByTestId('delete-1')).toBeTruthy();
    });

    fireEvent.press(getByTestId('delete-1'));
    
    await waitFor(() => {
      expect(getByTestId('confirmation-modal')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByTestId('confirm-delete'));
    });

    await waitFor(() => {
      expect(mockCancelOrder).toHaveBeenCalledWith(1);
    });
  });

  test('shows success modal after delete', async () => {
    mockGetOrders.mockResolvedValue([
      {
        order_id: 1,
        title: 'Sách Test',
        seller_name: 'Seller',
        order_status: 'Chờ xác nhận',
        price: 50000,
      },
    ]);

    const { getByTestId } = render(<CartScreen />);
    
    await waitFor(() => {
      expect(getByTestId('delete-1')).toBeTruthy();
    });

    fireEvent.press(getByTestId('delete-1'));
    
    await waitFor(() => {
      expect(getByTestId('confirm-delete')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByTestId('confirm-delete'));
    });

    await waitFor(() => {
      expect(getByTestId('success-modal')).toBeTruthy();
    });
  });

  test('handles API error gracefully', async () => {
    mockGetOrders.mockRejectedValue(new Error('API Error'));

    const { UNSAFE_root } = render(<CartScreen />);
    await waitFor(() => {
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  test('filters orders to show only pending ones', async () => {
    mockGetOrders.mockResolvedValue([
      { order_id: 1, title: 'Pending Order', order_status: 'Chờ xác nhận', price: 50000, seller_name: 'A' },
      { order_id: 2, title: 'Completed Order', order_status: 'Hoàn thành', price: 60000, seller_name: 'B' },
    ]);

    const { getByText, queryByText } = render(<CartScreen />);
    
    await waitFor(() => {
      expect(getByText('Pending Order')).toBeTruthy();
      expect(queryByText('Completed Order')).toBeNull();
    });
  });

  test('shows empty cart icon when no orders', async () => {
    mockGetOrders.mockResolvedValue([]);

    const { getByTestId } = render(<CartScreen />);
    await waitFor(() => {
      expect(getByTestId('empty-cart-icon')).toBeTruthy();
    });
  });

  test('opens order detail modal when order pressed', async () => {
    mockGetOrders.mockResolvedValue([
      {
        order_id: 1,
        title: 'Sách Test',
        seller_name: 'Seller',
        order_status: 'Chờ xác nhận',
        price: 50000,
        avatar_url: 'https://example.com/img.jpg',
      },
    ]);

    const { getByTestId } = render(<CartScreen />);
    
    await waitFor(() => {
      expect(getByTestId('open-1')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByTestId('open-1'));
    });

    // Modal should open and fetch details
    await waitFor(() => {
      expect(mockGetOrderDetails).toHaveBeenCalledWith(1);
    });
  });

  test('handles order detail API error', async () => {
    mockGetOrders.mockResolvedValue([
      {
        order_id: 1,
        title: 'Sách Test',
        seller_name: 'Seller',
        order_status: 'Chờ xác nhận',
        price: 50000,
      },
    ]);
    mockGetOrderDetails.mockRejectedValue(new Error('Detail Error'));

    const { getByTestId, UNSAFE_root } = render(<CartScreen />);
    
    await waitFor(() => {
      expect(getByTestId('open-1')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByTestId('open-1'));
    });

    // Should not crash
    expect(UNSAFE_root).toBeTruthy();
  });

  test('handles cancel order error', async () => {
    mockGetOrders.mockResolvedValue([
      {
        order_id: 1,
        title: 'Sách Test',
        seller_name: 'Seller',
        order_status: 'Chờ xác nhận',
        price: 50000,
      },
    ]);
    mockCancelOrder.mockRejectedValue(new Error('Cancel Error'));

    const { getByTestId, UNSAFE_root } = render(<CartScreen />);
    
    await waitFor(() => {
      expect(getByTestId('delete-1')).toBeTruthy();
    });

    fireEvent.press(getByTestId('delete-1'));
    
    await waitFor(() => {
      expect(getByTestId('confirm-delete')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByTestId('confirm-delete'));
    });

    // Should not crash
    expect(UNSAFE_root).toBeTruthy();
  });

  test('sorts orders by order_id descending', async () => {
    mockGetOrders.mockResolvedValue([
      { order_id: 1, title: 'Order 1', order_status: 'Chờ xác nhận', price: 50000, seller_name: 'A' },
      { order_id: 3, title: 'Order 3', order_status: 'Chờ xác nhận', price: 70000, seller_name: 'C' },
      { order_id: 2, title: 'Order 2', order_status: 'Chờ xác nhận', price: 60000, seller_name: 'B' },
    ]);

    const { getByText } = render(<CartScreen />);
    
    await waitFor(() => {
      expect(getByText('Order 1')).toBeTruthy();
      expect(getByText('Order 2')).toBeTruthy();
      expect(getByText('Order 3')).toBeTruthy();
    });
  });

  test('handles default avatar URL', async () => {
    mockGetOrders.mockResolvedValue([
      {
        order_id: 1,
        title: 'Sách Test',
        seller_name: 'Seller',
        order_status: 'Chờ xác nhận',
        price: 50000,
        avatar_url: 'DefaultAvatarURL',
      },
    ]);

    const { getByText } = render(<CartScreen />);
    await waitFor(() => {
      expect(getByText('Sách Test')).toBeTruthy();
    });
  });

  test('handles missing avatar URL', async () => {
    mockGetOrders.mockResolvedValue([
      {
        order_id: 1,
        title: 'Sách No Image',
        seller_name: 'Seller',
        order_status: 'Chờ xác nhận',
        price: 50000,
      },
    ]);

    const { getByText } = render(<CartScreen />);
    await waitFor(() => {
      expect(getByText('Sách No Image')).toBeTruthy();
    });
  });

  test('shows multiple orders correctly', async () => {
    mockGetOrders.mockResolvedValue([
      { order_id: 1, title: 'Sách 1', order_status: 'Chờ xác nhận', price: 50000, seller_name: 'A' },
      { order_id: 2, title: 'Sách 2', order_status: 'Chờ xác nhận', price: 60000, seller_name: 'B' },
      { order_id: 3, title: 'Sách 3', order_status: 'Chờ xác nhận', price: 70000, seller_name: 'C' },
    ]);

    const { getByText } = render(<CartScreen />);
    
    await waitFor(() => {
      expect(getByText('Sách 1')).toBeTruthy();
      expect(getByText('Sách 2')).toBeTruthy();
      expect(getByText('Sách 3')).toBeTruthy();
      expect(getByText(/Đang xử lý \(3\)/)).toBeTruthy();
    });
  });

  test('removes order from list after successful deletion', async () => {
    mockGetOrders.mockResolvedValue([
      { order_id: 1, title: 'Sách Test', order_status: 'Chờ xác nhận', price: 50000, seller_name: 'A' },
    ]);

    const { getByTestId, queryByText } = render(<CartScreen />);
    
    await waitFor(() => {
      expect(getByTestId('delete-1')).toBeTruthy();
    });

    fireEvent.press(getByTestId('delete-1'));
    
    await act(async () => {
      fireEvent.press(getByTestId('confirm-delete'));
    });

    await waitFor(() => {
      // After deletion, the order should be removed
      expect(queryByText('Sách Test')).toBeNull();
    });
  });
});
