import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Alert, Platform, Pressable, Text, View } from "react-native";

import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import IconFacebook from "../../../icons/IconFacebook";
import IconGoogle from "../../../icons/IconGoogle";

export default function LoginScreen() {
  const router = useRouter();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "826333210617-2u5da7jc44f1ttibv621n9e2mdc5321s.apps.googleusercontent.com",
      iosClientId:
        "826333210617-dogrjmu5121isqo1gdnblogr23j6qh6b.apps.googleusercontent.com",
      offlineAccess: false,
      scopes: ["profile", "email"],
      forceCodeForRefreshToken: false,
    });
  }, []);

  const handleGoogleLogin = async () => {
    // 1. Nếu đang chạy web -> báo chưa hỗ trợ, đừng gọi GoogleSignin
    if (Platform.OS === "web") {
      Alert.alert(
        "Chưa hỗ trợ",
        "Đăng nhập Google chỉ hoạt động trên app mobile (Android/iOS), không dùng trên web."
      );
      return;
    }

    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const userInfo = await GoogleSignin.signIn();

      console.log("Google user id:", userInfo.data?.user.id);
      console.log("Google user email:", userInfo.data?.user.email);

      router.replace("/(tabs)");
    } catch (error: any) {
      console.log("Google Sign-In Error RAW:", error);
      console.log("Google Sign-In Error JSON:", JSON.stringify(error, null, 2));

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        return;
      }

      Alert.alert("Lỗi", "Không thể đăng nhập Google. Vui lòng thử lại.");
    }
  };

  const buttonBaseClass =
    "flex-row items-center justify-center rounded-full h-[52px] mb-2 border position-relative border-gray-200";
  const buttonActiveClass =
    "active:bg-gray-100 active:border-gray-300 active:scale-[.98] active:opacity-80";

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-4 mt-28">
        <View className="mb-[131px]">
          <Text className="text-2xl font-bold text-black mb-2">
            Chào mừng bạn trở lại 👋
          </Text>
          <Text className="text-base text-gray-500">
            Đăng nhập vào tài khoản của bạn
          </Text>
        </View>

        <View>
          <Pressable
            className={`${buttonBaseClass} ${buttonActiveClass}`}
            onPress={handleGoogleLogin}
          >
            <View className="absolute left-6">
              <IconGoogle />
            </View>
            <Text className="text-sm font-normal text-gray-800">
              Đăng nhập với Google
            </Text>
          </Pressable>

          <Pressable
            className={`${buttonBaseClass} ${buttonActiveClass}`}
            onPress={() => router.push("/auth/phone")}
          >
            <View className="absolute left-6">
              <AntDesign name="apple" size={20} color="#000000" />
            </View>
            <Text className="text-sm font-normal text-gray-800">
              Đăng nhập với Apple
            </Text>
          </Pressable>

          <Pressable
            className={`${buttonBaseClass} ${buttonActiveClass}`}
            onPress={() => router.push("/auth/phone")}
          >
            <View className="absolute left-6">
              <IconFacebook />
            </View>
            <Text className="text-sm font-normal text-gray-800">
              Đăng nhập với Facebook
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
