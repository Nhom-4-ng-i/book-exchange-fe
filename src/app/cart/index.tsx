import { View, Text, FlatList, ActivityIndicator, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OpenAPI , UserService , OrdersService} from "@/api";

import PageHeader from '@/components/PageHeader';
import BottomNav from '@/components/BottomNav'
import CartItem from '@/components/CartItem';
import axios from "axios";
interface IBookPost {
  author: string;
  avatar_url: string;
  book_status: string;
  course: string;
  created_at: string;
  location: string;
  order_id: number | null;
  order_status: string;
  post_status: string;
  price: number;
  seller_name: string;
  title: string;
}

  // const fetchData = async () => {
  //   try {
  //     const res = await axios.get("http://160.187.246.140:8000/api/orders/");
  //     console.log(res.data);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };
export default function Index() {
  const [orders, setOrders] = useState<IBookPost[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
       
        const token = await AsyncStorage.getItem("access_token");
        // const token = 'eyJhbGciOiJIUzI1NiIsImtpZCI6Im45R2xVbjFGYmV3Vk5JTmEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2x3b2RyenBmdmtic3VzbHhmZG1yLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJhNjNiMWNhMC0wZTNiLTQxZjUtODI0MC0yZmNkYjA1NTgyOTEiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzY2Njg3NTA1LCJpYXQiOjE3NjY2ODM5MDUsImVtYWlsIjoidHRxdGhpbmgyMDA0QGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWwiOiJ0dHF0aGluaDIwMDRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiYTYzYjFjYTAtMGUzYi00MWY1LTgyNDAtMmZjZGIwNTU4MjkxIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NjY2ODM5MDV9XSwic2Vzc2lvbl9pZCI6ImRhYTdiNGZhLTliMWYtNGNjMi05NjFkLThlN2JlYTM2Nzk5ZiIsImlzX2Fub255bW91cyI6ZmFsc2V9.E0D88id7uRkaNSbmr2Ae6ovH8yVCulVy2OwkuoBiZ3o'
        if (token) {
          OpenAPI.BASE = "http://160.187.246.140:8000";
          OpenAPI.TOKEN = token;
        }

      
        const response = await UserService.getMyOrdersRouteApiUserOrdersGet(); 
        console.log(response) ; 
        setOrders(response); 
      } catch (error) {
        console.error("Lỗi fetch orders:", error);
        Alert.alert("Lỗi", "Không thể lấy danh sách đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" className="mt-10" />;
  }
  const handleCancelOrder = async (orderId: number | null) => {
    if (!orderId) {
      Alert.alert("Lỗi", "Không tìm thấy ID đơn hàng");
      return;
    }
  
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn huỷ đơn hàng này không?",
      [
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
              console.error("Lỗi khi huỷ đơn:", error);
              Alert.alert("Lỗi", "Không thể huỷ đơn hàng. Vui lòng thử lại.");
            }
          }
        }
      ]
    );
  };
    return (
        <View className = 'bg-white h-full'>
            <PageHeader title = 'Giỏ Hàng'/>
            <Text className = 'font-medium text-[18px] mt-2 ml-2'>
              Đang xử lý ({orders.length})
            </Text>
            <FlatList
            data={orders}
            keyExtractor={(item ) => item.created_at.toString()}
            renderItem={({ item }) => (
            <CartItem
               orderId = {item.order_id}
               bookName = {item.course}
               seller=  {item.seller_name}
               status = {item.order_status}
               price = {item.price}
               image = {item.avatar_url}
               ondelete= {handleCancelOrder}
            />
            )}
            contentContainerStyle={{ paddingVertical: 12 }}
            ItemSeparatorComponent={() => <View className="h-3" />}
            showsVerticalScrollIndicator={false}
      />
      <BottomNav/>

        </View>
    );
}
