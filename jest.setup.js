// @ts-nocheck
// Setup file for Jest tests

// Import jest-dom for additional matchers
import '@testing-library/jest-native/extend-expect';

// Add global Jest types
global.jest = jest;
global.describe = describe;
global.it = it;
global.expect = expect;

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  return {
    ...Reanimated,
    default: {
      ...Reanimated.default,
      call: () => {},
    },
  };
});

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Extend expect with custom matchers
expect.extend({
  toBeTruthy(received) {
    return {
      message: () => `expected ${received} to be truthy`,
      pass: !!received,
    };
  },
  toBeDefined(received) {
    return {
      message: () => `expected ${received} to be defined`,
      pass: received !== undefined && received !== null,
    };
  },
  toHaveBeenCalled(received) {
    return {
      message: () => `expected ${received} to have been called`,
      pass: received && typeof received === 'function' && received.mock && received.mock.calls.length > 0,
    };
  },
  toBeCalledWith(received, ...args) {
    return {
      message: () => `expected ${received} to have been called with ${args}`,
      pass: received && 
             typeof received === 'function' && 
             received.mock && 
             received.mock.calls.some(call => 
               args.every((arg, i) => call[i] === arg)
             ),
    };
  },
});
