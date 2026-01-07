import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';

// Import the notification screen.
import NotificationScreen from '@/app/notification/index';

// Mock icons and navigation components to avoid unnecessary rendering and
// native module issues.
jest.mock('@expo/vector-icons', () => ({ Ionicons: 'Ionicons' }));
jest.mock('@/components/BottomNav', () => () => null);
jest.mock('@/icons/IconBell', () => () => null);
jest.mock('@/icons/IconBack', () => () => null);

// Mock expo-router; the notification screen uses router.back() when the
// back arrow is pressed.  We provide a stub to avoid navigation during tests.
jest.mock('expo-router', () => ({
  router: { back: jest.fn() },
  useRouter: () => ({ back: jest.fn() }),
}));

// Mock API service to return an empty list of notifications.  This will
// trigger the empty state which displays "Ở đây không có thông báo".
jest.mock('@/api', () => ({
  NotificationsService: {
    getNotificationsListRouteApiNotificationsGet: jest
      .fn()
      .mockResolvedValue([]),
    readNotificationRouteApiNotificationsNotificationIdReadPost: jest
      .fn()
      .mockResolvedValue({}),
  },
  OpenAPI: { BASE: '', TOKEN: undefined },
}));

// Mock Sentry to avoid capturing exceptions during tests.
jest.mock('@sentry/react-native', () => ({
  captureException: jest.fn(),
  withScope: jest.fn().mockImplementation((cb) => {
    const scope = { setTag: jest.fn(), setContext: jest.fn(), setLevel: jest.fn() };
    return cb(scope);
  }),
}));

describe('NotificationScreen', () => {
  test('shows empty message when there are no notifications', async () => {
    const { getByText } = render(<NotificationScreen />);
    // Wait until the component finishes loading and the empty state appears.
    await waitFor(() => {
      expect(getByText('Ở đây không có thông báo')).toBeTruthy();
    });
  });
});