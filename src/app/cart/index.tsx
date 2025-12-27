

// import { View, Text, FlatList, ActivityIndicator, Alert, RefreshControl, Image,Modal } from "react-native";
// import React, { useCallback, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { OpenAPI , UserService , OrdersService} from "@/api";
// import { useFocusEffect } from "expo-router"; 
// import IconEmptyCart from '@/icons/IconEmptyCart'

// import PageHeader from '@/components/PageHeader';
// import BottomNav from '@/components/BottomNav'
// import CartItem from '@/components/CartItem';
// import AppHeader from "@/components/HeaderHome";

// interface OrderItem {
//   order_id: number;
//   order_time: string; // Định dạng "DD/MM/YYYY HH:mm:ss"
//   order_status: string; // VD: "Chờ xác nhận"
//   order_status_code: string; // VD: "PENDING"
//   title: string;
//   author: string;
//   price: number;
//   avatar_url: string;
//   course: string;
//   location: string;
//   book_status: string;
//   book_status_code: string | null;
//   post_status: string;
//   post_status_code: string | null;
//   seller_name: string;
//   seller_phone: string | null;
//   buyer_name: string;
//   buyer_phone: string | null;
// }
// export default function Index() {
//   const [orders, setOrders] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
//   const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
//   const openDetail = (order: OrderItem) => {
//     setSelectedOrder(order);
//     setIsDetailModalVisible(true);
//   };
//   const fetchOrders = async () => {
//     try {
//       const token = await AsyncStorage.getItem("access_token");
//       if (token) {
//         OpenAPI.BASE = "http://160.187.246.140:8000";
//         OpenAPI.TOKEN = token;
//       }
//       const response = await UserService.getMyOrdersRouteApiUserOrdersGet(); 
//       const finalData = response
      
//       .filter((item : OrderItem)=> item.order_status === "Chờ xác nhận")
      
      
//       .sort((a : any, b : any) => b.order_id - a.order_id);

//     setOrders(finalData);
       
//     } catch (error) {
//       console.error("Lỗi fetch orders:", error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       fetchOrders();
//     }, [])
//   );

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchOrders();
//   };

//   const handleCancelOrder = async (orderId: number | null) => {
//     if (!orderId) return;
  
//     Alert.alert("Xác nhận", "Bạn có chắc chắn muốn huỷ đơn hàng này không?", [
//       { text: "Hủy bỏ", style: "cancel" },
//       { 
//         text: "Đồng ý", 
//         style: "destructive",
//         onPress: async () => {
//           try {
//             await OrdersService.cancelOrderRouteApiOrdersOrderIdCancelPost(orderId);
//             setOrders((prevOrders) => prevOrders.filter(item => item.order_id !== orderId));
//             Alert.alert("Thành công", "Đơn hàng đã được huỷ.");
//           } catch (error) {
//             Alert.alert("Lỗi", "Không thể huỷ đơn hàng.");
//           }
//         }
//       }
//     ]);
//   };

//   return (
//     <View className='bg-white flex-1'>
//       {/* Đảm bảo AppHeader cũng tuân thủ padding 14px bên trong nếu có thể */}
//       <AppHeader 
//           title="Giỏ Hàng" 
//           showSearch={false} 
//         />
      
//       {loading ? (
//         <ActivityIndicator size="large" color="#54408C" className="mt-10" />
//       ) : (
//         <>
        
//           <View className="px-[14px] mt-4">
//             <Text className='font-bold text-[18px] text-textGray900'>
//               Đang xử lý ({orders.length})
//             </Text>
//           </View>

//           <FlatList
//             data={orders}
//             keyExtractor={(item) => item.order_id.toString()}
//             renderItem={({ item }) => (
//               <CartItem
//                 orderId={item.order_id}
//                 bookName={item.title} 
//                 seller={item.seller_name}
//                 status={item.order_status}
//                 price={item.price}
//                 image={item.avatar_url}
//                 ondelete={handleCancelOrder}
//               />
//             )}
//             // Chỉnh paddingHorizontal từ 16 về 14 để đồng bộ
//             contentContainerStyle={{ 
//                 paddingVertical: 16, 
//                 paddingHorizontal: 14 
//             }}
//             ItemSeparatorComponent={() => <View className="h-4" />}
//             showsVerticalScrollIndicator={false}
           
