import { Stack } from 'expo-router';
import 'react-native-gesture-handler';
import "../../styles/global.css";
 
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Trang Chủ 📚',
          headerTitleAlign: 'center',
        }}
      />

      <Stack.Screen
        name="login/index"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="profile/index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}