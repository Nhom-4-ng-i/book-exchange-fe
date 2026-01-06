import ConfirmationModal from "@/components/ConfirmationModal";
import * as Sentry from "@sentry/react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { PostsService, UserService } from "@/api";
import PostDetailModal from "@/components/posts/PostDetailModal";
import { PostCard } from "@/components/profile/PostCard";
import SuccessModal from "@/components/SuccessModal";
import IconBack from "@/icons/IconBack";

type MyPost = {
  id: number;
  book_title: string;
  course: string;
  book_status: string;
  price: number | string;
  status: string;
  avatar_url?: string;
};

export default function MyPostsScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [sellingPosts, setSellingPosts] = useState<MyPost[]>([]);
  const [soldPosts, setSoldPosts] = useState<MyPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchMyPosts();
    }, [])
  );

  const formatPrice = (price: number | string) => {
    if (typeof price === "number") {
      return `${price.toLocaleString("vi-VN")}đ`;
    }
    return price;
  };

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
      Sentry.withScope((scope) => {
        scope.setTag("feature", "MyPostsScreen");
        scope.setContext("api", {
          url: "http://160.187.246.140:8000/api/posts/",
          method: "GET",
        });
        scope.setLevel("error");
        Sentry.captureException(e);
      });
      console.log("Load my posts error:", e);
      setError("Không thể tải danh sách bài đăng.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDeleteClick = useCallback((postId: number) => {
    setPostToDelete(postId);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!postToDelete) return;

    console.log(`Bắt đầu xóa bài đăng có ID: ${postToDelete}`);
    setIsDeleting(true);

    try {
      console.log(`Đang gửi yêu cầu xóa bài đăng ID: ${postToDelete}`);
      const apiUrl = `/api/posts/${postToDelete}/cancel`;
      console.log("Gọi API:", apiUrl);

      const response =
        await PostsService.cancelPostRouteApiPostsPostIdCancelPost(
          postToDelete
        ).catch((err) => {
          Sentry.withScope((scope) => {
            scope.setTag("feature", "MyPostsScreen");
            scope.setContext("api", {
              url: "http://160.187.246.140:8000/api/posts/",
              method: "PUT",
            });
            scope.setLevel("error");
            Sentry.captureException(err);
          });
          console.error("Lỗi chi tiết từ API:", {
            message: err.message,
            status: err.status,
            response: err.body,
            url: err.url,
            method: err.method,
          });
          throw err;
        });

      console.log("Phản hồi từ server khi xóa:", response);
      console.log("Làm mới danh sách bài đăng...");

      await fetchMyPosts();
      setPostToDelete(null);
      setShowSuccess(true);
    } catch (error) {
      Sentry.withScope((scope) => {
        scope.setTag("feature", "MyPostsScreen");
        scope.setContext("api", {
          url: "http://160.187.246.140:8000/api/posts/",
          method: "PUT",
        });
        scope.setLevel("error");
        Sentry.captureException(error);
      });
      console.error("Lỗi khi xóa bài đăng:", { error });

      let errorMessage = "Không thể xóa bài đăng. Vui lòng thử lại sau.";
      if ((error as any).status === 401) {
        errorMessage = "Bạn cần đăng nhập lại để thực hiện thao tác này.";
      } else if ((error as any).status === 404) {
        errorMessage = "Không tìm thấy bài đăng này.";
      } else if ((error as any).status === 403) {
        errorMessage = "Bạn không có quyền xóa bài đăng này.";
      }

      Alert.alert("Lỗi", errorMessage);
    } finally {
      setIsDeleting(false);
    }
  }, [postToDelete]);

  const handleCancelDelete = useCallback(() => {
    setPostToDelete(null);
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
      edges={["left", "right", "bottom", "top"]}
    >
      <StatusBar style="dark" />
      <View className="flex-row items-center justify-between px-6 py-2 h-16">
        <Pressable
          onPress={() => router.back()}
          className="rounded-full p-2 active:opacity-70"
        >
          <IconBack />
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
            <Pressable
              key={item.id}
              onPress={() => {
                setSelectedPostId(item.id);
                setDetailVisible(true);
              }}
            >
              <PostCard
                id={item.id}
                title={item.book_title}
                category={item.course}
                condition={item.book_status}
                price={formatPrice(item.price)}
                status={item.status}
                thumbnailUrl={item.avatar_url}
                onDelete={handleDeleteClick}
                onEdit={() => {
                  router.push({
                    pathname: "/profile/edit-post",
                    params: { id: String(item.id) },
                  });
                }}
              />
            </Pressable>
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
              id={item.id}
              title={item.book_title}
              category={item.course}
              condition={item.book_status}
              price={formatPrice(item.price)}
              status={item.status}
              thumbnailUrl={item.avatar_url}
              onEdit={(id) => {}}
              onDelete={handleDeleteClick}
            />
          ))}
          {soldPosts.length === 0 && (
            <Text className="text-bodyMedium text-textGray500">
              Chưa có cuốn nào được đánh dấu đã bán.
            </Text>
          )}
        </View>
      </ScrollView>

      <ConfirmationModal
        visible={!!postToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa bài đăng"
        message="Bạn có chắc chắn muốn xóa bài đăng này?"
        confirmText="Xóa"
        cancelText="Hủy"
        type="delete"
        isLoading={isDeleting}
      />

      <SuccessModal
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
        onViewOrder={() => setShowSuccess(false)}
        title="Xóa bài đăng thành công!"
        message="Bài đăng đã được xóa khỏi danh sách của bạn."
        viewOrderText="Đã hiểu"
        continueText="Đóng"
      />
      <PostDetailModal
        visible={detailVisible}
        postId={selectedPostId} // quan trọng: dùng GET /api/posts/{post_id}
        onClose={() => {
          setDetailVisible(false);
          setSelectedPostId(null);
        }}
        renderActions={(post) => (
          <>
            <Pressable
              className="w-full bg-white border border-[#54408C] h-[54px] rounded-full items-center justify-center"
              onPress={() => {
                router.push({
                  pathname: "/profile/edit-post",
                  params: { id: String(post.id) },
                });
              }}
            >
              <Text className="text-[#54408C] font-bold text-lg">
                Chỉnh sửa
              </Text>
            </Pressable>

            <Pressable
              className="w-full bg-[#54408C] h-[54px] rounded-full items-center justify-center"
              onPress={() => {
                setDetailVisible(false);
                setSelectedPostId(null);
              }}
            >
              <Text className="text-white font-bold text-lg">Hủy bỏ</Text>
            </Pressable>
          </>
        )}
      />
    </SafeAreaView>
  );
}