//             refreshControl={
//               <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//             }
           
//             ListEmptyComponent={
//               <View className="items-center justify-center mt-20 px-[14px]">
//                 <IconEmptyCart/>
//                 <Text className="text-[16px] font-medium text-gray-500 mt-4">Không có sản phẩm nào trong giỏ</Text>
//               </View>
//             }
//           />
//         </>
//       )}
//       <Modal
// visible={isDetailModalVisible}
// transparent={true}
// animationType="slide"
// onRequestClose={() => setIsDetailModalVisible(false)}
// >
// <View className="flex-1 bg-black/50 justify-end">

// <Pressable
// className="flex-1"
// onPress={() => setIsDetailModalVisible(false)}
// />

// <View className="bg-white h-[85%] rounded-t-[32px] overflow-hidden">
// <View className="items-center py-3">
// <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
// </View>

// <ScrollView className="flex-1 px-4 pb-10">
// {selectedOrder && (
// <>
// <Image
// source={{ uri:
//   selectedOrder.avatar_url === "DefaultAvatarURL"
//   ? "https://api.builder.io/api/v1/image/assets/TEMP/52fd2ccb12a0cc8215ea23e7fce4db059c2ca1aa?width=328"
//   : selectedOrder.avatar_url }}
// className="w-full aspect-square rounded-4xl"
// resizeMode="contain"
// />
// <Text className="text-heading4 font-bold mt-4">{selectedOrder.title}</Text>
// <View className = 'flex-row gap-4 mt-2'>
// <Text className = 'text-gray-700 text-bodyMedium'>Tác giả : {selectedOrder.author}</Text>
// <Text className = 'text-gray-700 text-bodyMedium'>Tên môn : {selectedOrder.course}</Text>
// </View>
// <View className="flex-row items-baseline gap-2 mt-2">
// <Text className="text-[#54408C] font-bold text-[24px]">
// {formatVND(selectedOrder.price)}đ
// </Text>

// {/* Giá gốc có dấu gạch ngang */}
// <Text className="text-gray-400 text-[16px] line-through ml-2">
// {formatVND(selectedOrder.original_price)}đ
// </Text>
// </View>
// {selectedOrder.original_price > selectedOrder.price && (
// <View className="  py-2 rounded-md self-start ">
// <Text className="text-green-400 text-bodyMedium ">
// Tiết kiệm {Math.round(((selectedOrder.original_price - selectedOrder.price) / selectedOrder.original_price) * 100)}%
// </Text>
// </View>
// )}
// <Text className="text-bodyMedium text-gray-700">Mô tả : </Text>
// <Text className = 'text-gray-500 text-[12px] mt-2'>{selectedOrder.description}</Text>
// <View className="h-[1px] bg-gray-200 w-full my-4" />
// <View>
// <Text className="text-bodyMedium text-gray-700">Thông tin giao dịch</Text>
// <View className="flex-row items-center mb-4 mt-4">
// <View className="w-8">
// <IconLocation size = {15}/>
// </View>
// <Text className="text-gray-600 flex-1">{selectedOrder.location || "Khu A - ĐHBK"}</Text>
// </View>

// <View className="flex-row items-center">
// <View className="w-8">
// <IconPhone size = {15}/>
// </View>
// <Text className="text-gray-600 flex-1">{selectedOrder.seller_phone || "09074350"}</Text>
// </View>
// </View>
// <View className="h-[1px] bg-gray-200 w-full my-4" />
// <View className="mb-10">
// <Text className="text-bodyMedium text-gray-700  mb-4">Người bán</Text>
// <View className="flex-row items-center">
// <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center">
// <Ionicons name="person" size={24} color="#54408C" />
// </View>
// <View className="ml-3 gap-2">
// <Text className="font-bold text-gray-900">{selectedOrder.seller_name || "Nguyễn Văn A"}</Text>
// <Text className="text-gray-400 text-xs">Đăng {selectedOrder.order_time || "10/01/2025"}</Text>
// </View>
// </View>
// </View>


// </>
// )}
// </ScrollView>

