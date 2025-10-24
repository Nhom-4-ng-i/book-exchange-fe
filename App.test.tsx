// File: App.test.tsx

/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react-native';
import React from 'react';
import "./styles/global.css";

// Import the layout component
import RootLayout from './src/app/_layout';

// Mock react-native-reanimated
const mockReanimated = () => ({
  ...jest.requireActual('react-native-reanimated/mock'),
  default: {
    call: () => {},
  },
});

// Mock react-native
jest.mock('react-native-reanimated', () => mockReanimated());

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

describe('<RootLayout />', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<RootLayout />);
    expect(toJSON()).toBeTruthy();
  });
});

// Add global TypeScript types for Jest
declare global {
   
  namespace jest {
    interface Matchers<R> {
      toBeTruthy(): R;
    }
  }
}