import { OpenAPI } from "@/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sentry from "@sentry/react-native";
import { useFonts } from "expo-font";
import { Stack, useNavigationContainerRef } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";
import "../../global.css";
import { navigationIntegration } from "../../sentry";

OpenAPI.BASE = "http://160.187.246.140:8000";
OpenAPI.TOKEN = async () => (await AsyncStorage.getItem("access_token")) ?? "";

function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    noto_sans: require("../../assets/fonts/Noto_Sans/static/NotoSans-Regular.ttf"),
    roboto: require("../../assets/fonts/Roboto/static/Roboto-Regular.ttf"),
  });

  const ref = useNavigationContainerRef();

  // Đăng ký navigation container
  useEffect(() => {
    if (ref) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  // Thiết lập user context cho analytics
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#54408C" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="home/index"
        options={{
          title: "Trang Chủ",
          headerShown: false,
        }}
      />

      <Stack.Screen name="auth/login/index" options={{ headerShown: false }} />
      <Stack.Screen name="auth/phone/index" options={{ headerShown: false }} />
      <Stack.Screen name="auth/phone/otp" options={{ headerShown: false }} />

      <Stack.Screen name="profile/index" options={{ headerShown: false }} />
      <Stack.Screen name="profile/my-posts" options={{ headerShown: false }} />
      <Stack.Screen
        name="profile/buyer-management"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="profile/wishlist" options={{ headerShown: false }} />
      <Stack.Screen
        name="profile/wishlist-create"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="notification/index"
        options={{ headerShown: false }}
      />

      <Stack.Screen name="success" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
    </Stack>
  );
}

export default Sentry.wrap(RootLayout);
