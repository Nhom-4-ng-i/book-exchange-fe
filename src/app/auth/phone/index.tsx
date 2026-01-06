import IconPhone from "@/icons/IconPhone";
import * as Sentry from "@sentry/react-native";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import Header from "../../../components/Header";

import { AuthService, UserService } from "@/api";

type UserProfile = {
  user_id: string;
  email: string;
  name: string;
  role: string;
  phone: string | null;
};

export default function PhoneNumberScreen() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [digits, setDigits] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkPhone = async () => {
      try {
        const response = await UserService.getMyProfileRouteApiUserMeGet();
        const me = response as UserProfile;

        if (me.phone) {
          router.replace("/home");
          return;
        }
      } catch (e) {
        Sentry.withScope((scope) => {
          scope.setTag("feature", "auth");
          scope.setContext("api", {
            url: UserService.getMyProfileRouteApiUserMeGet(),
            method: "GET",
          });
          scope.setLevel("error");
          Sentry.captureException(e);
        });
        console.log("Check user phone error:", e);
      } finally {
        setChecking(false);
      }
    };

    checkPhone();
  }, []);

  const countryCode = "(+84)";

  const formatted = useMemo(() => {
    const s = digits.replace(/\D/g, "");
    const parts: string[] = [];
    for (let i = 0; i < s.length; i += 3) parts.push(s.slice(i, i + 3));
    return parts.join(" ");
  }, [digits]);

  const onTextChange = (text: string) => {
    const newDigits = text.replace(/\D/g, "");
    if (newDigits.length <= 15) setDigits(newDigits);
  };

  const handleSkip = () => {
    router.replace("/home");
  };

  const canContinue = digits.length >= 6 && !submitting;
  const submitPhone = async () => {
    if (!canContinue) return;

    try {
      setSubmitting(true);
      setError(null);

      const phoneNumberWithCountryCode = `+84${digits}`;

      await AuthService.updatePhoneRouteApiAuthPhonePut({
        phone: phoneNumberWithCountryCode,
      });
      router.replace("/success");
    } catch (e) {
      Sentry.withScope((scope) => {
        scope.setTag("feature", "auth");
        scope.setContext("api", {
          url: UserService.getMyProfileRouteApiUserMeGet(),
          method: "GET",
        });
        scope.setLevel("error");
        Sentry.captureException(e);
      });
      console.log("Update phone error:", e);
      setError("Không thể cập nhật số điện thoại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#5E3EA1" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white h-full">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <Header showBackButton showSkipButton onSkipPress={handleSkip} />

        <View className="flex-1 px-6 mb-6">
          <Text className="text-2xl font-bold text-center mt-4">
            Số điện thoại
          </Text>
          <Text className="text-[#A6A6A6] text-center mt-2 mb-6 font-normal">
            Vui lòng nhập số điện thoại của bạn để chúng tôi có thể giao hàng dễ
            dàng hơn
          </Text>

          {error && <Text className="mb-3 text-sm text-red-500">{error}</Text>}

          <View className="mt-2">
            <Text className="font-medium mb-2 text-sm">Số điện thoại</Text>
            <View className="flex-row justify-center items-center bg-gray-50 rounded-lg h-14 px-3">
              <View className="flex-row items-center mr-1">
                <IconPhone />
                <Text className="ml-1 text-[16px] text-gray-900 font-semibold">
                  {countryCode}
                </Text>
              </View>

              <TextInput
                style={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  lineHeight: 20,
                }}
                className="flex-1 text-[16px] text-gray-900"
                value={formatted}
                onChangeText={onTextChange}
                keyboardType="phone-pad"
                placeholder="123 435 7565"
                placeholderTextColor="#9CA3AF"
                onPress={submitPhone}
                editable={!submitting}
              />
            </View>
          </View>

          <View className="h-20" />

          <Pressable
            disabled={!canContinue}
            onPress={submitPhone}
            className="bg-textPrimary500 h-14 rounded-[28px] items-center justify-center active:opacity-85 disabled:bg-violet-300"
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-base">Tiếp tục</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
