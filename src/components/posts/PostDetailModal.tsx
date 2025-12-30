import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { OpenAPI, PostsService } from "@/api";
import IconLocation from "@/icons/IconLocation";
import IconPhone from "@/icons/PhoneIcon";

async function ensureAuthToken() {
  const token = await AsyncStorage.getItem("access_token");
  if (token) {
    OpenAPI.BASE = "http://160.187.246.140:8000";
    OpenAPI.TOKEN = token;
  }
}

const formatVND = (price?: number | null) => {
  if (price == null) return "";
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  } catch (e) {
    return dateString;
  }
};

type UiPost = {
  id: number;
  title: string;
  author?: string | null;
  course?: string | null;
  course_name?: string | null;

  price?: number | null;
  original_price?: number | null;
  book_status?: string | null;
  description?: string | null;

  location?: string | null;

  seller_name?: string | null;
  seller_phone?: string | null;

  avatar_url?: string | null;
  created_at?: string | null;
};

function normalizePost(p: any): UiPost {
  // “list posts” vs “get post” vs “my posts” có thể khác key
  return {
    id: Number(p?.id),
    title: p?.title ?? p?.book_title ?? "",
    author: p?.author ?? null,
    course: p?.course ?? null,
    course_name: p?.course_name ?? null,

    price:
      typeof p?.price === "number" ? p.price : Number(p?.price ?? NaN) || null,
    original_price:
      typeof p?.original_price === "number"
        ? p.original_price
        : Number(p?.original_price ?? NaN) || null,

    book_status: p?.book_status ?? null,
    description: p?.description ?? null,
    location: p?.location ?? null,

    seller_name: p?.seller_name ?? null,
    seller_phone: p?.seller_phone ?? null,

    avatar_url: p?.avatar_url ?? null,
    created_at: p?.created_at ?? p?.order_time ?? null,
  };
}

type Props = {
  visible: boolean;
  postId?: number | null; // ưu tiên dùng cái này trong MyPosts
  initialPost?: any; // dùng nếu bạn đã có data sẵn (Home list)
  onClose: () => void;

  // render footer actions (nút Đặt mua / Sửa / Xóa / Đánh dấu đã bán...)
  renderActions?: (post: UiPost) => React.ReactNode;
};

