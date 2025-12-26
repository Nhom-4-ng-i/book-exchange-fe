import Header from "@/components/Header";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const OTP_LENGTH = 6;

export default function OTPScreen() {
  const router = useRouter();
  const [phone] = useState<string>("123456789"); // Default phone for testing
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTime, setResendTime] = useState(60);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const timer =
      resendTime > 0 &&
      setInterval(() => {
        setResendTime((prevTime: number) => prevTime - 1);
      }, 1000);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resendTime]);

  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      setError(null);

      const otpCode = otp.join("");
      if (otpCode.length !== OTP_LENGTH) {
        setError("Vui lòng nhập đủ mã xác minh");
        return;
      }

      // Here you would call your OTP verification API
      // await AuthService.verifyPhoneOtpRouteApiAuthVerifyPhoneOtpPost({
      //   phone: phone,
      //   token: otpCode,
      // });

      console.log("Verifying OTP:", otpCode);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.replace("/success");
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("Mã xác minh không đúng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };
  const handleSkip = () => {
    router.replace("/auth/phone/otp");
  };

  const handleResendOtp = async () => {
    if (resendTime > 0) return;

    try {
      setLoading(true);
      setError(null);

      // Here you would call your resend OTP API
      // await AuthService.updatePhoneRouteApiAuthPhonePut({
      //   phone: phone,
      // });

      console.log("Resending OTP to:", phone);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setResendTime(60);
      setOtp(Array(OTP_LENGTH).fill(""));
    } catch (error) {
      console.error("Resend OTP error:", error);
      setError("Không thể gửi lại mã. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const isOtpComplete = otp.every((digit: string) => digit !== "");

  return (
    <View className="flex-1 bg-white h-full">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <Header showBackButton onSkipPress={handleSkip} />

        <View className="flex-1 px-6 mb-6">
          <Text className="text-2xl font-bold text-center mt-4">
            Xác minh số điện thoại
          </Text>
          <Text className="text-textGray500 text-center mt-2 mb-2 font-normal">
            Vui lòng nhập mã chúng tôi vừa gửi qua SMS với số
          </Text>
          <Text className="text-textGray900 font-normal text-center">
            (+84) {phone?.replace(/(\d{3})(\d{3})(\d+)/, "$1 $2 $3")}
          </Text>

          {error && (
            <Text className="mb-3 text-sm text-red-500 text-center">
              {error}
            </Text>
          )}

          <View>
            <View className="flex-row justify-between mb-6 mt-10">
              {Array(OTP_LENGTH)
                .fill(0)
                .map((_, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      if (ref) {
                        inputs.current[index] = ref;
                      } else {
                        inputs.current[index] = null;
                      }
                    }}
                    className={`w-14 h-16 border-2 rounded-lg text-center text-heading3 font-bold text-black ${
                      activeIndex === index
                        ? "border-textPrimary500"
                        : "border-[#A6A6A6]"
                    }`}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={otp[index]}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    onFocus={() => setActiveIndex(index)}
                    onBlur={() => setActiveIndex(null)}
                    selectTextOnFocus
                    editable={!loading}
                  />
                ))}
            </View>

            <View className="flex-row justify-center">
              <Text className="text-textGray500 font-semibold text-bodyMedium">
                Nếu bạn không nhận được mã?{" "}
              </Text>
              <Pressable onPress={handleResendOtp} disabled={resendTime > 0}>
                <Text
                  className={`font-semibold text-bodyMedium ${
                    resendTime > 0 ? "text-gray-400" : "text-textPrimary500"
                  }`}
                >
                  {resendTime > 0 ? `Gửi lại (${resendTime}s)` : "Gửi lại"}
                </Text>
              </Pressable>
            </View>
          </View>

          <View className="h-10" />

          <Pressable
            disabled={!isOtpComplete || loading}
            onPress={verifyOtp}
            className="bg-textPrimary500 h-14 rounded-[28px] items-center justify-center active:opacity-85 disabled:bg-violet-300"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-base">Xác minh</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
