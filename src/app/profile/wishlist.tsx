import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { InfoBanner } from "@/components/profile/InfoBanner";
import { WishlistCard } from "@/components/profile/WishlistCard";

const wishlistItems = [
  {
    title: "Giải tích 2",
    subject: "Ngoại ngữ",
    price: "≤ 60.000đ",
    createdAt: "12/10/2025",
  },
  {
    title: "Giải tích 2",
    subject: "Ngoại ngữ",
    price: "≤ 60.000đ",
    createdAt: "12/10/2025",
  },
];

export default function WishlistScreen() {
  const router = useRouter();

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
          Quản lý Wishlist
        </Text>
        <View className="w-8" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="px-6 mt-6">
          <InfoBanner message="💡 Tạo danh sách sách bạn đang cần. Khi có người đăng bán sách khớp, bạn sẽ nhận thông báo!" />
          {wishlistItems.map((item, index) => (
            <WishlistCard key={`wishlist-${index}`} {...item} />
          ))}
        </View>
      </ScrollView>
      <View
        className="absolute bottom-0 left-0 right-0 px-6 bg-textGray50"
        style={{ paddingTop: 20 }}
      >
        <Pressable
          className="items-center rounded-lg bg-textPrimary500 py-3"
          onPress={() => router.push("/profile/wishlist-create")}
        >
          <Text className="text-heading6 font-bold text-white">
            + Thêm Wishlist mới
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