// <View className="p-4 border-t border-gray-50 bg-white gap-y-3">
// <Pressable
// className="w-full bg-[#54408C] h-[54px] rounded-full items-center justify-center shadow-sm"
// onPress={handleCreateOrder}
// disabled={orderLoading}
// >
// {orderLoading ? (
//     <ActivityIndicator color="white" />
//   ) : (
//     <Text className="text-white font-bold text-lg">Đặt mua</Text>
//   )}
// </Pressable>

// <Pressable
// className="w-full bg-white border border-[#54408C] h-[54px] rounded-full items-center justify-center"
// onPress={() => {/* Xử lý liên hệ */}}
// >
// <Text className="text-[#54408C] font-bold text-lg">Liên hệ</Text>
// </Pressable>
// </View>
// </View>
// </View>
// </Modal>
//       <BottomNav />
      
//     </View>
    
//   );
// }

import { 
  View, Text, FlatList, ActivityIndicator, Alert, 
  RefreshControl, Image, Modal, Pressable, ScrollView 
} from "react-native";
import React, { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OpenAPI, UserService, OrdersService } from "@/api";
import { useFocusEffect } from "expo-router"; 
import { Ionicons } from '@expo/vector-icons';

// Import Icons (Đảm bảo đường dẫn đúng với dự án của bạn)
import IconEmptyCart from '@/icons/IconEmptyCart';
import IconLocation from '@/icons/IconLocation';
import IconPhone from '@/icons/PhoneIcon';
import BottomNav from '@/components/BottomNav';
import CartItem from '@/components/CartItem';
import AppHeader from "@/components/HeaderHome";

interface OrderItem {
  order_id: number;
  order_time: string;
  order_status: string;
  order_status_code: string;
  title: string;
  author: string;
  price: number;
  avatar_url: string;
  course: string;
  location: string;
  book_status: string;
  original_price: number;
  description: string;
  seller_name: string;
  seller_phone: string | null;
}

export default function Index() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  // Hàm định dạng tiền tệ
  const formatVND = (price: number) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const openDetail = (order: OrderItem) => {
    console.log(order);
    setSelectedOrder(order);
    setIsDetailModalVisible(true);
  };

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (token) {
        OpenAPI.BASE = "http://160.187.246.140:8000";
        OpenAPI.TOKEN = token;
      }
      const response = await UserService.getMyOrdersRouteApiUserOrdersGet(); 
      const finalData = response
        .filter((item: OrderItem) => item.order_status === "Chờ xác nhận")
        .sort((a: any, b: any) => b.order_id - a.order_id);

      setOrders(finalData);
    } catch (error) {
      console.error("Lỗi fetch orders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleCancelOrder = async (orderId: number) => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn huỷ đơn hàng này không?", [
      { text: "Hủy bỏ", style: "cancel" },
      { 
        text: "Đồng ý", 
        style: "destructive",
        onPress: async () => {
          try {
            await OrdersService.cancelOrderRouteApiOrdersOrderIdCancelPost(orderId);
            setOrders((prevOrders) => prevOrders.filter(item => item.order_id !== orderId));
            Alert.alert("Thành công", "Đơn hàng đã được huỷ.");
          } catch (error) {
            Alert.alert("Lỗi", "Không thể huỷ đơn hàng.");
          }
        }
      }
    ]);
  };

  return (
    <View className='bg-white flex-1'>
      <AppHeader title="Giỏ Hàng" showSearch={false} />
      
      {loading ? (
        <ActivityIndicator size="large" color="#54408C" className="mt-10" />
      ) : (
        <>
          <View className="px-[14px] mt-4">
            <Text className='font-bold text-[18px] text-textGray900'>
              Đang xử lý ({orders.length})
            </Text>
          </View>

          <FlatList
            data={orders}
            keyExtractor={(item) => item.order_id.toString()}
            renderItem={({ item }) => (
              <CartItem
                orderId={item.order_id}
                bookName={item.title} 
                seller={item.seller_name}
                status={item.order_status}
                price={item.price}
                image={item.avatar_url}
                ondelete={() => handleCancelOrder(item.order_id)}
                onPress={() => openDetail(item)} // QUAN TRỌNG: Thêm dòng này
              />
            )}
            contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 14 }}
            ItemSeparatorComponent={() => <View className="h-4" />}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={
              <View className="items-center justify-center mt-20 px-[14px]">
                <IconEmptyCart/>
                <Text className="text-[16px] font-medium text-gray-500 mt-4 text-center">
                   Không có sản phẩm nào đang chờ xác nhận
                </Text>
              </View>
            }
          />
        </>
      )}

      {/* Detail Modal */}
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