export default function PostDetailModal({
  visible,
  postId,
  initialPost,
  onClose,
  renderActions,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState<UiPost | null>(
    initialPost ? normalizePost(initialPost) : null
  );

  const effectiveId = useMemo(() => {
    if (postId != null) return postId;
    if (initialPost?.id != null) return Number(initialPost.id);
    return null;
  }, [postId, initialPost]);

  useEffect(() => {
    let mounted = true;

    async function fetchDetail() {
      if (!visible) return;
      if (effectiveId == null) return;

      // Nếu đã có initialPost thì vẫn nên fetch để có đủ field (phone/desc/...)
      try {
        setLoading(true);
        await ensureAuthToken();
        const res =
          await PostsService.getPostRouteApiPostsPostIdGet(effectiveId);
        if (!mounted) return;
        setPost(normalizePost(res));
      } catch (e) {
        // Nếu lỗi, vẫn giữ initialPost để UI không trống
        if (!mounted) return;
        if (!post && initialPost) setPost(normalizePost(initialPost));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchDetail();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, effectiveId]);

  const imgUri =
    post?.avatar_url === "DefaultAvatarURL" || !post?.avatar_url
      ? "https://api.builder.io/api/v1/image/assets/TEMP/52fd2ccb12a0cc8215ea23e7fce4db059c2ca1aa?width=328"
      : post.avatar_url;

  const courseLabel = post?.course ?? post?.course_name ?? "";

  const savingPercent =
    post?.original_price && post?.price && post.original_price > post.price
      ? Math.round(
          ((post.original_price - post.price) / post.original_price) * 100
        )
      : null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <Pressable className="flex-1" onPress={onClose} />

        <View className="bg-white h-[85%] rounded-t-[32px] overflow-hidden">
          <View className="items-center py-3">
            <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </View>

          {loading && !post ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#5E3EA1" />
            </View>
          ) : (
            <>
              <ScrollView className="flex-1 px-6 pb-10">
                {post && (
                  <>
                    <View
                      style={{ borderRadius: 16, overflow: "hidden" }}
                      className="justify-center items-center mb-4"
                    >
                      <Image
                        source={{ uri: imgUri }}
                        style={{
                          width: 237,
                          height: 313,
                          borderRadius: 16,
                          overflow: "hidden",
                        }}
                        resizeMode="cover"
                      />
                    </View>

                    <Text className="text-heading4 font-bold mt-4">
                      {post.title}
                    </Text>

                    <View className="flex-row gap-4 mt-2">
                      {!!post.author && (
                        <Text className="text-textGray700 text-bodyMedium">
                          Tác giả: {post.author}
                        </Text>
                      )}
                      {!!courseLabel && (
                        <Text className="text-textGray700 text-bodyMedium">
                          Tên môn: {courseLabel}
                        </Text>
                      )}
                    </View>

                    <View className="flex-row items-baseline gap-2 mt-2">
                      <Text className="text-[#54408C] font-bold text-heading3">
                        {formatVND(post.price)}đ
                      </Text>
                      {!!post.original_price &&
                        post.original_price > (post.price ?? 0) && (
                          <Text className="text-textGray400 text-bodyMedium line-through ml-2">
                            {formatVND(post.original_price)}đ
                          </Text>
                        )}
                    </View>

                    {savingPercent != null && (
                      <View className="py-2 rounded-md self-start">
                        <Text className="text-textGreen text-bodyMedium">
                          Tiết kiệm {savingPercent}%
                        </Text>
                      </View>
                    )}

                    <Text className="text-bodyMedium text-textGray700 mt-2">
                      Mô tả
                    </Text>
                    <Text className="text-textGray500 mt-2">
                      {"Trạng thái: " + post.book_status}
                    </Text>
                    <Text className="text-textGray500">
                      Chi tiết tình trạng:{" "}
                      {post.description || "Chưa có mô tả."}
                    </Text>

                    <View className="h-[1px] bg-gray-200 w-full my-4" />

                    <Text className="text-bodyMedium text-textGray700">
                      Thông tin giao dịch
                    </Text>

                    <View className="flex-row items-center mb-4 mt-4">
                      <View className="w-8">
                        <IconLocation size={15} />
                      </View>
                      <Text className="text-textGray500 flex-1">
                        {post.location || "Khu A - ĐHBK"}
                      </Text>
                    </View>

                    <Pressable
                      className="flex-row items-center"
                      onPress={() => {
                        const phone = post.seller_phone;
                        if (!phone) return;
                        Linking.openURL(`tel:${phone}`);
                      }}
                      disabled={!post.seller_phone}
                    >
                      <View className="w-8">
                        <IconPhone size={16} />
                      </View>
                      <Text className="text-textGray500 flex-1">
                        {post.seller_phone || "Chưa có số điện thoại"}
                      </Text>
                    </Pressable>

                    <View className="h-[1px] bg-gray-200 w-full my-4" />

                    <Text className="text-bodyMedium text-textGray700 mb-4">
                      Người bán
                    </Text>
                    <View className="flex-row items-center mb-10">
                      <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center">
                        <Ionicons name="person" size={24} color="#54408C" />
                      </View>
                      <View className="ml-3 gap-2">
                        <Text className=" text-textGray700 text-bodyMedium">
                          {post.seller_name || "Chưa cập nhật"}
                        </Text>
                        {!!post.created_at && (
                          <Text className="text-textGray500 text-bodyMedium">
                            Đăng {formatDate(post.created_at)}
                          </Text>
                        )}
                      </View>
                    </View>
                  </>
                )}
              </ScrollView>

              {post && (
                <View className="p-4 bg-white gap-y-3">
                  {renderActions ? renderActions(post) : null}
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
