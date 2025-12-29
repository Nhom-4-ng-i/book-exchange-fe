import { OpenAPI, OrdersService, UserService } from "@/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Linking,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

import BottomNav from "@/components/BottomNav";
import CartItem from "@/components/CartItem";
import ConfirmationModal from "@/components/ConfirmationModal";
import AppHeader from "@/components/HeaderHome";
import SuccessModal from "@/components/SuccessModal";
import IconEmptyCart from "@/icons/IconEmptyCart";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
  const handleDeleteClick = (orderId: number) => {
    setSelectedOrderId(orderId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedOrderId) return;

    setIsDeleting(true);
    try {
      await OrdersService.cancelOrderRouteApiOrdersOrderIdCancelPost(
        selectedOrderId
      );
      setOrders((prevOrders) =>
        prevOrders.filter((item) => item.order_id !== selectedOrderId)
      );
      setShowDeleteConfirm(false);
      setShowSuccess(true);
    } catch (error) {
      console.error("Lỗi khi huỷ đơn hàng:", error);
      Alert.alert("Lỗi", "Không thể huỷ đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setIsDeleting(false);
    }
  };

  // const handleCancelOrder = async (orderId: number) => {
  //   Alert.alert("Xác nhận", "Bạn có chắc chắn muốn huỷ đơn hàng này không?", [
  //     { text: "Hủy bỏ", style: "cancel" },
  //     {
  //       text: "Đồng ý",
  //       style: "destructive",
  //       onPress: async () => {
  //         try {
  //           await OrdersService.cancelOrderRouteApiOrdersOrderIdCancelPost(
  //             orderId
  //           );
  //           setOrders((prevOrders) =>
  //             prevOrders.filter((item) => item.order_id !== orderId)
  //           );
  //           Alert.alert("Thành công", "Đơn hàng đã được huỷ.");
  //         } catch (error) {
  //           Alert.alert("Lỗi", "Không thể huỷ đơn hàng.");
  //         }
  //       },
  //     },
  //   ]);
  // };
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
      <AppHeader title="Giỏ hàng" showSearch={false} />

      {loading ? (
        <ActivityIndicator size="large" color="#54408C" className="mt-10" />
      ) : (
        <>
          <View className="px-6 mt-4 mb-3">
            <Text className="font-medium text-bodyXLarge text-textGray900">
              Đang xử lý ({orders.length})
            </Text>
          </View>

          <View className="flex-1 mb-10">
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
                  ondelete={() => handleDeleteClick(item.order_id)}
                  onPress={() => openDetail(item)}
                />
              )}
              contentContainerStyle={{
                paddingVertical: 8,
                paddingHorizontal: 24,
              }}
              ItemSeparatorComponent={() => <View className="h-4" />}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              ListEmptyComponent={
                <View className="items-center justify-center mt-20 px-6">
                  <IconEmptyCart />
                  <Text className="text-[16px] font-medium text-gray-500 mt-4 text-center">
                    Không có sản phẩm
                  </Text>
                </View>
              }
            />
          </View>
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

            <ScrollView className="flex-1 px-6 pb-10">
              {selectedOrder && (
                <>
                  {/* Book Image */}
                  <View className="w-full aspect-[1.5] bg-gray-100 rounded-2xl overflow-hidden mb-6">
                    <Image
                      source={{
                        uri:
                          selectedOrder.avatar_url === "DefaultAvatarURL"
                            ? "https://api.builder.io/api/v1/image/assets/TEMP/52fd2ccb12a0cc8215ea23e7fce4db059c2ca1aa?width=328"
                            : selectedOrder.avatar_url,
                      }}
                      className="w-full h-full"
                      resizeMode="contain"
                    />
                    <View className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded-md">
                      <Text className="text-xs font-medium text-gray-800">
                        {selectedOrder.book_status || "Chưa cập nhật"}
                      </Text>
                    </View>
                  </View>

                  {/* Book Info */}
                  <View className="mb-2">
                    <Text className="text-2xl font-bold text-gray-900 mb-1">
                      {selectedOrder.title?.trim()}
                    </Text>
                    <View className="flex-row gap-4">
                      <Text className="text-base text-gray-600 mr-4">
                        Tác giả: {selectedOrder.author || "Không rõ"}
                      </Text>
                      <Text className="text-base text-gray-600">
                        {selectedOrder.course || "Không xác định"}
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-between mb-2">
                      <View>
                        <Text className="text-2xl font-bold text-[#54408C]">
                          {formatVND(selectedOrder.price)}đ
                        </Text>
                        {selectedOrder.original_price > selectedOrder.price && (
                          <View className="flex-row items-center">
                            <Text className="text-sm text-gray-400 line-through mr-2">
                              {formatVND(selectedOrder.original_price)}đ
                            </Text>
                            <View className="bg-green-100 px-2 py-0.5 rounded">
                              <Text className="text-xs font-medium text-green-700">
                                Tiết kiệm{" "}
                                {Math.round(
                                  ((selectedOrder.original_price -
                                    selectedOrder.price) /
                                    selectedOrder.original_price) *
                                    100
                                )}
                                %
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>

                  {/* Divider */}
                  <View className="h-[1px] bg-gray-200 w-full my-2" />

                  {/* Transaction Info */}
                  <View className="my-4">
                    <Text className="text-base text-gray-900 mb-3">
                      Thông tin giao dịch
                    </Text>

                    <View className="space-y-3">
                      <View className="flex-row items-start">
                        <View className="w-8 pr-1">
                          <Ionicons
                            name="location-outline"
                            size={18}
                            color="#6B7280"
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-sm text-gray-500 mb-2">
                            Địa điểm:{" "}
                            <Text className="text-gray-900">
                              {selectedOrder.location || "Chưa cập nhật"}
                            </Text>
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row items-start">
                        <View className="w-8">
                          <Ionicons
                            name="call-outline"
                            size={18}
                            color="#6B7280"
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-sm text-gray-500 mb-2">
                            Số điện thoại:{" "}
                            <Text className="text-gray-900">
                              {selectedOrder.seller_phone || "Chưa cập nhật"}
                            </Text>
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row items-start">
                        <View className="w-8">
                          <Ionicons
                            name="time-outline"
                            size={18}
                            color="#6B7280"
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-sm text-gray-500 mb-2">
                            Ngày đăng:{" "}
                            <Text className="text-gray-900">
                              {selectedOrder.order_time || "Chưa cập nhật"}
                            </Text>
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Divider */}
                  <View className="h-[1px] bg-gray-200 w-full my-2" />

                  {/* Seller Info */}
                  <View className="my-4">
                    <Text className="text-base text-gray-900 mb-3">
                      Thông tin người bán
                    </Text>
                    <View className="flex-row items-center">
                      <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center">
                        <Ionicons name="person" size={24} color="#54408C" />
                      </View>
                      <View className="ml-3">
                        <Text className="text-base text-gray-900">
                          {selectedOrder.seller_name || "Người dùng"}
                        </Text>
                        <Text className="text-sm text-gray-500 mt-0.5">
                          Đăng vào {selectedOrder.order_time || "Chưa cập nhật"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Order Status */}
                  <View className="mt-4 p-4 bg-blue-50 rounded-xl mb-8">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-base font-medium text-gray-900">
                        Trạng thái đơn hàng
                      </Text>
                      <View
                        className={`px-3 py-1 rounded-full ${
                          selectedOrder.order_status_code === "COMPLETED"
                            ? "bg-green-100"
                            : selectedOrder.order_status_code === "PENDING"
                              ? "bg-yellow-100"
                              : "bg-gray-100"
                        }`}
                      >
                        <Text
                          className={`text-sm font-medium ${
                            selectedOrder.order_status_code === "COMPLETED"
                              ? "text-green-800"
                              : selectedOrder.order_status_code === "PENDING"
                                ? "text-yellow-800"
                                : "text-gray-800"
                          }`}
                        >
                          {selectedOrder.order_status}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-sm text-gray-600 mt-2">
                      {selectedOrder.order_status_code === "COMPLETED"
                        ? "Đơn hàng đã được hoàn thành."
                        : selectedOrder.order_status_code === "PENDING"
                          ? "Đơn hàng đang chờ xử lý."
                          : "Trạng thái đơn hàng không xác định."}
                    </Text>
                  </View>
                </>
              )}
            </ScrollView>

            {/* Footer Buttons */}
            <View className="p-6">
              <Pressable
                className="  w-full bg-white border border-[#54408C] h-[54px] rounded-full items-center justify-center mb-3"
                onPress={() => {
                  const phone = selectedOrder?.seller_phone;
                  if (phone) {
                    Linking.openURL(`tel:${phone}`);
                  } else {
                    Alert.alert("Thông báo", "Số điện thoại không khả dụng");
                  }
                }}
              >
                <Text className="text-[#54408C] font-bold text-lg">
                  Liên hệ
                </Text>
              </Pressable>

              <Pressable
                className="w-full bg-[#54408C] h-[54px] rounded-full items-center justify-center"
                onPress={() => setIsDetailModalVisible(false)}
              >
                <Text className="text-white font-bold text-lg">Hủy bỏ</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <BottomNav />
      <ConfirmationModal
        visible={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận huỷ đơn hàng"
        message="Bạn có chắc chắn muốn huỷ đơn hàng này? Hành động này không thể hoàn tác."
        confirmText="Xác nhận huỷ"
        cancelText="Quay lại"
        type="delete"
        isLoading={isDeleting}
      />

      <SuccessModal
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
        onViewOrder={() => setShowSuccess(false)}
        title="Huỷ đơn hàng thành công!"
        message="Đơn hàng đã được huỷ thành công."
        viewOrderText="Đã hiểu"
        continueText="Đóng"
      />
    </SafeAreaView>
  );
}
