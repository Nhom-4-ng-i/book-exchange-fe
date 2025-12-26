
import { View, Text, FlatList, ActivityIndicator, Alert, RefreshControl } from "react-native";
import React, { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OpenAPI , UserService , OrdersService} from "@/api";
import { useFocusEffect } from "expo-router"; // Thêm cái này

import PageHeader from '@/components/PageHeader';
import BottomNav from '@/components/BottomNav'
import CartItem from '@/components/CartItem';
import AppHeader from "@/components/HeaderHome";
export default function Index() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (token) {
        OpenAPI.BASE = "http://160.187.246.140:8000";
        OpenAPI.TOKEN = token;
      }
      const response = await UserService.getMyOrdersRouteApiUserOrdersGet(); 
      console.log(response) ;
      setOrders(response); 
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

  const handleCancelOrder = async (orderId: number | null) => {
    if (!orderId) return;
    console.log('ID đơn hàng cần xoá : ' , orderId)
  
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
    <View className='bg-white h-full'>
      <AppHeader 
          title="Giỏ Hàng" 
          showSearch={false} // Thêm dòng này để ẩn icon tìm kiếm
        />
      
      {loading ? (
        <ActivityIndicator size="large" color="#54408C" className="mt-10" />
      ) : (
        <>
          <Text className='font-bold text-[18px] mt-4 ml-4 text-gray-900'>
            Đang xử lý ({orders.length})
          </Text>

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
                ondelete={handleCancelOrder}
              />
            )}
            contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 16 }}
            ItemSeparatorComponent={() => <View className="h-4" />}
            showsVerticalScrollIndicator={false}
            // Thêm pull-to-refresh
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            // Giao diện khi trống
            ListEmptyComponent={
              <View className="items-center justify-center mt-20">
                <Text className="text-gray-400 text-base">Bạn chưa có đơn hàng nào.</Text>
              </View>
            }
          />
        </>
      )}
      <BottomNav />
    </View>
  );
}