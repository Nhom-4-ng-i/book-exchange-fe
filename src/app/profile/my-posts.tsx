import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PostCard } from "@/components/profile/PostCard";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft } from "lucide-react-native";

const sellingPosts = [
  {
    title: "Giải tích 2",
    category: "Ngoại ngữ",
    condition: "Chưa đọc",
    price: "120.000đ",
    status: "Đang bán",
  },
  {
    title: "Giải tích 2",
    category: "Ngoại ngữ",
    condition: "Chưa đọc",
    price: "120.000đ",
    status: "Đang bán",
  },
];

const soldPosts = [
  {
    title: "Giải tích 2",
    category: "Ngoại ngữ",
    condition: "Đã đọc",
    price: "120.000đ",
    status: "Đã bán",
  },
];

export default function MyPostsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={["left", "right", "bottom"]}
    >
      <StatusBar style="dark" />
      <View className="flex-row items-center justify-between px-6 py-2 h-16">
        <Pressable
          onPress={() => router.back()}
          className="rounded-full p-2 active:opacity-70"
        >
          <ArrowLeft size={22} />
        </Pressable>
        <Text className="flex-1 text-center text-xl font-bold text-textPrimary900">
          Bài đăng của tôi
        </Text>
        <View className="w-8" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-6 mt-2">
          <Text className="mb-3 text-heading5 font-semibold text-textPrimary900">
            Đang bán ({sellingPosts.length})
          </Text>
          {sellingPosts.map((item, index) => (
            <PostCard key={`selling-${index}`} {...item} />
          ))}
        </View>

        <View className="px-6">
          <Text className="mb-4 mt-2 text-heading5 font-semibold text-textPrimary900">
            Đã bán ({soldPosts.length})
          </Text>
          {soldPosts.map((item, index) => (
            <PostCard key={`sold-${index}`} {...item} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
