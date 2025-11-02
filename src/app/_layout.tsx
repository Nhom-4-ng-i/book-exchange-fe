import { Stack } from 'expo-router';
import '../../global.css';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
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
    </Stack>
  );
}
