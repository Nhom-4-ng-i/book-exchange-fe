// File: jest-setup.js (PHIÊN BẢN SỬA LỖI)

// 1. Mock react-native-gesture-handler (Luôn để ở đầu)
import 'react-native-gesture-handler/jestSetup';

// 2. Giả lập toàn bộ module 'expo-router'
jest.mock('expo-router', () => {
    // Lấy module gốc
    const actual = jest.requireActual('expo-router');
    const React = require('react');

    // Tạo component <Stack> giả
    const MockStack = ({ children }) => <>{children}</>;
    // Tạo component <Stack.Screen> giả
    MockStack.Screen = ({ children }) => <>{children}</>;

    return {
        ...actual, // Giữ lại mọi thứ của expo-router (như useRouter)

        // Thay thế Stack bằng component giả của chúng ta
        Stack: MockStack,

        // Giả lập cái hook 'useLinkPreviewContext' đã gây ra lỗi crash
        useLinkPreviewContext: () => ({
            isPressing: false,
            setIsPressing: jest.fn(),
        }),
    };
});

// 3. Giả lập @expo/vector-icons (cho Ionicons)
jest.mock('@expo/vector-icons', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        Ionicons: (props) => <View testID="mock-icon" {...props} />,
    };
});

// 4. Giả lập expo-linking
jest.mock('expo-linking', () => {
    const actual = jest.requireActual('expo-linking');
    return {
        ...actual,
        createURL: jest.fn(),
    };
});