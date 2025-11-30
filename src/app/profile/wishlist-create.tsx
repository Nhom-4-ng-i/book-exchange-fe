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
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className="flex-row items-center gap-3 px-4 pb-3 pt-4">
        <Pressable onPress={() => router.back()} className="rounded-full p-2 active:opacity-70">
          <ArrowLeft size={22} />
        </Pressable>
        <Text className="flex-1 text-center text-lg font-bold text-textPrimary900">Tạo Wishlist</Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="px-6">
          <InfoBanner message="Tạo danh sách/tài liệu bạn đang cần. Khi có người đăng bán sách khớp, bạn sẽ nhận thông báo!" />

          <View className="gap-5 rounded-2xl bg-white">
            <View>
              <Text className="mb-2 text-sm font-semibold text-textPrimary900">Tên sách/tài liệu cần tìm *</Text>
              <TextInput
                placeholder="VD: Giải tích 2"
                className="rounded-xl border border-textGray200 bg-textGray50 px-4 py-3 text-base text-textPrimary900"
              />
            </View>

            <View>
              <Text className="mb-2 text-sm font-semibold text-textPrimary900">Môn học (không bắt buộc)</Text>
              <Pressable
                className="flex-row items-center justify-between rounded-xl border border-textGray200 bg-textGray50 px-4 py-3"
                onPress={() => {
                  const next = selectedSubject ? null : subjects[2];
                  setSelectedSubject(next);
                }}
              >
                <Text className="text-base text-textGray800">{selectedSubject || "Chọn môn học"}</Text>
                <ChevronDown size={18} />
              </Pressable>
            </View>

            <View>
              <Text className="mb-2 text-sm font-semibold text-textPrimary900">Giá tối đa (không bắt buộc)</Text>
              <TextInput
                placeholder="VD: 120000"
                keyboardType="numeric"
                className="rounded-xl border border-textGray200 bg-textGray50 px-4 py-3 text-base text-textPrimary900"
              />
            </View>

            <View className="rounded-2xl bg-textGray50 p-4">
              <Text className="mb-2 text-sm font-semibold text-textPrimary900">Ví dụ Wishlist:</Text>
              <Text className="text-sm text-textGray800">- &quot;Giải Tích 2&quot; - Toán - Giá tối đa 50.000đ</Text>
              <Text className="text-sm text-textGray800">- &quot;Vật Lý&quot; - Lý - Không giới hạn giá</Text>
              <Text className="text-sm text-textGray800">- &quot;Giáo Trình CTDL&quot; - Trí tuệ nhân tạo - Giá tối đa 100,000đ</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="px-6 pb-6">
        <Pressable className="items-center rounded-full bg-textPrimary500 py-4" onPress={() => router.back()}>
          <Text className="text-base font-semibold text-white">Thêm Wishlist mới</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
