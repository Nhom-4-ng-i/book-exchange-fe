import { 
    View, 
    Text, 
    Image, 
    Alert, 
    SafeAreaView, 
    ScrollView, 
    Pressable,
    TextInput, 
    Modal,
    FlatList,
    ActivityIndicator,
  } from "react-native";
  import React, { useState , useEffect } from "react";
  import { CoursesService , OpenAPI , LocationsService , PostsService } from "@/api";
  import * as ImagePicker from 'expo-image-picker';
  import { Ionicons } from '@expo/vector-icons';
  import {  useRouter } from 'expo-router';
  import IconBack from '@/icons/IconBack';
  import IconArrowDown from '@/icons/IconArrowDown'
  import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon } from "lucide-react-native";
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
    { id: 4, name: "Rách - có dấu hiệu cũ" }
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
    const [author , setAuthor] = useState("");
    const [courses, setCategories] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<{id: number, name: string} | null>(null);
    const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
    const [price, setPrice] = useState("");
    const [originalPrice, setOriginalPrice] = useState("");
    const [statusDescribe , setStatusDescribe] = useState("");
    const [locations, setLocations] = useState<any[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<any>(null);
    const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
    const [locationDescribe , setLocationDescribe] = useState("");
    const [loading , setLoading] = useState(false) ; 
    const router = useRouter() ; 
    const pickImage = async () => {
     
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Thông báo', 'Chúng tôi cần quyền truy cập thư viện ảnh!');
        return;
      }
  
     
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], 
        allowsEditing: true, 
        aspect: [1, 1],
        quality: 1,
      });
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    };

    const loadCourses = async () => {
        ensureAuthToken() ; 
        try {
          const data = await CoursesService.getCoursesListRouteApiCoursesGet();
          console.log('Đây là data ')
          console.log(data) ; 
          setCategories(data);
        } catch (error) {
          console.error("Lỗi lấy môn học:", error);
        }
      };
      
      const handlePost = async () => {
        
        if (!title || !selectedCourse || !selectedStatus || !price || !selectedLocation || !image) {
          Alert.alert("Lỗi", "Vui lòng điền đầy đủ các thông tin có dấu (*)");
          return;
        }
      
        try {
          setLoading(true);
          await ensureAuthToken(); 
      
          // 2. Tạo Request Body đúng cấu trúc InsertPostRequest
          const requestBody: InsertPostRequest = {
            book_title: title,
            author: author || "Không rõ",
            course_id: Number(selectedCourse?.id),     // Phải là number
            book_status_id: Number(selectedStatus?.id), // Phải là number
            location_id: Number(selectedLocation?.id),  // Phải là number
            price: Number(price) || 0,                 // Phải là number
            original_price: Number(originalPrice) || 0, // Phải là number
            description: statusDescribe || "Chưa có mô tả",
            location_detail: locationDescribe || "Chưa có chi tiết địa điểm",
            avatar_url: image || "https://via.placeholder.com/150", 
          };
          console.log("DỮ LIỆU GỬI ĐI:", JSON.stringify(requestBody, null, 2));
      
          
          const result = await PostsService.insertPostRouteApiPostsPost(requestBody);
      
          if (result) {
            Alert.alert("Thành công", "Bài đăng của bạn đã được khởi tạo!", [
              { text: "Về trang chủ", onPress: () => {router.replace('/home');} }
            ]);
          }
        } catch (err: any) {
          console.error("Post Error:", err);
          if (err.status === 422) {
            Alert.alert("Lỗi dữ liệu", "Vui lòng kiểm tra lại các trường thông tin (Error 422)");
          } else {
            Alert.alert("Lỗi hệ thống", "Không thể kết nối đến máy chủ.");
          }
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
          const data = await LocationsService.getLocationsListRouteApiLocationsGet();
          setLocations(data);
        } catch (error) {
          console.error("Lỗi lấy địa điểm:", error);
        }
      };
      
    
  
    return (
      <SafeAreaView className="flex-1 bg-white">
       
        <View className="flex-row items-center justify-center relative h-14 w-full bg-white border-b border-gray-100">
          <Pressable className="absolute left-4 z-10" onPress={() => {
            router.replace('/home');
          }}>
            <IconBack />
          </Pressable>
          <Text className="font-bold text-[18px]">Đăng sách/tài liệu mới</Text>
        </View>
  
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          className="flex-1"
        >
          {/* Phần chọn ảnh */}
          <View className="p-4 items-center">
            <Text className="self-start font-semibold text-gray-800 mb-4">
              Hình ảnh sách/tài liệu *
            </Text>
  
            <Pressable 
              onPress={pickImage}
              
              className="w-[327px] h-[327px] bg-gray-50 rounded-2xl overflow-hidden items-center justify-center"
            >
              {image ? (
                <Image source={{ uri: image }} className="w-full h-full" />
              ) : (
                <View className="items-center">
                  <Ionicons name="camera-outline" size={48} color="#9CA3AF" />
                  <Text className="text-gray-400 mt-2 font-medium">Thêm ảnh</Text>
                </View>
              )}
            </Pressable>
          </View>
  
          {/*TextInput tên sách, giá */}

          <Text className="mb-2 font-semibold pl-4">Tên sách/tài liệu *</Text>
            <TextInput
            className=" h-12 bg-gray-200 rounded-xl rounded-xl px-4  pl-4 pr-4 mx-4"
            placeholder="Nhập tên sách"
            value={title}
            onChangeText={(text) => setTitle(text)} 
            />

            <Text className="mb-2 font-semibold pl-4 mt-4">Tác giả*</Text>
            <TextInput
            className=" h-12 bg-gray-200 rounded-xl rounded-xl px-4  pl-4 pr-4 mx-4"
            placeholder="Nhập tên tác giả"
            value={author}
            onChangeText={(author) => setAuthor(author)} 
            />
            <View className="px-4 mb-4">
            <Text className="text-gray-700 font-semibold mb-2 mt-4">Môn học *</Text>
            <Pressable 
                onPress={() => setIsModalVisible(true)}
                className="w-full bg-gray-200 border border-gray-200 rounded-2xl p-4 flex-row justify-between items-center"
            >
                <Text className={selectedCourse ? "text-gray-800" : "text-gray-400"}>
                {selectedCourse ? selectedCourse.name : "Chọn môn học"}
                </Text>
                
                <IconArrowDown size={20} color="#9CA3AF" />
            </Pressable>
            </View>

            <View className="px-4 mb-4 mt-4">
            <Text className="text-gray-700 font-semibold mb-2">Tình trạng sách *</Text>
            <Pressable 
                onPress={() => setIsStatusModalVisible(true)}
                className="w-full bg-gray-200 border border-gray-200 rounded-2xl p-4 flex-row justify-between items-center"
            >
                <Text className={selectedStatus ? "text-gray-800" : "text-gray-400"}>
                {selectedStatus ? selectedStatus.name : "Chọn tình trạng sách"}
                </Text>
                <IconArrowDown size={20} color="#9CA3AF" />
            </Pressable>
            </View>
            <View className="flex-row px-4 gap-4 mb-4 mt-4">
                    {/* Ô bên trái: Giá bán */}
                    <View className="flex-1">
                        <View className="flex-row">
                        <Text className="font-bold text-[16px] text-gray-900">Giá bán</Text>
                        <Text className="font-bold text-[16px] text-red-500 ml-1">*</Text>
                        </View>
                        <TextInput
                        className="mt-2 h-12 bg-gray-200 border border-gray-200 rounded-xl px-4 text-gray-700 font-semibold"
                        placeholder="Ví dụ: 120000"
                        placeholderTextColor="#A1A1A1"
                        keyboardType="numeric"
                        value={price}
                        onChangeText={setPrice}
                        />
                    </View>

                    {/* Ô bên phải: Giá gốc */}
                    <View className="flex-1">
                        <Text className="font-bold text-[16px] text-gray-900">Giá gốc</Text>
                        <TextInput
                        className="mt-2 h-12 bg-gray-200 border border-gray-200 rounded-xl px-4 text-gray-700 font-semibold"
                        placeholder="Ví dụ: 150000"
                        placeholderTextColor="#A1A1A1"
                        keyboardType="numeric"
                        value={originalPrice}
                        onChangeText={setOriginalPrice}
                        />
                    </View>
                    </View>
        <Text className="mb-2 font-semibold pl-4 mt-4">Mô tả tình trạng*</Text>
            <TextInput
            className=" h-36 bg-gray-200 rounded-xl rounded-xl px-4  pl-4 pr-4 mx-4"
            placeholder="Mô tả tình trạng sách/tài liệu , ghi chú..."
            value={statusDescribe}
            onChangeText={(statusDescribe) => setStatusDescribe(statusDescribe)} 
            />
            <View className="px-4 mb-4 mt-4">
            <Text className="text-gray-700 font-semibold mb-2">Địa điểm giao dịch *</Text>
            <Pressable 
                onPress={() => setIsLocationModalVisible(true)}
                className="w-full bg-gray-200 border border-gray-200 rounded-2xl p-4 flex-row justify-between items-center"
            >
                <Text className={selectedLocation ? "text-gray-800" : "text-gray-400"}>
                {selectedLocation ? selectedLocation.name : "Chọn địa điểm giao dịch"}
                </Text>
                
                <IconArrowDown size = {20}/>
            </Pressable>
        </View>
            <Text className="mb-2 font-semibold pl-4 mt-4">Mô tả địa điểm giao dịch*</Text>
            <TextInput
            className=" h-36 bg-gray-200 rounded-xl rounded-xl px-4  pl-4 pr-4 mx-4"
            placeholder="Mô tả địa điểm giao dịch"
            value={locationDescribe}
            onChangeText={(locationDescribe) => setLocationDescribe(locationDescribe)} 
            />
        
        <Pressable 
  className="px-4 mt-6" 
  onPress={handlePost}
  disabled={loading} 
>
  <View 
    className={`h-[50px] rounded-[48px] items-center justify-center ${loading ? 'bg-gray-400' : 'bg-[#6750A4]'}`}
  >
    {loading ? (
      <ActivityIndicator color="white" />
    ) : (
      <Text className="text-white font-bold text-lg"> Đăng Lên</Text>
    )}
  </View>
</Pressable>

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
                    <Text className={`text-base ${selectedCourse === item ? 'text-purple-700 font-bold' : 'text-gray-700'}`}>
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
                    <Text className={`text-base ${selectedStatus === item ? 'text-purple-700 font-bold' : 'text-gray-700'}`}>
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
                    keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                    renderItem={({ item }) => (
                    <Pressable 
                        onPress={() => {
                        setSelectedLocation(item); 
                        setIsLocationModalVisible(false); 
                        }}
                        className={`py-4 border-b border-gray-100`}
                    >
                        <Text className={`text-base ${selectedLocation?.id === item.id ? 'text-purple-700 font-bold' : 'text-gray-700'}`}>
                        {item.name}
                        </Text>
                    </Pressable>
                    )}
                />
                </View>
            </View>
            </Modal>
      </SafeAreaView>
    );
  }