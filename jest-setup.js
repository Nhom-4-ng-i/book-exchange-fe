// Nội dung cho file: jest-setup.js (Bản cập nhật)

// 1. Mock react-native-gesture-handler (cần thiết cho Stack/Tabs)
import 'react-native-gesture-handler/jestSetup';

// 2. Mock các module của Expo
jest.mock('expo-linking', () => {
    const actual = jest.requireActual('expo-linking');
    return {
        ...actual,
        createURL: jest.fn(),
    };
});

// 3. Mock cái Context gây lỗi của Expo Router (bạn đã thấy)
jest.mock('expo-router/src/link/preview/LinkPreviewContext', () => ({
    LinkPreviewContextProvider: ({ children }) => <>{children}</>,
    useLinkPreviewContext: () => ({
        isPressing: false,
        setIsPressing: jest.fn(),
    }),
}));

// 4. Mock @expo/vector-icons (do bạn dùng Ionicons) (RẤT QUAN TRỌNG)
jest.mock('@expo/vector-icons', () => {
    // Trả về một component giả lập
    const React = require('react');
    const { View } = require('react-native');
    return {
        Ionicons: (props) => <View testID="mock-icon" {...props} />,
        // Thêm các loại icon khác nếu bạn dùng (ví dụ: FontAwesome)
        // FontAwesome: (props) => <View testID="mock-icon" {...props} />,
    };
});