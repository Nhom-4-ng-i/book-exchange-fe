/// <reference types="nativewind/types" />
/// <reference types="expo-router/types" />

import 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

declare global {
  namespace React {
    interface StyleSheetProperties {
      [key: string]: any;
    }
  }

  // For SVG imports
  declare module '*.svg' {
    import { SvgProps } from 'react-native-svg';
    const content: React.FC<SvgProps>;
    export default content;
  }

  // For React Navigation types
  type RootStackParamList = {
    index: undefined;
    // Add other routes here
  };

  type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
}
