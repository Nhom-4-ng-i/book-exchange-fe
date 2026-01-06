import { CoursesService, LocationsService, OpenAPI, PostsService } from "@/api";
import SuccessModal from "@/components/SuccessModal";
import IconArrowDown from "@/icons/IconArrowDown";
import IconBack from "@/icons/IconBack";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sentry from "@sentry/react-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
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
  return token;
}

const statusOptions = [
  { id: 1, name: "Mới - chưa sử dụng" },
  { id: 2, name: "Chưa đọc - nguyên seal" },
  { id: 3, name: "Khá - đã sử dụng ít" },
  { id: 4, name: "Rách - có dấu hiệu cũ" },
];

export default function EditPostScreen() {
  const router = useRouter();
  const params = useLocalSearchParams() as { id?: string | string[] };

  const idParam = Array.isArray(params.id) ? params.id[0] : params.id;
  const postId = Number(idParam || 0);

  const [initialLoading, setInitialLoading] = useState(true);

  const [image, setImage] = useState<string | null>(null);
  const [imageChanged, setImageChanged] = useState(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const [courses, setCategories] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isCourseModalVisible, setIsCourseModalVisible] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);

  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");

  const [statusDescribe, setStatusDescribe] = useState("");

  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);

  const [locationDescribe, setLocationDescribe] = useState("");

  const [saving, setSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [courseLabel, setCourseLabel] = useState<string>("");
  const [locationLabel, setLocationLabel] = useState<string>("");
  const [statusLabel, setStatusLabel] = useState<string>("");

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Thông báo", "Chúng tôi cần quyền truy cập thư viện ảnh!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageChanged(true);
    }
  };

  function mapBookStatusToOption(bookStatus?: string | null) {
    const s = (bookStatus ?? "").trim().toLowerCase();

    // tùy backend của bạn, chỉnh mapping cho đúng
    if (s === "mới") return statusOptions[0]; // id 1
    if (s.includes("seal") || s.includes("chưa đọc")) return statusOptions[1]; // id 2
    if (s.includes("khá")) return statusOptions[2]; // id 3
    if (s.includes("rách")) return statusOptions[3]; // id 4

    return null;
  }

  const loadCourses = async () => {
    await ensureAuthToken();
    const data = await CoursesService.getCoursesListRouteApiCoursesGet();
    setCategories(Array.isArray(data) ? data : []);
  };

  const loadLocations = async () => {
    await ensureAuthToken();
    const data = await LocationsService.getLocationsListRouteApiLocationsGet();
    setLocations(Array.isArray(data) ? data : []);
  };

  const loadPostDetail = async () => {
    if (!postId || Number.isNaN(postId)) {
      Alert.alert("Lỗi", "Thiếu post id để chỉnh sửa.");
      router.back();
      return null;
    }

    try {
      await ensureAuthToken();
      const p: any = await PostsService.getPostRouteApiPostsPostIdGet(postId);

      // Map từ API về state (tùy backend key)
      setTitle(p?.book_title ?? p?.title ?? "");
      setAuthor(p?.author ?? "");

      setPrice(p?.price != null ? String(p.price) : "");
      setOriginalPrice(
        p?.original_price != null ? String(p.original_price) : ""
      );

      setStatusDescribe(p?.description ?? "");
      setLocationDescribe(p?.location_detail ?? "");

      // Handle image URL - ensure it's a complete URL

      const imageUrl =
        p?.avatar_url === "DefaultAvatarURL" ? null : p?.avatar_url;
      if (imageUrl) {
        // If it's a relative path, prepend the base URL
        const fullImageUrl = imageUrl.startsWith("http")
          ? imageUrl
          : `http://160.187.246.140:8000${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
        setImage(fullImageUrl);
      } else {
        setImage(null);
      }
      setImageChanged(false);

      // chọn status theo book_status_id (nếu backend có)
      const statusId = Number(p?.book_status_id ?? p?.book_statusId ?? NaN);
      if (!Number.isNaN(statusId)) {
        const st = statusOptions.find((x) => x.id === statusId) ?? null;
        setSelectedStatus(st);
      } else {
        setSelectedStatus(null);
      }

      return p;
    } catch (error) {
      Sentry.withScope((scope) => {
        scope.setTag("feature", "EditPost");
        scope.setContext("api", {
          url: "http://160.187.246.140:8000/api/posts/",
          method: "GET",
        });
        scope.setLevel("error");
        Sentry.captureException(error);
      });
      console.error("Error loading post details:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin bài đăng.");
      router.back();
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setInitialLoading(true);

        await ensureAuthToken();

        // 1) Load danh sách (để lookup theo tên)
        const [coursesData, locationsData] = await Promise.all([
          CoursesService.getCoursesListRouteApiCoursesGet(),
          LocationsService.getLocationsListRouteApiLocationsGet(),
        ]);

        const cArr = Array.isArray(coursesData) ? coursesData : [];
        const lArr = Array.isArray(locationsData) ? locationsData : [];

        setCategories(cArr);
        setLocations(lArr);

        // 2) Load chi tiết bài post
        if (!postId || Number.isNaN(postId)) {
          Alert.alert("Lỗi", "Thiếu post id để chỉnh sửa.");
          router.back();
          return;
        }

        const p: any = await PostsService.getPostRouteApiPostsPostIdGet(postId);
        setCourseLabel(p?.course ?? "");
        setLocationLabel(p?.location ?? "");
        setStatusLabel(p?.book_status ?? "");

        // 3) Fill text fields
        setTitle(p?.book_title ?? "");
        setAuthor(p?.author ?? "");
        setPrice(p?.price != null ? String(p.price) : "");
        setOriginalPrice(
          p?.original_price != null ? String(p.original_price) : ""
        );
        setStatusDescribe(p?.description ?? "");
        setLocationDescribe(p?.location_detail ?? "");

        // Handle image URL - ensure it's a complete URL
        const imageUrl = p?.avatar_url;
        if (imageUrl) {
          // If it's a relative path, prepend the base URL
          const fullImageUrl = imageUrl.startsWith("http") ? imageUrl : null;
          setImage(fullImageUrl);
        } else {
          setImage(null);
        }
        setImageChanged(false);

        // 4) Quan trọng: set dropdown theo "tên" trả về từ GET
        const foundCourse = cArr.find(
          (x) => (x?.name ?? "").trim() === (p?.course ?? "").trim()
        );
        setSelectedCourse(foundCourse ?? null);

        const foundLocation = lArr.find(
          (x) => (x?.name ?? "").trim() === (p?.location ?? "").trim()
        );
        setSelectedLocation(foundLocation ?? null);

        const foundStatus = mapBookStatusToOption(p?.book_status);
        setSelectedStatus(foundStatus);
      } catch (e) {
        Sentry.withScope((scope) => {
          scope.setTag("feature", "EditPost");
          scope.setContext("api", {
            url: "http://160.187.246.140:8000/api/posts/",
            method: "GET",
          });
          scope.setLevel("error");
          Sentry.captureException(e);
        });
        console.log("Load post detail error:", e);
        Alert.alert("Lỗi", "Không thể tải chi tiết bài đăng.");
        router.back();
      } finally {
        setInitialLoading(false);
      }
    })();
  }, [postId, router]);

  const handleUpdate = async () => {
    if (
      !title ||
      !selectedCourse ||
      !selectedStatus ||
      !price ||
      !selectedLocation
    ) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ các thông tin có dấu (*)");
      return;
    }

    try {
      setSaving(true);
      const token = await ensureAuthToken();
      if (!token) {
        Alert.alert("Lỗi", "Bạn cần đăng nhập lại.");
        return;
      }

      console.log("Selected course:", selectedCourse);
      console.log("Selected status:", selectedStatus);
      console.log("Selected location:", selectedLocation);

      const formData = new FormData();
      formData.append("book_title", title);
      formData.append("author", author || "Không rõ");
      formData.append("course_id", String(selectedCourse?.id));
      formData.append("book_status_id", String(selectedStatus?.id));
      formData.append("price", String(price));
      formData.append("location_id", String(selectedLocation?.id));
      formData.append("original_price", String(originalPrice || 0));
      formData.append("description", statusDescribe || "Sách còn tốt");
      formData.append("location_detail", locationDescribe || "");

      // chỉ gửi image nếu user đổi ảnh
      if (imageChanged && image) {
        if (image.startsWith("blob:")) {
          const resp = await fetch(image);
          const blob = await resp.blob();
          formData.append("image", blob);
        } else {
          const filename = image.split("/").pop() || "upload.jpg";
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : `image/jpeg`;

          formData.append("image", { uri: image, name: filename, type } as any);
        }
      }

      const res = await fetch(
        `http://160.187.246.140:8000/api/posts/${postId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) {
        console.log("Update error:", data);
        Alert.alert(
          "Thất bại",
          data?.detail?.[0]?.msg || "Không thể cập nhật bài đăng."
        );
        return;
      }

      setShowSuccessModal(true);
    } catch (e) {
      Sentry.withScope((scope) => {
        scope.setTag("feature", "EditPost");
        scope.setContext("api", {
          url: "http://160.187.246.140:8000/api/posts/",
          method: "PUT",
        });
        scope.setLevel("error");
        Sentry.captureException(e);
      });
      console.log("Update error:", e);
      Alert.alert("Lỗi", "Không thể kết nối đến máy chủ.");
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#5E3EA1" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <StatusBar style="dark" />
      <SafeAreaView
        edges={["left", "right", "top"]}
        className="bg-white h-[84px] px-6"
      >
        <View className="flex-row items-center h-full">
          <View className="w-10 items-start">
            <Pressable
              onPress={() => router.back()}
              className="rounded-full p-2 active:opacity-70"
            >
              <IconBack />
            </Pressable>
          </View>

          <View className="flex-1 items-center">
            <Text className="text-xl font-bold text-textPrimary900">
              Chỉnh sửa bài đăng/tài liệu
            </Text>
          </View>

          <View className="w-10" />
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 100,
          paddingTop: 16,
        }}
        className="flex-1"
      >
        {/* Ảnh */}
        <View className="px-6 mt-4 items-center">
          <View className="flex-row w-full mb-3">
            <Text className="text-textGray800 font-semibold">
              Hình ảnh sách/tài liệu
            </Text>
          </View>

          <Pressable
            onPress={pickImage}
            className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden items-center justify-center border-gray-300"
          >
            {image ? (
              <Image
                source={{ uri: image }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="items-center">
                <Ionicons name="camera-outline" size={48} color="#7A7A7A" />
                <Text className="text-textGray600 mt-2 font-medium">
                  Thêm ảnh
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Title */}
        <View className="px-6 mt-4">
          <View className="flex-row mb-3">
            <Text className="text-textGray800 font-semibold">
              Tên sách/tài liệu
            </Text>
            <Text className="font-bold text-[16px] text-red-500 ml-1">*</Text>
          </View>
          <TextInput
            className="h-12 bg-gray-100 rounded-lg px-4 text-gray-800"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Author */}
        <View className="px-6 mt-4">
          <View className="flex-row mb-3">
            <Text className="text-textGray800 font-semibold">Tác giả</Text>
            <Text className="font-bold text-[16px] text-red-500 ml-1">*</Text>
          </View>
          <TextInput
            className="h-12 bg-gray-100 rounded-lg px-4 text-gray-800"
            value={author}
            onChangeText={setAuthor}
          />
        </View>

        {/* Course */}
        <View className="px-6 mt-4">
          <View className="flex-row mb-3">
            <Text className="text-textGray800 font-semibold">Môn học</Text>
            <Text className="font-bold text-[16px] text-red-500 ml-1">*</Text>
          </View>
          <Pressable
            onPress={() => setIsCourseModalVisible(true)}
            className="h-12 bg-gray-100 rounded-lg px-4 flex-row justify-between items-center"
          >
            <Text
              className={selectedCourse ? "text-gray-800" : "text-textGray600"}
            >
              {selectedCourse?.name || courseLabel || "Chọn môn học"}
            </Text>
            <IconArrowDown size={20} color="#9CA3AF" />
          </Pressable>
        </View>

        {/* Status */}
        <View className="px-6 mt-4">
          <View className="flex-row mb-3">
            <Text className="text-textGray800 font-semibold">Tình trạng</Text>
            <Text className="font-bold text-[16px] text-red-500 ml-1">*</Text>
          </View>
          <Pressable
            onPress={() => setIsStatusModalVisible(true)}
            className="h-12 bg-gray-100 rounded-lg px-4 flex-row justify-between items-center"
          >
            <Text
              className={selectedStatus ? "text-gray-800" : "text-textGray600"}
            >
              {selectedStatus?.name || statusLabel || "Chọn tình trạng"}
            </Text>
            <IconArrowDown size={20} color="#9CA3AF" />
          </Pressable>
        </View>

        {/* Price */}
        <View className="flex-row px-6 gap-x-4 mt-4">
          <View className="flex-1">
            <View className="flex-row mb-3">
              <Text className="text-textGray800 font-semibold">Giá bán</Text>
              <Text className="font-bold text-red-500 ml-1">*</Text>
            </View>
            <TextInput
              className="h-12 bg-gray-100 rounded-lg px-4 text-gray-800"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
          </View>
          <View className="flex-1">
            <Text className="text-textGray800 font-semibold mb-2">Giá gốc</Text>
            <TextInput
              className="h-12 bg-gray-100 rounded-lg px-4 text-gray-800"
              keyboardType="numeric"
              value={originalPrice}
              onChangeText={setOriginalPrice}
            />
          </View>
        </View>

        {/* Desc */}
        <View className="px-6 mt-4">
          <Text className="text-textGray800 font-semibold mb-3">
            Mô tả tình trạng
          </Text>
          <TextInput
            className="h-32 bg-gray-100 rounded-lg px-4 py-3 text-gray-800"
            multiline
            textAlignVertical="top"
            value={statusDescribe}
            onChangeText={setStatusDescribe}
          />
        </View>

        {/* Location */}
        <View className="px-6 mt-4">
          <View className="flex-row mb-3">
            <Text className="text-textGray800 font-semibold">
              Địa điểm trường giao dịch
            </Text>
            <Text className="font-bold text-[16px] text-red-500 ml-1">*</Text>
          </View>
          <Pressable
            onPress={() => setIsLocationModalVisible(true)}
            className="h-12 bg-gray-100 rounded-lg px-4 flex-row justify-between items-center"
          >
            <Text
              className={
                selectedLocation ? "text-gray-800" : "text-textGray600"
              }
            >
              {selectedLocation?.name || locationLabel || "Chọn địa điểm"}
            </Text>
            <IconArrowDown size={20} />
          </Pressable>
        </View>

        <View className="px-6 mt-4">
          <Text className="text-textGray800 font-semibold mb-3">
            Mô tả địa điểm nhận
          </Text>
          <TextInput
            className="h-32 bg-gray-100 rounded-lg px-4 py-3 text-gray-800"
            multiline
            textAlignVertical="top"
            value={locationDescribe}
            onChangeText={setLocationDescribe}
          />
        </View>

        <View className="px-6 mt-6 mb-6">
          <Pressable onPress={handleUpdate} disabled={saving}>
            <View
              className={`h-[52px] rounded-full items-center justify-center ${saving ? "bg-gray-400" : "bg-[#6750A4]"}`}
            >
              {saving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">
                  Lưu thay đổi
                </Text>
              )}
            </View>
          </Pressable>
        </View>
      </ScrollView>

      {/* Modals */}
      <Modal
        visible={isCourseModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsCourseModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl h-[60%] p-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">Danh sách môn học</Text>
              <Pressable onPress={() => setIsCourseModalVisible(false)}>
                <Ionicons name="close" size={24} color="black" />
              </Pressable>
            </View>

            <FlatList
              data={courses}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setSelectedCourse(item);
                    setCourseLabel(item.name);
                    setIsCourseModalVisible(false);
                  }}
                  className="py-4 border-b border-gray-100"
                >
                  <Text
                    className={`text-base ${selectedCourse?.id === item.id ? "text-purple-700 font-bold" : "text-gray-700"}`}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={isStatusModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsStatusModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl h-[45%] p-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">Tình trạng sách</Text>
              <Pressable onPress={() => setIsStatusModalVisible(false)}>
                <Ionicons name="close" size={24} color="black" />
              </Pressable>
            </View>

            <FlatList
              data={statusOptions}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setSelectedStatus(item);
                    setStatusLabel(item.name);
                    setIsStatusModalVisible(false);
                  }}
                  className="py-4 border-b border-gray-100"
                >
                  <Text
                    className={`text-base ${selectedStatus?.id === item.id ? "text-purple-700 font-bold" : "text-gray-700"}`}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={isLocationModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsLocationModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl h-[60%] p-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">Danh sách địa điểm</Text>
              <Pressable onPress={() => setIsLocationModalVisible(false)}>
                <Ionicons name="close" size={24} color="black" />
              </Pressable>
            </View>

            <FlatList
              data={locations}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setSelectedLocation(item);
                    setLocationLabel(item.name);
                    setIsLocationModalVisible(false);
                  }}
                  className="py-4 border-b border-gray-100"
                >
                  <Text
                    className={`text-base ${selectedLocation?.id === item.id ? "text-purple-700 font-bold" : "text-gray-700"}`}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.back();
        }}
        onViewOrder={() => {
          setShowSuccessModal(false);
          router.back();
        }}
        title="Cập nhật thành công!"
        message="Bài đăng của bạn đã được cập nhật thành công."
        viewOrderText="Xem bài đăng"
        continueText="Quay lại"
      />
    </KeyboardAvoidingView>
  );
}
