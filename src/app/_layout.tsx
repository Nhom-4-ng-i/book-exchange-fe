import * as Sentry from "@sentry/react-native";
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';
import '../../global.css';
import '../../sentry';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    noto_sans: require('../../assets/fonts/Noto_Sans/static/NotoSans-Regular.ttf'),
    roboto: require('../../assets/fonts/Roboto/static/Roboto-Regular.ttf'),
  });

useEffect(() => {
    Sentry.setUser({
      id: "nhom4_test_2025",
      email: "man.ngotrieuman27@hcmut.edu.vn",
      username: "Nhóm 4 người",
    });
    Sentry.setTag("group", "nhom-4-nguoi");
  }, []);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#54408C" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="home/index" 
        options={{ 
          title: "Trang Chủ", 
          headerShown: false 
        }} 
      />

      <Stack.Screen 
        name="auth/login/index" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="auth/phone/index" 
        options={{ headerShown: false }} 
      />

      <Stack.Screen 
        name="profile/index" 
        options={{ headerShown: false }} 
      />

      <Stack.Screen 
        name="success" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="onboarding/index"
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}
