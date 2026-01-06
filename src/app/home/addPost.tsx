import { CoursesService, LocationsService, OpenAPI } from "@/api";
import SuccessModal from "@/components/SuccessModal";
import IconArrowDown from "@/icons/IconArrowDown";
import IconBack from "@/icons/IconBack";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
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
}
const statusOptions = [
  { id: 1, name: "Mới - chưa sử dụng" },
  { id: 2, name: "Chưa đọc - nguyên seal" },
  { id: 3, name: "Khá - đã sử dụng ít" },
  { id: 4, name: "Rách - có dấu hiệu cũ" },
];

interface InsertPostRequest {
  book_title: string;
  author: string;
  course_id: number;
  book_status_id: number;
  price: number;
  location_id: number;
  original_price?: number;
  description: string;
  location_detail: string;
  avatar_url: string;
}

export default function AddPost() {
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [courses, setCategories] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
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
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Thông báo", "Chúng tôi cần quyền truy cập thư viện ảnh!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result.assets[0].uri);
      setImage(result.assets[0].uri);
    }
  };

  const loadCourses = async () => {
    ensureAuthToken();
    try {
      const data = await CoursesService.getCoursesListRouteApiCoursesGet();
      console.log("Đây là data ");
      console.log(data);
      setCategories(data);
    } catch (error) {
      console.error("Lỗi lấy môn học:", error);
    }
  };

  // const handlePost = async () => {

  //   if (!title || !selectedCourse || !selectedStatus || !price || !selectedLocation || !image) {
  //     Alert.alert("Lỗi", "Vui lòng điền đầy đủ các thông tin có dấu (*)");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     await ensureAuthToken();

  //     // 2. Tạo Request Body đúng cấu trúc InsertPostRequest
  //     const requestBody: InsertPostRequest = {
  //       book_title: title,
  //       author: author || "Không rõ",
  //       course_id: Number(selectedCourse?.id),     // Phải là number
  //       book_status_id: Number(selectedStatus?.id),
  //       price: Number(price) || 0, // Phải là number
  //       location_id: Number(selectedLocation?.id),  // Phải là number
  //       original_price: Number(originalPrice) || 0, // Phải là number
  //       description: statusDescribe || "Chưa có mô tả",
  //       location_detail: locationDescribe || "Chưa có chi tiết địa điểm",
  //       avatar_url: image || "https://via.placeholder.com/150",
  //     };
  //     console.log("DỮ LIỆU GỬI ĐI:", JSON.stringify(requestBody, null, 2));

  //     const result = await PostsService.insertPostRouteApiPostsPost(requestBody);

  //     if (result) {
  //       Alert.alert("Thành công", "Bài đăng của bạn đã được khởi tạo!", [
  //         { text: "Về trang chủ", onPress: () => {router.replace('/home');} }
  //       ]);
  //     }
  //   } catch (err: any) {
  //     console.error("Post Error:", err);
  //     if (err.status === 422) {
  //       Alert.alert("Lỗi dữ liệu", "Vui lòng kiểm tra lại các trường thông tin (Error 422)");
  //     } else {
  //       Alert.alert("Lỗi hệ thống", "Không thể kết nối đến máy chủ.");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handlePost = async () => {
    if (
      !title ||
      !selectedCourse ||
      !selectedStatus ||
      !price ||
      !selectedLocation ||
      !image
    ) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ các thông tin có dấu (*)");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("access_token");

      const formData = new FormData();

      // 1. Thêm các trường Text (ép kiểu String)
      formData.append("book_title", title);
      formData.append("author", author || "Không rõ");
      formData.append("course_id", String(selectedCourse?.id));
      formData.append("book_status_id", String(selectedStatus?.id));
      formData.append("price", String(price));
      formData.append("location_id", String(selectedLocation?.id));
      formData.append("original_price", String(originalPrice || 0));
      formData.append("description", statusDescribe || "Sách còn tốt");
      formData.append("location_detail", locationDescribe || "");

      // 2. XỬ LÝ FILE ẢNH (Quan trọng: Xử lý cả Web và Native)
      if (image.startsWith("blob:")) {
        // Trường hợp chạy trên WEB/Localhost
        const responseBlob = await fetch(image);
        const blob = await responseBlob.blob();
        formData.append("image", blob);
      } else {
        // Trường hợp chạy trên Điện thoại (Native)
        const filename = image.split("/").pop() || "upload.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append("image", {
          uri: image,
          name: filename,
          type: type,
        } as any);
      }

      // 3. Gửi Request
      const response = await fetch("http://160.187.246.140:8000/api/posts/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        setShowSuccessModal(true);
      } else {
        console.error("Lỗi server:", responseData);
        Alert.alert(
          "Thất bại",
          responseData?.detail?.[0]?.msg || "Dữ liệu không hợp lệ."
        );
      }
    } catch (err) {
      console.error("Lỗi kết nối:", err);
      Alert.alert("Lỗi", "Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
    loadLocations();
  }, []);
  const loadLocations = async () => {
    await ensureAuthToken();
    try {
      const data =
        await LocationsService.getLocationsListRouteApiLocationsGet();
      setLocations(data);
    } catch (error) {
      console.error("Lỗi lấy địa điểm:", error);
    }
  };

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
              Đăng sách/tài liệu mới
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
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Phần chọn ảnh */}
        <View className="px-6 mt-4 items-center">
          <View className="flex-row w-full mb-3">
            <Text className="text-textGray800 font-semibold">
              Hình ảnh sách/tài liệu
            </Text>
            <Text className="font-bold text-[16px] text-red-500 ml-1">*</Text>
          </View>
          <Pressable
            onPress={pickImage}
            className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden items-center justify-center border-gray-300"
          >
            {image ? (
              <Image source={{ uri: image }} className="w-full h-full" />
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

        {/* 2. Tên sách */}
        <View className="px-6 mt-4">
          <View className="flex-row mb-3">
            <Text className="text-textGray800 font-semibold">
              Tên sách/tài liệu
            </Text>
            <Text className="font-bold text-[16px] text-red-500 ml-1">*</Text>
          </View>
          <TextInput
            className="h-12 bg-gray-100 rounded-lg px-4 text-gray-800"
            placeholder="VD: Giải tích 2"
            placeholderTextColor="#7A7A7A"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* 3. Tác giả */}
        <View className="px-6 mt-4">
          <View className="flex-row mb-3">
            <Text className="text-textGray800 font-semibold">Tác giả</Text>
            <Text className="font-bold text-[16px] text-red-500 ml-1">*</Text>
          </View>
          <TextInput
            className="h-12 bg-gray-100 rounded-lg px-4 text-gray-800"
            placeholder="VD: Nguyễn Đình Trí"
            placeholderTextColor="#7A7A7A"
            value={author}
            onChangeText={setAuthor}
          />
        </View>

        {/* 4. Môn học */}
        <View className="px-6 mt-4">
          <View className="flex-row mb-3">
            <Text className="text-textGray800 font-semibold">Môn học</Text>
            <Text className="font-bold text-[16px] text-red-500 ml-1">*</Text>
          </View>
          <Pressable
            onPress={() => setIsModalVisible(true)}
            className="h-12 bg-gray-100 rounded-lg px-4 flex-row justify-between items-center"
          >
            <Text
              className={selectedCourse ? "text-gray-800" : "text-textGray600"}
            >
              {selectedCourse ? selectedCourse.name : "Chọn môn học"}
            </Text>
            <IconArrowDown size={20} color="#9CA3AF" />
          </Pressable>
        </View>

        {/* 5. Tình trạng */}
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
              {selectedStatus ? selectedStatus.name : "Chọn tình trạng"}
            </Text>
            <IconArrowDown size={20} color="#9CA3AF" />
          </Pressable>
        </View>

        {/* 6. Giá bán & Giá gốc */}
        <View className="flex-row px-6 gap-x-4 mt-4">
          <View className="flex-1">
            <View className="flex-row mb-3">
              <Text className="text-textGray800 font-semibold">Giá bán</Text>
              <Text className="font-bold text-red-500 ml-1">*</Text>
            </View>
            <TextInput
              className="h-12 bg-gray-100 rounded-lg px-4 text-gray-800"
              placeholder="Ví dụ: 120000"
              placeholderTextColor="#7A7A7A"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
          </View>
          <View className="flex-1">
            <Text className="text-textGray800 font-semibold mb-2">Giá gốc</Text>
            <TextInput
              className="h-12 bg-gray-100 rounded-lg px-4 text-gray-800"
              placeholder="Ví dụ: 150000"
              placeholderTextColor="#7A7A7A"
              keyboardType="numeric"
              value={originalPrice}
              onChangeText={setOriginalPrice}
            />
          </View>
        </View>

        {/* 7. Mô tả tình trạng */}
        <View className="px-6 mt-4">
          <View className="flex-row mb-3">
            <Text className="text-textGray800 font-semibold">
              Mô tả tình trạng
            </Text>
          </View>
          <TextInput
            className="h-32 bg-gray-100 rounded-lg px-4 py-3 text-gray-800"
            placeholder="Mô tả chi tiết tình trạng sách/tài liệu, ghi chú..."
            placeholderTextColor="#7A7A7A"
            multiline={true}
            textAlignVertical="top"
            value={statusDescribe}
            onChangeText={setStatusDescribe}
          />
        </View>

        {/* 8. Địa điểm */}
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
              {selectedLocation ? selectedLocation.name : "Chọn địa điểm"}
            </Text>
            <IconArrowDown size={20} />
          </Pressable>
        </View>

        {/* 9. Mô tả điểm giao dịch */}
        <View className="px-6 mt-4">
          <View className="flex-row mb-3">
            <Text className="text-textGray800 font-semibold">
              Mô tả địa điểm nhận
            </Text>
          </View>
          <TextInput
            className="h-32 bg-gray-100 rounded-lg px-4 py-3 text-gray-800"
            placeholder="Mô tả chi địa điểm nhận sách/tài liệu, ghi chú..."
            placeholderTextColor="#7A7A7A"
            multiline={true}
            textAlignVertical="top"
            value={locationDescribe}
            onChangeText={setLocationDescribe}
          />
        </View>

        <View className="px-6 mt-6 mb-6">
          <Pressable onPress={handlePost} disabled={loading}>
            <View
              className={`h-[52px] rounded-full items-center justify-center ${loading ? "bg-gray-400" : "bg-[#6750A4]"}`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">Đăng Lên</Text>
              )}
            </View>
          </Pressable>
        </View>
      </ScrollView>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)} // Hỗ trợ nút back trên Android
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl h-[60%] p-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">Danh sách môn học</Text>
              <Pressable onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color="black" />
              </Pressable>
            </View>

            <FlatList
              data={courses}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setSelectedCourse(item);
                    setIsModalVisible(false);
                  }}
                  className={`py-4 border-b border-gray-100 `}
                >
                  <Text
                    className={`text-base ${selectedCourse === item ? "text-purple-700 font-bold" : "text-gray-700"}`}
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
        transparent={true}
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
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setSelectedStatus(item);
                    setIsStatusModalVisible(false);
                  }}
                  className={`py-4 border-b border-gray-100 `}
                >
                  <Text
                    className={`text-base ${selectedStatus === item ? "text-purple-700 font-bold" : "text-gray-700"}`}
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
        transparent={true}
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
              keyExtractor={(item, index) =>
                item.id?.toString() || index.toString()
              }
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setSelectedLocation(item);
                    setIsLocationModalVisible(false);
                  }}
                  className={`py-4 border-b border-gray-100`}
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
          router.replace("/home");
        }}
        onViewOrder={() => {
          setShowSuccessModal(false);
          router.replace("/profile/my-posts");
        }}
        title="Đăng bài thành công!"
        message="Bài đăng của bạn đã được tạo thành công. Bạn có thể xem bài đăng trong phần bài đăng của tôi."
        viewOrderText="Xem bài đăng"
        continueText="Về trang chủ"
      />
    </KeyboardAvoidingView>
  );
}
