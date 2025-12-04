import { useRouter } from "expo-router";
import { ArrowLeft, ChevronDown } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { InfoBanner } from "@/components/profile/InfoBanner";

const subjects = ["Toán", "Vật lý", "Ngoại ngữ", "Công nghệ thông tin"];

export default function WishlistCreateScreen() {
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={["left", "right", "bottom"]}
    >
      <View className="flex-row items-center justify-between px-6 py-2 h-16">
        <Pressable
          onPress={() => router.back()}
          className="rounded-full p-2 active:opacity-70"
        >
          <ArrowLeft size={22} />
        </Pressable>
        <Text className="flex-1 text-center text-xl font-bold text-textPrimary900">
          Tạo Wishlist
        </Text>
        <View className="w-8" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="px-6 mt-6">
          <InfoBanner message="💡 Tạo danh sách sách bạn đang cần. Khi có người đăng bán sách khớp, bạn sẽ nhận thông báo!" />
          <View className="gap-4 rounded-2xl bg-white">
            <View>
              <Text className="mb-3 text-bodyMedium font-medium text-textPrimary900">
                Tên sách/tài liệu cần tìm *
              </Text>
              <TextInput
                placeholder="VD: Giải tích 2"
                style={{
                  backgroundColor: "#E8E8E8",
                  paddingTop: 8,
                  paddingBottom: 10,
                  color: "#7A7A7A",
                }}
                className="rounded-lg px-2 text-bodyMedium text-textPrimary900"
              />
            </View>

            <View>
              <Text className="mb-3 text-bodyMedium font-medium text-textPrimary900">
                Môn học (không bắt buộc)
              </Text>
              <Pressable
                className="flex-row items-center justify-between rounded-lg px-2"
                style={{
                  backgroundColor: "#E8E8E8",
                  paddingTop: 8,
                  paddingBottom: 10,
                }}
                onPress={() => {
                  const next = selectedSubject ? null : subjects[2];
                  setSelectedSubject(next);
                }}
              >
                <Text className="text-bodyMedium text-textGray600">
                  {selectedSubject || "Chọn môn học"}
                </Text>
                <ChevronDown size={18} />
              </Pressable>
            </View>

            <View>
              <Text className="mb-3 text-bodyMedium font-medium text-textPrimary900">
                Giá tối đa (không bắt buộc)
              </Text>
              <TextInput
                placeholder="VD: 120000"
                keyboardType="numeric"
                style={{
                  backgroundColor: "#E8E8E8",
                  paddingTop: 8,
                  paddingBottom: 10,
                  color: "#7A7A7A",
                }}
                className="rounded-lg px-2 text-bodyMedium"
              />
            </View>

            <View
              className="rounded-2xl bg-textGray100 p-4"
              style={{ backgroundColor: "#F5F5F5" }}
            >
              <Text className="text-xs font-semibold text-textGray700">
                Ví dụ Wishlist:
              </Text>
              <Text className="text-xs text-textGray600">
                - &quot;Giải Tích 2&quot; - Toán - Giá tối đa 50.000đ
              </Text>
              <Text className="text-xs text-textGray600">
                - &quot;Vật Lý&quot; - Lý - Không giới hạn giá
              </Text>
              <Text className="text-xs text-textGray600">
                - &quot;Giáo Trình CTDL&quot; - Trí tuệ nhân tạo - Giá tối đa
                100,000đ
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 px-6 bg-textGray50"
        style={{ paddingTop: 20 }}
      >
        <Pressable
          className="items-center rounded-lg bg-textPrimary500 py-3"
          onPress={() => router.back()}
        >
          <Text className="text-heading6 font-bold text-white">
            + Thêm Wishlist mới
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
