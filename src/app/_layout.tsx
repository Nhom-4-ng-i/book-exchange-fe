import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import '../../global.css';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    noto_sans: require('../../assets/fonts/Noto_Sans/static/NotoSans-Regular.ttf'),
    roboto: require('../../assets/fonts/Roboto/static/Roboto-Regular.ttf'),
  });

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
