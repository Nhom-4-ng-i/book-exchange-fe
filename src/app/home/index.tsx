import { CoursesService, OpenAPI, PostsService } from "@/api";
import BottomNav from "@/components/BottomNav";
import HeaderHome from "@/components/HeaderHome";
import IconSearch from '@/icons/IconSearch';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Header } from "@react-navigation/elements";
import * as Sentry from "@sentry/react-native";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  TextInput,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

async function ensureAuthToken() {
  const token = await AsyncStorage.getItem("access_token");
  
  if (token) {
    OpenAPI.BASE = "http://160.187.246.140:8000";
    OpenAPI.TOKEN = token;
  }
}

export default function Index() {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // null = Tất cả
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseName, setSelectedCourseName] = useState("Môn học");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  
  const [searchType, setSearchType] = useState<'bookTitle' | 'author' | 'courseId'>('bookTitle');

  const [searchLabel, setSearchLabel] = useState("Tên sách");

  const loadPosts = async () => {
    try {
      await ensureAuthToken();

      const response = await PostsService.getPostsListRouteApiPostsGet(
        ["SELLING"], // status
        searchType === 'bookTitle' ? searchQuery : null, // bookTitle
        searchType === 'author' ? searchQuery : null, // author
        null, // bookStatus
        searchType === 'courseId' ? Number(searchQuery) : null, // courseId
        null, // locationId
        null, // minPrice
        null, // maxPrice
        null, // sortBy
        0, // offset
        100 // limit
      );

      setPosts(response);
    } catch (err: any) {
      if (err.name === "ApiError") {
        console.log("API STATUS:", err.status);
        console.log("API URL:", err.url);
        console.log("API BODY:", err.body);
      } else {
        console.log("Unknown error:", err);
      }
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
        console.log("Unknown error:", err);
      }
      setCategories([]);
    }
  }

  useEffect(() => {
    loadCourses();
    loadPosts();
  }, []);

  const filteredPosts = posts
    .filter((post) => post.status !== null)
    .filter((post) => {
      if (!selectedCategory) return true;

      const courseNameFromPost =
        post.course_name || post.course || post.courseName || "";

      // console.log("courseNameFromPost:", courseNameFromPost);
      // console.log("selectedCategory:", selectedCategory);
      return courseNameFromPost === selectedCategory;
    });

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
  <View className="px-4 py-2 bg-white">
    <View className="flex-row items-center bg-[#F2E7E7] rounded-full px-4 h-12 border border-gray-100">
      <View className="flex-1 flex-row items-center">
        <IconSearch />
        <TextInput
          className="flex-1 ml-2 text-base text-gray-700"
          placeholder={`Tìm theo ${searchLabel.toLowerCase()}...`}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={loadPosts}
        />
      </View>

      <View className="w-[1px] h-6 bg-gray-300 mx-2" />

      {/* Nút chọn tiêu chí */}
      <Pressable 
        className="flex-row items-center pr-2"
        onPress={() => setIsDropdownVisible(true)}
      >
        <Text className="text-gray-500 mr-1">{searchLabel}</Text>
        <Text className="text-[10px]">▼</Text>
      </Pressable>
    </View>
    
    <Pressable onPress={() => setIsSearching(false)} className="mt-2">
      <Text className="text-center text-purple-600">Hủy</Text>
    </Pressable>
  </View>
) : <HeaderHome title = 'Trang chủ'  onSearchPress={() => setIsSearching(true)}/>}

{/* Modal chọn tiêu chí (Dropdown) */}
<Modal visible={isDropdownVisible} transparent>
  <Pressable className="flex-1 bg-black/20 justify-center items-center" onPress={() => setIsDropdownVisible(false)}>
    <View className="bg-white w-[70%] rounded-xl p-4">
      <Text className="font-bold mb-4">Tìm kiếm theo:</Text>
      
      <Pressable className="py-3 border-b border-gray-100" 
        onPress={() => { setSearchType('bookTitle'); setSearchLabel('Tên sách'); setIsDropdownVisible(false); }}>
        <Text>Tên sách</Text>
      </Pressable>

      <Pressable className="py-3 border-b border-gray-100" 
        onPress={() => { setSearchType('author'); setSearchLabel('Tác giả'); setIsDropdownVisible(false); }}>
        <Text>Tác giả</Text>
      </Pressable>

      <Pressable className="py-3" 
        onPress={() => { setSearchType('courseId'); setSearchLabel('Mã môn'); setIsDropdownVisible(false); }}>
        <Text>Mã môn học</Text>
      </Pressable>
    </View>
  </Pressable>
</Modal>
      {/* ##################################### */}

      <ScrollView className="flex-1" contentContainerClassName="pb-24">
        <View className="px-4 mb-4 mt-4">
          <Pressable
            className="w-full py-3 bg-textPrimary500 items-center justify-center text-white font-bold rounded-lg tracking-wide"
            onPress={() => {
              console.log(
                "=== TEST SENTRY: Crash tại nút + Đăng sách/tài liệu mới ==="
              );

              Sentry.captureMessage(
                "Test Sentry từ nút + Đăng sách/tài liệu mới – Nhóm 4 test crash"
              );

              Sentry.captureException(
                new Error(
                  "SENTRY ERROR: Crash test – nút + Đăng sách/tài liệu mới (error + sourcemaps + performance)"
                )
              );

              throw new Error(
                "CRASHED: Crash test từ màn hình Đăng Sách/Tài Liệu – Sentry test"
              );
            }}
          >
            <Text className="text-white font-bold text-base tracking-wide">
              + Đăng sách/tài liệu mới
            </Text>
          </Pressable>
        </View>

        <View className="mb-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="px-4 flex-row gap-2"
          >
            <Pressable
              className={`px-2 py-1 rounded-lg ${
                !selectedCategory ? "bg-gray-500/20" : "border border-[#E5E5E5]"
              }`}
              onPress={() => setSelectedCategory(null)}
            >
              <Text className="text-sm text-gray-800">Tất cả</Text>
            </Pressable>

            {categories.map((c: any, index: number) => (
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

        <View className="px-4 mb-6">
          <Text className="text-lg font-bold tracking-tight text-gray-900">
            Danh sách
          </Text>
        </View>

        <View className="px-4">
          <View className="flex-row flex-wrap justify-between">
            {filteredPosts.length === 0 ? (
              <Text className="text-center text-gray-500 w-full">
                Không có bài đăng.
              </Text>
            ) : (
              filteredPosts.map((post) => (
                <Pressable key={post.id} className="w-[48%] mb-8">
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
                          {post.book_status || "Không rõ"}
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

      <BottomNav />
    </SafeAreaView>
  );
}