<View className="bg-white h-[85%] rounded-t-[32px] overflow-hidden">
<View className="items-center py-3">
<View className="w-12 h-1.5 bg-gray-300 rounded-full" />
</View>

<ScrollView className="flex-1 px-4 pb-10">
{selectedOrder && (
<>
<Image
source={{ uri:
  selectedOrder.avatar_url === "DefaultAvatarURL"
  ? "https://api.builder.io/api/v1/image/assets/TEMP/52fd2ccb12a0cc8215ea23e7fce4db059c2ca1aa?width=328"
  : selectedOrder.avatar_url }}
className="w-full aspect-square rounded-4xl"
resizeMode="contain"
/>
<Text className="text-heading4 font-bold mt-4">{selectedOrder.title}</Text>
<View className = 'flex-row gap-4 mt-2'>
<Text className = 'text-gray-700 text-bodyMedium'>Tác giả : {selectedOrder.author}</Text>
<Text className = 'text-gray-700 text-bodyMedium'>Tên môn : {selectedOrder.course}</Text>
</View>
<View className="flex-row items-baseline gap-2 mt-2">
<Text className="text-[#54408C] font-bold text-[24px]">
{formatVND(selectedOrder.price)}đ
</Text>

{/* Giá gốc có dấu gạch ngang */}
{/* <Text className="text-gray-400 text-[16px] line-through ml-2">
{formatVND(selectedOrder.original_price)}đ
</Text> */}
</View>
{selectedOrder.original_price > selectedOrder.price && (
<View className="  py-2 rounded-md self-start ">
<Text className="text-green-400 text-bodyMedium ">
Tiết kiệm {Math.round(((selectedOrder.original_price - selectedOrder.price) / selectedOrder.original_price) * 100)}%
</Text>
</View>
)}
<Text className="text-bodyMedium text-gray-700">Mô tả : </Text>
<Text className = 'text-gray-500 text-[12px] mt-2'>{selectedOrder.description}</Text>
<View className="h-[1px] bg-gray-200 w-full my-4" />
<View>
<Text className="text-bodyMedium text-gray-700">Thông tin giao dịch</Text>
<View className="flex-row items-center mb-4 mt-4">
<View className="w-8">
<IconLocation size = {15}/>
</View>
<Text className="text-gray-600 flex-1">{selectedOrder.location || "Khu A - ĐHBK"}</Text>
</View>

<View className="flex-row items-center">
<View className="w-8">
<IconPhone size = {15}/>
</View>
<Text className="text-gray-600 flex-1">{selectedOrder.seller_phone || "09074350"}</Text>
</View>
</View>
<View className="h-[1px] bg-gray-200 w-full my-4" />
<View className="mb-10">
<Text className="text-bodyMedium text-gray-700  mb-4">Người bán</Text>
<View className="flex-row items-center">
<View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center">
<Ionicons name="person" size={24} color="#54408C" />
</View>
<View className="ml-3 gap-2">
<Text className="font-bold text-gray-900">{selectedOrder.seller_name || "Nguyễn Văn A"}</Text>
<Text className="text-gray-400 text-xs">Đăng {selectedOrder.order_time || "10/01/2025"}</Text>
</View>
</View>
</View>


</>
)}
</ScrollView>

<View className="p-[14px] border-t border-gray-50 bg-white">
        <Pressable
          className="w-full bg-[#54408C] h-[54px] rounded-full items-center justify-center shadow-sm"
          onPress={() => setIsDetailModalVisible(false)}
        >
          <Text className="text-white font-bold text-lg">Đóng</Text>
        </Pressable>
      </View>
</View>
</View>
</Modal>
      <BottomNav />
    </View>
  );
}