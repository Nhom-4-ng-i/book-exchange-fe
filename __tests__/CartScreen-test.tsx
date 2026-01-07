import React from 'react';
import { render, waitFor } from '@testing-library/react-native';

// Import the Cart screen from the app.  The file lives at
// src/app/cart/index.tsx and is exported by default.
import CartScreen from '@/app/cart/index';

// Mock vector icons to avoid native module errors in Jest.
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock bottom navigation and header components which are peripheral to the
// cart screen’s core behaviour.  Stubbing these to null reduces noise in
// snapshot output and speeds up tests.
jest.mock('@/components/BottomNav', () => () => null);
jest.mock('@/components/HeaderHome', () => () => null);
jest.mock('@/components/CartItem', () => () => null);
jest.mock('@/components/ConfirmationModal', () => () => null);
jest.mock('@/components/SuccessModal', () => () => null);
jest.mock('@/icons/IconEmptyCart', () => () => null);

// Mock AsyncStorage to provide a token when requested.  The cart screen
// attempts to read an access token before issuing API calls.
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
}));

// Mock API services.  We return an empty array for the orders list so that
// the ListEmptyComponent renders, displaying the "Không có sản phẩm" text.
jest.mock('@/api', () => ({
  UserService: {
    getMyOrdersRouteApiUserOrdersGet: jest.fn().mockResolvedValue([]),
    getMyProfileRouteApiUserMeGet: jest.fn().mockResolvedValue(null),
  },
  OrdersService: {
    cancelOrderRouteApiOrdersOrderIdCancelPost: jest.fn().mockResolvedValue({}),
    getOrderRouteApiOrdersOrderIdGet: jest.fn().mockResolvedValue({}),
  },
  OpenAPI: { BASE: '', TOKEN: undefined },
}));

// Mock expo-router.  The cart screen uses useFocusEffect to trigger
// fetchOrders() on mount; we call the callback immediately for test
// purposes.
jest.mock('expo-router', () => ({
  useFocusEffect: (cb: any) => cb(),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
}));

// Mock Sentry to avoid errors when the component captures exceptions.
jest.mock('@sentry/react-native', () => ({
  captureException: jest.fn(),
  withScope: jest.fn().mockImplementation((cb) => {
    const scope = { setTag: jest.fn(), setContext: jest.fn(), setLevel: jest.fn() };
    return cb(scope);
  }),
}));

describe('CartScreen', () => {
  test('shows empty cart message when no orders are returned', async () => {
    const { getByText } = render(<CartScreen />);
    // Wait for the fetchOrders call to complete and for the empty state to
    // render.  Once loading finishes, the ListEmptyComponent should show
    // "Không có sản phẩm".
    await waitFor(() => {
      expect(getByText('Không có sản phẩm')).toBeTruthy();
    });
  });
});