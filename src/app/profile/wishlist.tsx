import { useRouter } from "expo-router";
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
import { InfoBanner } from "@/components/profile/InfoBanner";
import { WishlistCard } from "@/components/profile/WishlistCard";

type ApiWishlist = {
  id: number;
  user_id: string;
  title: string;
  course_id: number | null;
  max_price: number | null;
  created_at: string; // ISO
};

type UiWishlist = {
  title: string;
  subject: string; // bạn đang hiển thị subject string
  price: string; // "≤ 60.000đ"
  createdAt: string; // "DD/MM/YYYY"
};

function formatDateDDMMYYYY(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function formatVnd(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

export default function WishlistScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlistItems, setWishlistItems] = useState<UiWishlist[]>([]);

  useEffect(() => {
    const fetchWishlists = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await UserService.getMyWishlistsRouteApiUserWishlistsGet();
        const arr: ApiWishlist[] = Array.isArray(data) ? data : [];

        arr.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        const mapped: UiWishlist[] = arr.map((w) => ({
          title: w.title ?? "",
          subject: "Không chọn môn",
          price:
            w.max_price && w.max_price > 0
              ? `≤ ${formatVnd(w.max_price)}`
              : "Không giới hạn",
          createdAt: w.created_at ? formatDateDDMMYYYY(w.created_at) : "",
        }));

        setWishlistItems(mapped);
      } catch (e) {
        console.log("Load wishlists error:", e);
        setError("Không thể tải danh sách wishlist.");
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlists();
  }, []);

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

          {error && <Text className="mt-4 text-sm text-red-500">{error}</Text>}

          {wishlistItems.map((item, index) => (
            <WishlistCard key={`wishlist-${index}`} {...item} />
          ))}

          {!error && wishlistItems.length === 0 && (
            <Text className="mt-6 text-bodyMedium text-textGray500">
              Bạn chưa có wishlist nào.
            </Text>
          )}
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
