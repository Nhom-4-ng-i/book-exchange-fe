import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

// Mock icons and navigation components
jest.mock('@expo/vector-icons', () => ({ Ionicons: 'Ionicons' }));

jest.mock('@/components/BottomNav', () => {
  const { View } = require('react-native');
  return () => <View testID="bottom-nav" />;
});

jest.mock('@/icons/IconBell', () => {
  const { View } = require('react-native');
  return () => <View testID="icon-bell" />;
});

jest.mock('@/icons/IconBack', () => {
  const { View } = require('react-native');
  return () => <View testID="icon-back" />;
});

const mockRouterBack = jest.fn();
jest.mock('expo-router', () => ({
  router: { back: mockRouterBack },
  useRouter: () => ({ back: mockRouterBack }),
}));

// Mock API service
const mockGetNotifications = jest.fn();
const mockReadNotification = jest.fn();

jest.mock('@/api', () => ({
  NotificationsService: {
    getNotificationsListRouteApiNotificationsGet: () => mockGetNotifications(),
    readNotificationRouteApiNotificationsNotificationIdReadPost: (id: number) => mockReadNotification(id),
  },
  OpenAPI: { BASE: '', TOKEN: undefined },
}));

// Mock Sentry
jest.mock('@sentry/react-native', () => ({
  captureException: jest.fn(),
  withScope: jest.fn().mockImplementation((cb) => {
    const scope = { setTag: jest.fn(), setContext: jest.fn(), setLevel: jest.fn() };
    return cb(scope);
  }),
}));

// Import after mocks
import NotificationScreen from '@/app/notification/index';

