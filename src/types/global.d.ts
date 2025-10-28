/// <reference types="nativewind/types" />

declare module 'expo-router';
declare module 'expo-auth-session/providers/google';
declare module 'expo-web-browser';
declare module 'react-native-svg';

declare global {
  namespace React {
    interface ViewProps {
      className?: string;
    }
    interface TextProps {
      className?: string;
    }
    interface PressableProps {
      className?: string;
    }
  }
}
