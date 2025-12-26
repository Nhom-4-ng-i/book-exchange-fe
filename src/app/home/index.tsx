import { CoursesService, OpenAPI, PostsService,OrdersService } from "@/api";
import BottomNav from "@/components/BottomNav";
import HeaderHome from "@/components/HeaderHome";
import IconSearch from '@/icons/IconSearch';
import IconArrowDown from "@/icons/IconArrowDown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
Alert,
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
export default function Index() {
const [posts, setPosts] = useState<any[]>([]);
const [categories, setCategories] = useState<any[]>([]);
const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // null = Tất cả
const [loading, setLoading] = useState(true);
const [isSearching, setIsSearching] = useState(false);
const [searchQuery, setSearchQuery] = useState("");
const [isDropdownVisible, setIsDropdownVisible] = useState(false);
const [searchType, setSearchType] = useState<'title' | 'author' | 'course'>('title');
const [searchLabel, setSearchLabel] = useState("Tên sách");
const [selectedPost, setSelectedPost] = useState<any>(null);
const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
const route = useRouter() ;
const [orderLoading, setOrderLoading] = useState(false);

const handleCreateOrder = async () => {
if (!selectedPost?.id) return;
try {
setOrderLoading(true);
await ensureAuthToken();


const requestBody = {
post_id: selectedPost.id,
buyer_note: ""
};
const result = await OrdersService.insertOrderRouteApiOrdersPost(requestBody);
if (result) {
Alert.alert("Thành công", "Đã gửi yêu cầu đặt mua sách!", [
{
text: "Đóng",
onPress: () => {
setIsDetailModalVisible(false);
}
}
]);
}
} catch (err: any) {
console.error("Lỗi đặt hàng:", err);
Alert.alert("Thông báo", "Có lỗi xảy ra khi đặt hàng, vui lòng thử lại.");
} finally {
setOrderLoading(false);
}
};

const openDetail = (post: any) => {
console.log(post)
setSelectedPost(post);
setIsDetailModalVisible(true);
};
const loadPosts = async () => {
try {
await ensureAuthToken();
const query = searchQuery.trim();
const response = await PostsService.getPostsListRouteApiPostsGet(
// 1. bookTitle
searchType === 'title' && query ? query : null,
// 2. author
searchType === 'author' && query ? query : null,
// 3. bookStatus (Đưa SELLING vào đây nếu nó là tình trạng sách)
"SELLING",
searchType === 'course' && query ? Number(query) : null,
null, // 5. locationId
null, // 6. minPrice
null, // 7. maxPrice
null, // 8. sortBy
0, // 9. offset
100 // 10. limit
);
console.log(response) ;

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
const filteredPosts = posts.filter((post) => {

if (!selectedCategory) return true;
const courseNameFromPost = post.course_name || post.course || "";
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
<IconArrowDown size ={20}/>
</Pressable>
</View>
<Pressable onPress={() => setIsSearching(false)} className="mt-2">
<Text className="text-center text-purple-600">Hủy</Text>
</Pressable>
</View>
) : <HeaderHome title = 'Trang chủ' onSearchPress={() => setIsSearching(true)}/>}

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
{!isSearching && (
  <View className="px-4 mb-4 mt-4">
    <Pressable
      className="w-full py-3 bg-textPrimary500 items-center justify-center text-white font-bold rounded-lg tracking-wide"
      onPress={() => {
        console.log(route);
        route.push('/home/addPost');
      }}
    >
      <Text className="text-white font-bold text-base tracking-wide">
        + Đăng sách/tài liệu mới
      </Text>
    </Pressable>
  </View>
)}

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
<Pressable key={post.id} className="w-[48%] mb-8" onPress={() => openDetail(post)}>
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
<Modal
visible={isDetailModalVisible}
transparent={true}
animationType="slide"
onRequestClose={() => setIsDetailModalVisible(false)}
>
<View className="flex-1 bg-black/50 justify-end">

<Pressable
className="flex-1"
onPress={() => setIsDetailModalVisible(false)}
/>

<View className="bg-white h-[95%] rounded-t-[32px] overflow-hidden">
<View className="items-center py-3">
<View className="w-12 h-1.5 bg-gray-300 rounded-full" />
</View>

<ScrollView className="flex-1 px-4 pb-10">
{selectedPost && (
<>
<Image
source={{ uri: selectedPost.avatar_url }}
className="w-full aspect-square rounded-4xl"
resizeMode="contain"
/>
<Text className="text-[20px] font-bold mt-4">{selectedPost.title}</Text>
<View className = 'flex-row gap-4 mt-2'>
<Text className = 'text-gray-700 text-[14px]'>Tác giả : {selectedPost.author}</Text>
<Text className = 'text-gray-700 text-[14px]'>Tên môn : {selectedPost.course}</Text>
</View>
<View className="flex-row items-baseline gap-2 mt-2">
<Text className="text-[#54408C] font-bold text-[24px]">
{formatVND(selectedPost.price)}đ
</Text>

{/* Giá gốc có dấu gạch ngang */}
<Text className="text-gray-400 text-[16px] line-through ml-2">
{formatVND(selectedPost.original_price)}đ
</Text>
</View>
{selectedPost.original_price > selectedPost.price && (
<View className=" px-2 py-1 rounded-md self-start ">
<Text className="text-green-400 text-[14px] ">
Tiết kiệm {Math.round(((selectedPost.original_price - selectedPost.price) / selectedPost.original_price) * 100)}%
</Text>
</View>
)}
<Text className="text-[14px] text-gray-700">Mô tả : </Text>
<View className = 'text-gray-500 text-[12px]'>{selectedPost.description}</View>
<View className="h-[1px] bg-gray-200 w-full my-4" />
<View>
<Text className="text-gray-900 font-bold text-lg mb-4">Thông tin giao dịch</Text>
<View className="flex-row items-center mb-4">
<View className="w-8">
<Ionicons name="location-sharp" size={20} color="#9CA3AF" />
</View>
<Text className="text-gray-600 flex-1">{selectedPost.location || "Khu A - ĐHBK"}</Text>
</View>

<View className="flex-row items-center">
<View className="w-8">
<Ionicons name="call" size={20} color="#9CA3AF" />
</View>
<Text className="text-gray-600 flex-1">{selectedPost.seller_phone || "09074350"}</Text>
</View>
</View>
<View className="h-[1px] bg-gray-200 w-full my-4" />
<View className="mb-10">
<Text className="text-gray-900 font-bold text-lg mb-4">Người bán</Text>
<View className="flex-row items-center">
<View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center">
<Ionicons name="person" size={24} color="#54408C" />
</View>
<View className="ml-3">
<Text className="font-bold text-gray-900">{selectedPost.seller_name || "Nguyễn Văn A"}</Text>
<Text className="text-gray-400 text-xs">Đăng {selectedPost.order_time || "10/01/2025"}</Text>
</View>
</View>
</View>


</>
)}
</ScrollView>

<View className="p-4 border-t border-gray-50 bg-white gap-y-3">
<Pressable
className="w-full bg-[#54408C] h-[54px] rounded-full items-center justify-center shadow-sm"
onPress={() => {/* Xử lý đặt mua */}}
>
<Text className="text-white font-bold text-lg">Đặt mua</Text>
</Pressable>

<Pressable
className="w-full bg-white border border-[#54408C] h-[54px] rounded-full items-center justify-center"
onPress={() => {/* Xử lý liên hệ */}}
>
<Text className="text-[#54408C] font-bold text-lg">Liên hệ</Text>
</Pressable>
</View>
</View>
</View>
</Modal>

{!isSearching && <BottomNav />}

</SafeAreaView>
);
}