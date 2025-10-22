// File: _layout.test.js

import { render } from '@testing-library/react-native';
import React from 'react';

// ĐỔI DÒNG QUAN TRỌNG NÀY:
// Import file layout chính của bạn (thay vì App.js)
// Thư mục 'app' nằm ở gốc, nên đường dẫn là './app/_layout'
import RootLayout from './src/app/_layout';

describe('<RootLayout />', () => {
    it('renders correctly', () => {
        // Test này kiểm tra xem file layout có "vẽ" ra được
        // mà không bị crash hay không

        // Cũng đổi <App /> thành <RootLayout />
        render(<RootLayout />);
    });

    // Bạn có thể giữ hoặc xóa test 'has 1 child'
    it('has 1 child', () => {
        const tree = render(<RootLayout />);
        expect(tree.toJSON().children.length).toBeGreaterThanOrEqual(1);
    });
});