import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

// Import the success screen.  It is exported by default from
// src/app/success.tsx.
import SuccessScreen from '@/app/success';

// Mock the router.  The success screen calls router.replace('/home') when
// pressing the "Bắt đầu" button.  We capture the call in a jest.fn().
const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  router: {
    replace: (...args: any[]) => mockReplace(...args),
  },
}));

// Mock the success icon component to avoid rendering SVGs.
jest.mock('@/icons/IconSuccess', () => () => null);

// Mock SafeAreaView from react-native-safe-area-context to a regular View so
// tests don’t rely on environment-specific SafeArea handling.
jest.mock('react-native-safe-area-context', () => {
  const View = require('react-native').View;
  return {
    SafeAreaView: View,
  };
});

describe('SuccessScreen', () => {
  test('navigates to home when pressing Bắt đầu button', () => {
    const { getByText } = render(<SuccessScreen />);
    // The success message should be present.
    expect(getByText('Cập nhật thành công')).toBeTruthy();
    const startButton = getByText('Bắt đầu');
    fireEvent.press(startButton);
    expect(mockReplace).toHaveBeenCalledWith('/home');
  });
});