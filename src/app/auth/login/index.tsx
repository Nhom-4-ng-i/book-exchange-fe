import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sentry from "@sentry/react-native";
import * as AuthSession from "expo-auth-session";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";

import { ApiError, AuthService, OpenAPI, UserService } from "@/api";
import { loadGoogleSignin } from "googleAuth";
import IconFacebook from "../../../icons/IconFacebook";
import IconGoogle from "../../../icons/IconGoogle";

WebBrowser.maybeCompleteAuthSession();

OpenAPI.BASE = "http://160.187.246.140:8000";

async function signInOrSignUp(email: string, password: string, name?: string) {
  try {
    return await AuthService.signInRouteApiAuthSignInPost({ email });
  } catch (err: any) {
    const isApiError =
      err instanceof ApiError || typeof err?.status === "number";
    if (!isApiError) throw err;

    const status = err.status ?? err?.statusCode;
    if (status === 404 || status === 401) {
      await AuthService.signUpRouteApiAuthSignUpPost({
        email,
        password,
        name,
      } as any);
      return await AuthService.signInRouteApiAuthSignInPost({ email });
    }
    throw err;
  }
}

export default function LoginScreen() {
  const router = useRouter();
  const [isExpoGo, setIsExpoGo] = useState(false);

  // 1) Check logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) return;

        OpenAPI.TOKEN = token;
        await UserService.getMyProfileRouteApiUserMeGet();
        router.replace("/home");
      } catch (e) {
        await AsyncStorage.removeItem("access_token");
        await AsyncStorage.removeItem("user");
      }
    };
    checkLoggedIn();
  }, [router]);

  // 2) Detect Expo Go and configure GoogleSignin ONCE for native builds
  useEffect(() => {
    const expoGo = !Constants.appOwnership || Constants.appOwnership === "expo";
    setIsExpoGo(expoGo);

    const initNativeGoogleSignin = async () => {
      // Only init when NOT Expo Go
      if (expoGo) return;

      const { GoogleSignin } = await loadGoogleSignin();

      const webClientId = asString(
        Constants.expoConfig?.extra?.googleSignIn?.webClientId
      );

      if (!webClientId) {
        console.warn("Missing googleSignIn.webClientId in app config extra");
        return;
      }

      GoogleSignin.configure({
        webClientId,
        offlineAccess: false,
        scopes: ["profile", "email"],
      });
    };

    initNativeGoogleSignin();
  }, []);

  // Nút 1: TEST email (không qua Google)
  const handleTestEmailLogin = async () => {
    try {
      const email = "ttqthinh2004@gmail.com";
      const password = "password";
      const name = "Thinh";

      const res = await signInOrSignUp(email, password, name);
      await persistSession(res.access_token);

      router.push("/auth/phone");
    } catch (error: any) {
      Sentry.captureException(error);
      Alert.alert("Lỗi", "Không thể đăng nhập test. Kiểm tra lại API.");
    }
  };

  function asString(v: unknown): string | undefined {
    if (typeof v === "string") return v;
    if (Array.isArray(v) && typeof v[0] === "string") return v[0];
    return undefined;
  }

  async function persistSession(accessToken: string) {
    await AsyncStorage.setItem("access_token", accessToken);
    OpenAPI.TOKEN = accessToken;

    const me = await UserService.getMyProfileRouteApiUserMeGet();
    await AsyncStorage.setItem("user", JSON.stringify(me));

    return me;
  }

  // Nút 2: Google login thật
  const handleGoogleLogin = async () => {
    // Expo Go path: dùng backend OAuth (AuthSession)
    if (isExpoGo) {
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: "exchangeoldbooks",
        path: "auth",
      });

      const authUrl = `${OpenAPI.BASE.replace(/\/+$/, "")}/api/auth/google/login?redirect_uri=${encodeURIComponent(
        redirectUrl
      )}`;

      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUrl
      );
      if (result.type !== "success") return;

      const urlObj = new URL(result.url);
      const token = urlObj.searchParams.get("token");

      if (!token) {
        Alert.alert("Lỗi", "Không nhận được token sau khi đăng nhập.");
        return;
      }

      await persistSession(token);
      router.push("/auth/phone");

      return;
    }

    // Native path
    const {
      GoogleSignin,
      statusCodes,
      isErrorWithCode,
      isSuccessResponse,
      isCancelledResponse,
    } = await loadGoogleSignin();

    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const response = await GoogleSignin.signIn();
      if (!isSuccessResponse(response)) return;

      const googleUser = response.data?.user;
      const email = googleUser?.email;
      const name = googleUser?.name ?? googleUser?.givenName;
      const password = "password";

      if (!email) {
        Alert.alert("Lỗi", "Không lấy được email từ Google.");
        return;
      }

      const res = await signInOrSignUp(email, password, name);
      await persistSession(res.access_token);
      router.push("/auth/phone");
    } catch (err: any) {
      if (
        isCancelledResponse?.(err) ||
        err?.code === statusCodes?.SIGN_IN_CANCELLED
      )
        return;

      if (isErrorWithCode?.(err)) {
        if (err.code === statusCodes.IN_PROGRESS) return;
        if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          Alert.alert(
            "Lỗi",
            "Google Play Services không khả dụng hoặc đã lỗi thời."
          );
          return;
        }
      }

      Sentry.captureException(err);
      Alert.alert("Lỗi", "Không thể đăng nhập. Vui lòng thử lại.");
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

        <Pressable
          className={`${buttonBaseClass} ${buttonActiveClass}`}
          onPress={handleTestEmailLogin}
        >
          <View className="absolute left-6">
            <IconGoogle />
          </View>
          <Text className="text-sm font-normal text-gray-800">
            Đăng nhập với Google mẫu
          </Text>
        </Pressable>

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
