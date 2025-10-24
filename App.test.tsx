// File: App.test.tsx

import { render } from '@testing-library/react-native';
import React from 'react';
import { View } from 'react-native';

// Simple test component
const TestComponent = () => <View testID="test-view" />;

describe('App', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId('test-view')).toBeTruthy();
  });
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeTruthy(): R;
    }
  }
}