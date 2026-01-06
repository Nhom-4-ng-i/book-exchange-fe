import { CoursesService, OpenAPI, OrdersService, PostsService } from "@/api";
import BottomNav from "@/components/BottomNav";
import HeaderHome from "@/components/HeaderHome";
import PostDetailModal from "@/components/posts/PostDetailModal";
import IconArrowDown from "@/icons/IconArrowDown";
import IconBack from "@/icons/IconBack";
import IconSearch from "@/icons/IconSearch";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sentry from "@sentry/react-native";
import { useFocusEffect, useRouter } from "expo-router";

import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

async function ensureAuthToken() {
  const token = await AsyncStorage.getItem("access_token");
  if (token) {
    OpenAPI.BASE = "http://160.187.246.140:8000";
    OpenAPI.TOKEN = token;
  }
}
const formatVND = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
const getStatusColor = (code: string) => {
  switch (code) {
    case "COMPLETED":
      return "bg-green-100 text-green-700";
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};
interface OrderItem {
  order_id: number;
  title: string;
  author: string;
  price: number;
  book_status: string;
  course: string;
  location: string;
  seller_name: string;
  seller_phone: string | null;
  buyer_name: string;
  buyer_phone: string;
  order_status: string;
  order_status_code: "COMPLETED" | "PENDING" | "CANCELLED";
  order_time: string;
  post_status: string;
  avatar_url: string;
}
export default function Index() {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // null = Tất cả
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [searchType, setSearchType] = useState<
    | "title"
    | "author"
    | "course"
    | "location"
    | "min_price"
    | "max_price"
    | "sort_by"
    | "offset"
  >("title");
  const [searchLabel, setSearchLabel] = useState("Tên sách");
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const route = useRouter();
  const [orderLoading, setOrderLoading] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [bellTick, setBellTick] = useState(0);

  const handleCreateOrder = async (postId: number) => {
    try {
      setOrderLoading(true);

      await ensureAuthToken();
      await OrdersService.insertOrderRouteApiOrdersPost({
        post_id: postId,
        buyer_note: "",
      });

      setIsDetailModalVisible(false);
      setIsSuccessModalVisible(true);
    } catch (err) {
      Sentry.withScope((scope) => {
        scope.setTag("feature", "Home");
        scope.setContext("api", {
          url: "http://160.187.246.140:8000/api/orders/",
          method: "POST",
        });
        scope.setLevel("error");
        Sentry.captureException(err);
      });
      Alert.alert("Thông báo", "Có lỗi xảy ra khi đặt hàng, vui lòng thử lại.");
    } finally {
      setOrderLoading(false);
    }
  };

  const openDetail = (post: any) => {
    console.log(post);
    setSelectedPost(post);
    setIsDetailModalVisible(true);
  };
  type SearchType =
    | "title"
    | "author"
    | "course"
    | "location"
    | "min_price"
    | "max_price"
    | "sort_by"
    | "offset";

  const loadPosts = async (opts?: { query?: string; type?: SearchType }) => {
    try {
      setLoading(true);
      await ensureAuthToken();

      const q = (opts?.query ?? searchQuery).trim();
      const t = opts?.type ?? searchType;

      const titleParam = t === "title" && q ? q : null;
      const authorParam = t === "author" && q ? q : null;
      const courseIdParam =
        t === "course" && q && !isNaN(Number(q)) ? Number(q) : null;

      const response = await PostsService.getPostsListRouteApiPostsGet(
        titleParam,
        authorParam,
        null,
        courseIdParam,
        null,
        null,
        null,
        null,
        0,
        100
      );

      setPosts(response);
    } catch (err) {
      Sentry.withScope((scope) => {
        scope.setTag("feature", "Home");
        scope.setContext("api", {
          url: "http://160.187.246.140:8000/api/posts/",
          method: "GET",
        });
        scope.setLevel("error");
        Sentry.captureException(err);
      });
      console.error("Lỗi khi tải danh sách bài đăng:", err);
    } finally {
      setLoading(false);
    }
  };

  async function loadCourses() {
    try {
      await ensureAuthToken();

      const courses = await CoursesService.getCoursesListRouteApiCoursesGet();
      console.log("CATEGORIES / COURSES:", courses);
      setCategories(courses);
    } catch (err: any) {
      if (err.name === "ApiError") {
        console.log("API STATUS:", err.status);
        console.log("API URL:", err.url);
        console.log("API BODY:", err.body);
      } else {
        Sentry.withScope((scope) => {
          scope.setTag("feature", "Home");
          scope.setContext("api", {
            url: "http://160.187.246.140:8000/api/courses/",
            method: "GET",
          });
          scope.setLevel("error");
          Sentry.captureException(err);
        });
        console.log("Unknown error:", err);
      }
      setCategories([]);
    }
  }
  useEffect(() => {
    loadCourses();
    loadPosts();
  }, []);
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      !selectedCategory ||
      (post.course_name || post.course) === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!isSearching || query === "") {
      return matchesCategory;
    }
    let matchesSearch = false;
    if (searchType === "title") {
      matchesSearch = post.title?.toLowerCase().includes(query);
    } else if (searchType === "author") {
      matchesSearch = post.author?.toLowerCase().includes(query);
    } else if (searchType === "course") {
      const courseInfo = (post.course || post.course_name || "").toLowerCase();
      matchesSearch = courseInfo.includes(query);
    }

    return matchesCategory && matchesSearch;
  });
  useFocusEffect(
    useCallback(() => {
      setBellTick((t) => t + 1);
    }, [])
  );

  // const filteredPosts = posts
  //   .filter((post) => post.status !== null)
  //   .filter((post) => {
  //     if (!selectedCategory) return true;

  //     const courseNameFromPost =
  //       post.course_name || post.course || post.courseName || "";

  //     // console.log("courseNameFromPost:", courseNameFromPost);
  //     // console.log("selectedCategory:", selectedCategory);
  //     return courseNameFromPost === selectedCategory;
  //   });

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

      {/* ################################### */}
      {isSearching ? (
        <SafeAreaView
          edges={["left", "right", "top"]}
          className="bg-white h-[84px] px-6"
        >
          <View className="flex-row items-center h-full">
            {/* Back */}
            <Pressable
              onPress={() => {
                setIsSearching(false);
                setSearchQuery("");
                setSelectedCategory(null);
                setIsDropdownVisible(false);
                setSearchType("title");
                setSearchLabel("Tên sách");
                loadPosts({ query: "", type: "title" });
              }}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              className="mr-3 p-2 rounded-full active:opacity-70"
            >
              <IconBack />
            </Pressable>

            <View className="flex-1 flex-row items-center bg-gray-100 rounded-[10px] px-3 h-10">
              <IconSearch color="#A6A6A6" />

              <TextInput
                className="flex-1 ml-2 text-[16px] text-gray-900 h-full text-sm pb-[10px]"
                placeholder="Tìm kiếm"
                placeholderTextColor="#b3b3b3"
                value={searchQuery}
                autoFocus
                onChangeText={setSearchQuery}
                onSubmitEditing={() => loadPosts()}
                returnKeyType="search"
              />

              <View className="w-[1px] h-5 bg-gray-300 mx-2" />

              <Pressable
                className="flex-row items-center py-1"
                onPress={() => setIsDropdownVisible(true)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text className="text-gray-500 text-[12px] mr-1">
                  {searchLabel}
                </Text>
                <IconArrowDown size={16} />
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      ) : (
        <HeaderHome
          title="Trang chủ"
          onSearchPress={() => setIsSearching(true)}
          bellTick={bellTick}
        />
      )}

      {/* Modal chọn tiêu chí (Dropdown) */}
      <PostDetailModal
        visible={isDetailModalVisible}
        initialPost={selectedPost} // list đã có data sẵn
        postId={selectedPost?.id} // để modal fetch full detail (phone/desc/...)
        onClose={() => {
          setIsDetailModalVisible(false);
          setSelectedPost(null);
        }}
        renderActions={(post) => (
          <>
            <Pressable
              className="w-full bg-[#54408C] h-[54px] rounded-full items-center justify-center shadow-sm"
              onPress={() => handleCreateOrder(post.id)}
              disabled={orderLoading}
            >
              {orderLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">Đặt mua</Text>
              )}
            </Pressable>

            <Pressable
              className="w-full bg-white border border-[#54408C] h-[54px] rounded-full items-center justify-center"
              onPress={() => {
                const phone = post.seller_phone;
                if (phone) Linking.openURL(`tel:${phone}`);
              }}
              disabled={!post.seller_phone}
            >
              <Text className="text-[#54408C] font-bold text-lg">Liên hệ</Text>
            </Pressable>
          </>
        )}
      />

      {/* ##################################### */}

      <ScrollView className="flex-1" contentContainerClassName="pb-24">
        {!isSearching && (
          <View className="px-6 mb-4 mt-4">
            <Pressable
              className="w-full py-3 bg-textPrimary500 items-center justify-center text-white font-bold rounded-lg tracking-wide"
              onPress={() => {
                console.log(route);
                route.push("/home/addPost");
              }}
            >
              <Text className="text-white font-bold text-base tracking-wide">
                + Đăng sách/tài liệu mới
              </Text>
            </Pressable>
          </View>
        )}

        <View className="mb-3">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="px-6 flex-row gap-2"
          >
            {!isSearching && (
              <Pressable
                className={`px-2 py-1 rounded-lg ${
                  !selectedCategory
                    ? "bg-gray-500/20"
                    : "border border-[#E5E5E5]"
                }`}
                onPress={() => setSelectedCategory(null)}
              >
                <Text className="text-sm text-gray-800">Tất cả</Text>
              </Pressable>
            )}

            {!isSearching &&
              categories.map((c: any, index: number) => (
                <Pressable
                  key={index}
                  className={`px-2 py-1 rounded-lg ${
                    selectedCategory === c.name
                      ? "bg-gray-500/20"
                      : "border border-[#E5E5E5]"
                  }`}
                  onPress={() => setSelectedCategory(c.name)}
                >
                  <Text className="text-sm text-gray-800">{c.name}</Text>
                </Pressable>
              ))}
          </ScrollView>
        </View>
        {!isSearching && (
          <View className="px-6 mb-3">
            <Text className="text-heading5 font-semibold tracking-tight text-gray-900">
              Danh sách
            </Text>
          </View>
        )}

        <View className="px-6">
          <View
            className={`flex-row flex-wrap justify-between ${isSearching ? "mt-6" : ""}`}
          >
            {filteredPosts.length === 0 ? (
              <Text className="text-center text-gray-500 w-full">
                Không có bài đăng.
              </Text>
            ) : (
              filteredPosts.map((post) => (
                <Pressable
                  key={post.id}
                  className="w-[48%] mb-4"
                  onPress={() => openDetail(post)}
                >
                  <View className="flex-col">
                    <View className="relative mb-2">
                      <Image
                        source={{
                          uri:
                            post.avatar_url === "DefaultAvatarURL"
                              ? "https://api.builder.io/api/v1/image/assets/TEMP/52fd2ccb12a0cc8215ea23e7fce4db059c2ca1aa?width=328"
                              : post.avatar_url,
                        }}
                        className="w-full aspect-[164/256] object-cover rounded-lg"
                        resizeMode="cover"
                      />
                      <View className="absolute top-2 left-2 px-2 py-0.5 bg-white rounded-lg">
                        <Text className="text-xs text-gray-800">
                          {post.book_status}
                        </Text>
                      </View>
                    </View>

                    <Text className="text-sm text-gray-900 mb-1">
                      {post.title}
                    </Text>

                    <View className="flex-row items-center gap-2">
                      <Text className="text-xs font-bold text-textPrimary500 tracking-wide">
                        {post.price?.toLocaleString("vi-VN")}đ
                      </Text>

                      {post.original_price > post.price && (
                        <Text className="text-xs text-gray-500 line-through">
                          {post.original_price?.toLocaleString("vi-VN")}đ
                        </Text>
                      )}
                    </View>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        </View>
      </ScrollView>
      <Modal
        visible={isSuccessModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View className="flex-1 bg-black/60 justify-center items-center px-[14px]">
          <View className="bg-white w-full rounded-[24px] p-6 items-center">
            {/* Icon Thành Công */}
            <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="checkmark-circle" size={60} color="#10B981" />
            </View>

            <Text className="text-[20px] font-bold text-gray-900 mb-2">
              Đặt mua thành công!
            </Text>
            <Text className="text-gray-500 text-center mb-8 px-4">
              Yêu cầu của bạn đã được gửi đến người bán. Bạn có thể theo dõi đơn
              hàng trong Giỏ hàng.
            </Text>

            <View className="w-full gap-y-3">
              <Pressable
                className="w-full bg-[#54408C] h-[52px] rounded-full items-center justify-center"
                onPress={() => {
                  setIsSuccessModalVisible(false);
                  route.push("/cart");
                }}
              >
                <Text className="text-white font-bold text-base">
                  Xem đơn hàng
                </Text>
              </Pressable>

              <Pressable
                className="w-full h-[52px] items-center justify-center"
                onPress={() => setIsSuccessModalVisible(false)}
              >
                <Text className="text-gray-400 font-medium">
                  Tiếp tục mua sắm
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {!isSearching && <BottomNav />}
    </SafeAreaView>
  );
}
