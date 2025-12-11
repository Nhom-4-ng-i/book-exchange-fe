import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { UserService } from "@/api";
import { PostCard } from "@/components/profile/PostCard";

type MyPost = {
  id: string;
  book_title: string;
  course: string;
  book_status: string;
  price: number | string;
  status: string;
  thumbnail_url?: string;
};

export default function MyPostsScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [sellingPosts, setSellingPosts] = useState<MyPost[]>([]);
  const [soldPosts, setSoldPosts] = useState<MyPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await UserService.getMyPostsRouteApiUserPostsGet();

        const all: MyPost[] = Array.isArray(data) ? data : [];
        console.log(data);

        const selling = all.filter(
          (p) =>
            p.status === "SELLING" ||
            p.status === "selling" ||
            p.status === "Đang bán"
        );
        const sold = all.filter(
          (p) =>
            p.status === "SOLD" || p.status === "sold" || p.status === "Đã bán"
        );

        setSellingPosts(selling);
        setSoldPosts(sold);
      } catch (e) {
        console.log("Load my posts error:", e);
        setError("Không thể tải danh sách bài đăng.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  const formatPrice = (price: number | string) => {
    if (typeof price === "number") {
      return `${price.toLocaleString("vi-VN")}đ`;
    }
    return price;
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#5E3EA1" />
      </View>
    );
  }

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
        {error && (
          <Text className="px-6 mb-2 text-bodyMedium text-textRed">
            {error}
          </Text>
        )}

        <View className="px-6 mt-2">
          <Text className="mb-3 text-heading5 font-semibold text-textPrimary900">
            Đang bán ({sellingPosts.length})
          </Text>
          {sellingPosts.map((item) => (
            <PostCard
              key={item.id}
              title={item.book_title}
              category={item.course}
              condition={item.book_status}
              price={formatPrice(item.price)}
              status={item.status}
              thumbnailUrl={item.thumbnail_url}
            />
          ))}
          {sellingPosts.length === 0 && (
            <Text className="text-bodyMedium text-textGray500">
              Bạn chưa có bài đăng đang bán.
            </Text>
          )}
        </View>

        <View className="px-6">
          <Text className="mb-4 mt-2 text-heading5 font-semibold text-textPrimary900">
            Đã bán ({soldPosts.length})
          </Text>
          {soldPosts.map((item) => (
            <PostCard
              key={item.id}
              title={item.book_title}
              category={item.course}
              condition={item.book_status}
              price={formatPrice(item.price)}
              status={item.status}
              thumbnailUrl={item.thumbnail_url}
            />
          ))}
          {soldPosts.length === 0 && (
            <Text className="text-bodyMedium text-textGray500">
              Chưa có cuốn nào được đánh dấu đã bán.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
