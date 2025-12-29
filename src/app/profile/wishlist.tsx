import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import ConfirmationModal from "@/components/ConfirmationModal";
import SuccessModal from "@/components/SuccessModal";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CoursesService, UserService, WishlistsService } from "@/api";
import { InfoBanner } from "@/components/profile/InfoBanner";
import { WishlistCard } from "@/components/profile/WishlistCard";
import IconBack from "@/icons/IconBack";

type ApiWishlist = {
  id: number;
  user_id: string;
  title: string;
  course_id: number | null;
  max_price: number | null;
  created_at: string;
};

type Course = {
  id: number;
  name: string;
};

type UiWishlist = {
  title: string;
  subject: string;
  price: string;
  createdAt: string;
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

  const [wishlists, setWishlists] = useState<ApiWishlist[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedWishlist, setSelectedWishlist] = useState<ApiWishlist | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const [wlRes, courseRes] = await Promise.all([
          UserService.getMyWishlistsRouteApiUserWishlistsGet(),
          CoursesService.getCoursesListRouteApiCoursesGet(),
        ]);

        const wlArr: ApiWishlist[] = Array.isArray(wlRes) ? wlRes : [];
        wlArr.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        const cArr: Course[] = Array.isArray(courseRes) ? courseRes : [];
        setCourses(cArr);
        setWishlists(wlArr);
      } catch (e) {
        console.log("Load wishlists/courses error:", e);
        setError("Không thể tải danh sách wishlist.");
        setCourses([]);
        setWishlists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleDeleteWishlist = useCallback(async (id: number) => {
    try {
      setDeletingId(id);
      await WishlistsService.deleteWishlistRouteApiWishlistsWishlistIdDelete(id);
      setWishlists(prev => prev.filter(w => w.id !== id));
      setShowDeleteConfirm(false);
      setShowSuccess(true);
    } catch (error) {
      console.error('Delete wishlist error:', error);
      Alert.alert('Lỗi', 'Không thể xóa wishlist. Vui lòng thử lại.');
    } finally {
      setDeletingId(null);
      setSelectedWishlist(null);
    }
  }, []);

  const handleDeletePress = useCallback((wishlist: ApiWishlist) => {
    setSelectedWishlist(wishlist);
    setShowDeleteConfirm(true);
  }, []);

  const courseNameById = useMemo(() => {
    const map = new Map<number, string>();
    for (const c of courses) map.set(c.id, c.name);
    return map;
  }, [courses]);

  const wishlistItems: UiWishlist[] = useMemo(() => {
    return wishlists.map((w) => {
      const subject =
        w.course_id != null
          ? (courseNameById.get(w.course_id) ?? "Môn không tồn tại")
          : "Không chọn môn";

      const price =
        w.max_price && w.max_price > 0
          ? `≤ ${formatVnd(w.max_price)}`
          : "Không giới hạn";

      return {
        title: w.title ?? "",
        subject,
        price,
        createdAt: w.created_at ? formatDateDDMMYYYY(w.created_at) : "",
      };
    });
  }, [wishlists, courseNameById]);

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
          <IconBack />
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

          {wishlistItems.map((item, index) => {
            const wishlist = wishlists[index];
            return (
              <View key={`wishlist-${index}`} className="mb-4">
                <WishlistCard 
                  {...item} 
                  onDelete={() => handleDeletePress(wishlist)}
                  onEdit={() => {
                    router.push({
                      pathname: "/profile/wishlist-edit",
                      params: {
                        id: wishlist.id.toString(),
                        title: wishlist.title,
                        course_id: wishlist.course_id?.toString() || "",
                        max_price: wishlist.max_price?.toString() || "",
                      },
                    });
                  }}
                />
              </View>
            );
          })}

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

      <ConfirmationModal
        visible={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setSelectedWishlist(null);
        }}
        onConfirm={() => selectedWishlist && handleDeleteWishlist(selectedWishlist.id)}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa wishlist này?"
        confirmText="Xác nhận xóa"
        cancelText="Hủy"
        type="delete"
        isLoading={deletingId !== null}
      />

      <SuccessModal
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
        onViewOrder={() => setShowSuccess(false)}
        title="Đã xóa thành công"
        message="Wishlist đã được xóa khỏi danh sách của bạn."
        viewOrderText="Đã hiểu"
        continueText="Đóng"
      />
    </SafeAreaView>
  );
}
