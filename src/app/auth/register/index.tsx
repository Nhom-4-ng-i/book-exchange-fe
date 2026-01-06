import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { AuthService, OpenAPI, UserService } from "@/api";
import { loadGoogleSignin } from "googleAuth";

OpenAPI.BASE = "http://160.187.246.140:8000";

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

async function signIn(email: string, password: string) {
  return await AuthService.signInRouteApiAuthSignInPost({
    email,
    password,
  } as any);
}

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [busy, setBusy] = useState(false);

  const webClientId = useMemo(
    () => asString(Constants.expoConfig?.extra?.googleSignIn?.webClientId),
    []
  );

  // Configure GoogleSignin once (native build)
  useEffect(() => {
    const init = async () => {
      try {
        if (!webClientId) return;
        const { GoogleSignin } = await loadGoogleSignin();
        GoogleSignin.configure({
          webClientId,
          offlineAccess: false,
          scopes: ["profile", "email"],
        });
      } catch (e) {
        Sentry.captureException(e);
      }
    };
    init();
  }, [webClientId]);

  const handleRegister = async () => {
    const n = name.trim();
    const e = email.trim();

    if (!n || !e || !password) {
      Alert.alert(
        "Thiếu thông tin",
        "Vui lòng nhập họ tên, email và mật khẩu."
      );
      return;
    }

    setBusy(true);
    try {
      await AuthService.signUpRouteApiAuthSignUpPost({
        name: n,
        email: e,
        password,
      } as any);

      const res = await signIn(e, password);
      await persistSession((res as any).access_token);

      router.push("/auth/phone");
    } catch (err: any) {
      Sentry.captureException(err);
      Alert.alert("Lỗi", "Không thể đăng ký. Vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!webClientId) {
      Alert.alert(
        "Thiếu cấu hình",
        "Chưa có googleSignIn.webClientId trong app config."
      );
      return;
    }

    setBusy(true);
    try {
      const {
        GoogleSignin,
        statusCodes,
        isErrorWithCode,
        isSuccessResponse,
        isCancelledResponse,
      } = await loadGoogleSignin();

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const response = await GoogleSignin.signIn();
      if (!isSuccessResponse(response)) return;

      const googleUser = response.data?.user;
      const gEmail = googleUser?.email;
      const gName = googleUser?.name ?? googleUser?.givenName;

      if (!gEmail) {
        Alert.alert("Lỗi", "Không lấy được email từ Google.");
        return;
      }

      try {
        // Try to sign in first
        const res = await signIn(gEmail, "password");
        await persistSession((res as any).access_token);
        router.push("/auth/phone");
      } catch (err: any) {
        // If sign in fails, try to sign up
        if (err.status === 404 || err.status === 401) {
          await AuthService.signUpRouteApiAuthSignUpPost({
            name: gName || "User",
            email: gEmail,
            password: "password",
          } as any);

          const res = await signIn(gEmail, "password");
          await persistSession((res as any).access_token);
          router.push("/auth/phone");
        } else {
          throw err;
        }
      }
    } catch (err: any) {
      try {
        const { statusCodes, isErrorWithCode, isCancelledResponse } =
          await loadGoogleSignin();
        if (
          isCancelledResponse?.(err) ||
          err?.code === statusCodes?.SIGN_IN_CANCELLED
        )
          return;

        if (
          isErrorWithCode?.(err) &&
          err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
        ) {
          Alert.alert(
            "Lỗi",
            "Google Play Services không khả dụng hoặc đã lỗi thời."
          );
          return;
        }
      } catch {}

      Sentry.captureException(err);
      Alert.alert("Lỗi", "Không thể đăng ký với Google. Vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  };

  const buttonBase =
    "flex-row items-center justify-center rounded-full h-[52px] mb-3 border border-gray-200";
  const buttonActive = "active:bg-gray-100 active:border-gray-300";

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 bg-white">
        <View className="flex-1 px-6 pt-4 mt-20">
          <View className="mb-8">
            <Text className="text-2xl font-bold text-black mb-2">
              Tạo tài khoản
            </Text>
            <Text className="text-base text-gray-500">
              Hãy nhập thông tin để đăng ký tài khoản nào!
            </Text>
          </View>

          <View className="mt-2">
            <Text className="font-medium mb-2 text-sm">Họ và tên</Text>
            <View className="flex-row justify-center items-center bg-gray-50 rounded-lg h-14 px-3">
              <TextInput
                style={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  lineHeight: 20,
                }}
                className="flex-1 text-[16px] text-gray-900"
                value={name}
                onChangeText={setName}
                placeholder="Nguyễn Văn A"
                placeholderTextColor="#9CA3AF"
                editable={!busy}
              />
            </View>
          </View>

          <View className="mt-4">
            <Text className="font-medium mb-2 text-sm">Email</Text>
            <View className="flex-row justify-center items-center bg-gray-50 rounded-lg h-14 px-3">
              <TextInput
                style={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  lineHeight: 20,
                }}
                className="flex-1 text-[16px] text-gray-900"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="example@gmail.com"
                placeholderTextColor="#9CA3AF"
                editable={!busy}
              />
            </View>
          </View>

          <View className="mt-4 mb-4">
            <Text className="font-medium mb-2 text-sm">Mật khẩu</Text>
            <View className="flex-row justify-center items-center bg-gray-50 rounded-lg h-14 px-3">
              <TextInput
                style={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  lineHeight: 20,
                }}
                className="flex-1 text-[16px] text-gray-900"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                editable={!busy}
              />
            </View>
          </View>

          <View className="flex-row items-center my-6 mt-4">
            <View className="flex-1 h-[1px] bg-gray-200" />
            <Text className="px-4 text-gray-500 text-sm">hoặc</Text>
            <View className="flex-1 h-[1px] bg-gray-200" />
          </View>

          <Pressable
            disabled={busy}
            onPress={handleRegister}
            className="mt-6 bg-textPrimary500 h-14 rounded-[28px] items-center justify-center active:opacity-85 disabled:bg-violet-300"
          >
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-base">
                Tạo tài khoản
              </Text>
            )}
          </Pressable>

          <View className="flex-row justify-center mt-4">
            <Text className="text-textGray500 font-semibold text-sm">
              Đã có tài khoản?{" "}
            </Text>
            <Pressable
              onPress={() => router.push("/auth/login")}
              disabled={busy}
            >
              <Text className="font-semibold text-sm text-textPrimary500">
                Đăng nhập
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