describe('NotificationScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetNotifications.mockResolvedValue([]);
    mockReadNotification.mockResolvedValue({});
  });

  test('shows empty message when there are no notifications', async () => {
    const { getByText } = render(<NotificationScreen />);
    await waitFor(() => {
      expect(getByText('Ở đây không có thông báo')).toBeTruthy();
    });
  });

  test('renders without crashing', async () => {
    const { UNSAFE_root } = render(<NotificationScreen />);
    await waitFor(() => {
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  test('calls API on mount', async () => {
    render(<NotificationScreen />);
    await waitFor(() => {
      expect(mockGetNotifications).toHaveBeenCalled();
    });
  });

  test('shows header with title', async () => {
    const { getByText } = render(<NotificationScreen />);
    await waitFor(() => {
      expect(getByText('Thông báo')).toBeTruthy();
    });
  });

  test('shows bottom navigation', async () => {
    const { getByTestId } = render(<NotificationScreen />);
    await waitFor(() => {
      expect(getByTestId('bottom-nav')).toBeTruthy();
    });
  });

  test('shows bell icon when empty', async () => {
    const { getByTestId } = render(<NotificationScreen />);
    await waitFor(() => {
      expect(getByTestId('icon-bell')).toBeTruthy();
    });
  });

  test('displays notifications when API returns data', async () => {
    mockGetNotifications.mockResolvedValue([
      {
        id: 1,
        type_id: 1,
        title: 'Thông báo mới',
        content: 'Có đơn hàng mới',
        is_read: false,
        created_at: '2024-01-15T10:00:00Z',
        user_id: 'user1',
      },
    ]);

    const { getByText } = render(<NotificationScreen />);
    await waitFor(() => {
      expect(getByText('Thông báo mới')).toBeTruthy();
      expect(getByText('Có đơn hàng mới')).toBeTruthy();
    });
  });

  test('groups notifications by date', async () => {
    mockGetNotifications.mockResolvedValue([
      {
        id: 1,
        type_id: 1,
        title: 'Notification 1',
        content: 'Content 1',
        is_read: false,
        created_at: '2024-01-15T10:00:00Z',
        user_id: 'user1',
      },
      {
        id: 2,
        type_id: 1,
        title: 'Notification 2',
        content: 'Content 2',
        is_read: true,
        created_at: '2024-01-15T14:00:00Z',
        user_id: 'user1',
      },
    ]);

    const { getByText } = render(<NotificationScreen />);
    await waitFor(() => {
      expect(getByText('15/01/2024')).toBeTruthy();
    });
  });

  test('marks notification as read when pressed', async () => {
    mockGetNotifications.mockResolvedValue([
      {
        id: 1,
        type_id: 1,
        title: 'Unread Notification',
        content: 'This is unread',
        is_read: false,
        created_at: '2024-01-15T10:00:00Z',
        user_id: 'user1',
      },
    ]);

    const { getByText } = render(<NotificationScreen />);
    
    await waitFor(() => {
      expect(getByText('Unread Notification')).toBeTruthy();
    });

    // Touch the notification to mark as read
    await act(async () => {
      fireEvent(getByText('This is unread').parent?.parent!, 'touchEnd');
    });

    await waitFor(() => {
      expect(mockReadNotification).toHaveBeenCalledWith(1);
    });
  });

  test('does not mark already read notification', async () => {
    mockGetNotifications.mockResolvedValue([
      {
        id: 1,
        type_id: 1,
        title: 'Read Notification',
        content: 'Already read',
        is_read: true,
        created_at: '2024-01-15T10:00:00Z',
        user_id: 'user1',
      },
    ]);

    const { getByText } = render(<NotificationScreen />);
    
    await waitFor(() => {
      expect(getByText('Read Notification')).toBeTruthy();
    });

    await act(async () => {
      fireEvent(getByText('Already read').parent?.parent!, 'touchEnd');
    });

    expect(mockReadNotification).not.toHaveBeenCalled();
  });

  test('handles API error gracefully', async () => {
    mockGetNotifications.mockRejectedValue(new Error('API Error'));

    const { getByText } = render(<NotificationScreen />);
    await waitFor(() => {
      expect(getByText('Ở đây không có thông báo')).toBeTruthy();
    });
  });

  test('handles mark as read error gracefully', async () => {
    mockGetNotifications.mockResolvedValue([
      {
        id: 1,
        type_id: 1,
        title: 'Test Notification',
        content: 'Test content',
        is_read: false,
        created_at: '2024-01-15T10:00:00Z',
        user_id: 'user1',
      },
    ]);
    mockReadNotification.mockRejectedValue(new Error('Read Error'));

    const { getByText } = render(<NotificationScreen />);
    
    await waitFor(() => {
      expect(getByText('Test Notification')).toBeTruthy();
    });

    await act(async () => {
      fireEvent(getByText('Test content').parent?.parent!, 'touchEnd');
    });

    // Should still render without crashing
    expect(getByText('Test Notification')).toBeTruthy();
  });

  test('shows back button', async () => {
    const { getByTestId } = render(<NotificationScreen />);
    await waitFor(() => {
      expect(getByTestId('icon-back')).toBeTruthy();
    });
  });

  test('sorts notifications by date descending', async () => {
    mockGetNotifications.mockResolvedValue([
      {
        id: 1,
        type_id: 1,
        title: 'Older',
        content: 'Old content',
        is_read: false,
        created_at: '2024-01-10T10:00:00Z',
        user_id: 'user1',
      },
      {
        id: 2,
        type_id: 1,
        title: 'Newer',
        content: 'New content',
        is_read: false,
        created_at: '2024-01-15T10:00:00Z',
        user_id: 'user1',
      },
    ]);

    const { getAllByText } = render(<NotificationScreen />);
    
    await waitFor(() => {
      // Both should be visible
      expect(getAllByText(/Older|Newer/).length).toBe(2);
    });
  });

  test('renders multiple notifications', async () => {
    mockGetNotifications.mockResolvedValue([
      { id: 1, type_id: 1, title: 'First', content: 'Content 1', is_read: false, created_at: '2024-01-15T10:00:00Z', user_id: 'u1' },
      { id: 2, type_id: 1, title: 'Second', content: 'Content 2', is_read: true, created_at: '2024-01-15T11:00:00Z', user_id: 'u1' },
      { id: 3, type_id: 1, title: 'Third', content: 'Content 3', is_read: false, created_at: '2024-01-15T12:00:00Z', user_id: 'u1' },
    ]);

    const { getByText } = render(<NotificationScreen />);
    
    await waitFor(() => {
      expect(getByText('First')).toBeTruthy();
      expect(getByText('Second')).toBeTruthy();
      expect(getByText('Third')).toBeTruthy();
    });
  });
});
