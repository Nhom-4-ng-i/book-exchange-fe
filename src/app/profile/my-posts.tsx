import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { ArrowLeft } from "lucide-react-native";

import { PostCard } from "@/components/profile/PostCard";

const sellingPosts = [
  { title: "Giải tích 2", category: "Ngoại ngữ", condition: "Chưa đọc", price: "120.000đ", status: "Chưa đọc" },
  { title: "Giải tích 2", category: "Ngoại ngữ", condition: "Chưa đọc", price: "120.000đ", status: "Chưa đọc" },
];

const soldPosts = [
  { title: "Giải tích 2", category: "Ngoại ngữ", condition: "Chưa đọc", price: "120.000đ", status: "Đã bán" },
];

export default function MyPostsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className="flex-row items-center gap-3 px-4 pb-3 pt-4">
        <Pressable onPress={() => router.back()} className="rounded-full p-2 active:opacity-70">
          <ArrowLeft size={22} color="#000" />
        </Pressable>
        <Text className="flex-1 text-center text-lg font-bold text-textPrimary900">Bài đăng của tôi</Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="px-6">
          <Text className="mb-3 text-base font-semibold text-textPrimary900">Đang bán ({sellingPosts.length})</Text>
          {sellingPosts.map((item, index) => (
            <PostCard key={`selling-${index}`} {...item} />
          ))}
        </View>

        <View className="px-6">
          <Text className="mb-3 mt-2 text-base font-semibold text-textPrimary900">Đã bán ({soldPosts.length})</Text>
          {soldPosts.map((item, index) => (
            <PostCard key={`sold-${index}`} {...item} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
