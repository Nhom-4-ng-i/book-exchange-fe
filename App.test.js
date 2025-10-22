import { render } from '@testing-library/react-native';
import React from 'react';

// Giả sử file entry của bạn là App.js
// Nếu file chính của bạn là index.js hay gì khác, hãy đổi tên ở đây
import App from './App';

describe('<App />', () => {
    it('renders correctly', () => {
        // Test này chỉ kiểm tra xem app có "vẽ" ra được mà không bị crash hay không
        render(<App />);
    });

    it('has 1 child', () => {
        // Một ví dụ test đơn giản khác
        const tree = render(<App />);
        // Kiểm tra xem component App có ít nhất 1 "con" bên trong nó
        expect(tree.toJSON().children.length).toBeGreaterThanOrEqual(1);
    });
});