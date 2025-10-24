/* eslint-disable no-undef */
// jest.setup.js

// 1. Thêm các hàm test "native" (như toBeVisible(), toBeOnTheScreen())
import '@testing-library/jest-native/extend-expect';

// 2. Mock thư viện react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // Thêm mock cho .call, vì thư viện này cần nó
  Reanimated.default.call = () => {};

  return Reanimated;
});