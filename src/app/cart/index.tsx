import { OpenAPI, OrdersService, UserService } from "@/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sentry from "@sentry/react-native";
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
import IconLocation from "@/icons/IconLocation";
import IconPhone from "@/icons/PhoneIcon";
import { Ionicons } from "@expo/vector-icons";
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
  original_price?: number;
  description: string;
  seller_name: string;
  seller_phone: string | null;
  buyer_name?: string;
  buyer_phone?: string;
  post_status?: string;
  post_status_code?: string;
  book_status_code?: string;
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
  const [isLoadingOrderDetails, setIsLoadingOrderDetails] = useState(false);

  // Hàm định dạng tiền tệ
  const formatVND = (price: number) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const imgUri =
    selectedOrder?.avatar_url === "DefaultAvatarURL" ||
    !selectedOrder?.avatar_url
      ? "https://api.builder.io/api/v1/image/assets/TEMP/52fd2ccb12a0cc8215ea23e7fce4db059c2ca1aa?width=328"
      : selectedOrder.avatar_url;

  const openDetail = async (order: OrderItem) => {
    setSelectedOrder(order);
    setIsLoadingOrderDetails(true);
    setIsDetailModalVisible(true);

    try {
      const token = await AsyncStorage.getItem("access_token");
      if (token) {
        OpenAPI.BASE = "http://160.187.246.140:8000";
        OpenAPI.TOKEN = token;
      }
      const orderDetails = await OrdersService.getOrderRouteApiOrdersOrderIdGet(
        order.order_id
      );
      setSelectedOrder((prev) => ({
        ...prev,
        ...orderDetails,
        order_id: order.order_id, // Ensure order_id is preserved
      }));
    } catch (error) {
      Sentry.withScope((scope) => {
        scope.setTag("feature", "cart");
        scope.setContext("api", {
          url: UserService.getMyProfileRouteApiUserMeGet(),
          method: "GET",
        });
        scope.setLevel("error");
        Sentry.captureException(error);
      });
      console.error("Error fetching order details:", error);
    } finally {
      setIsLoadingOrderDetails(false);
    }
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
      Sentry.withScope((scope) => {
        scope.setTag("feature", "cart");
        scope.setContext("api", {
          url: UserService.getMyProfileRouteApiUserMeGet(),
          method: "GET",
        });
        scope.setLevel("error");
        Sentry.captureException(error);
      });
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
      Sentry.withScope((scope) => {
        scope.setTag("feature", "cart");
        scope.setContext("api", {
          url: UserService.getMyProfileRouteApiUserMeGet(),
          method: "GET",
        });
        scope.setLevel("error");
        Sentry.captureException(error);
      });
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
          <View className="px-6 mb-3">
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

      <Modal
        visible={isDetailModalVisible}
        transparent
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

            {isLoadingOrderDetails ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#5E3EA1" />
              </View>
            ) : selectedOrder ? (
              <>
                <ScrollView className="flex-1 px-6 pb-10">
                  <View
                    style={{ borderRadius: 16, overflow: "hidden" }}
                    className="justify-center items-center mb-4"
                  >
                    <Image
                      source={{ uri: imgUri }}
                      style={{
                        width: 237,
                        height: 313,
                        borderRadius: 16,
                        overflow: "hidden",
                      }}
                      resizeMode="cover"
                    />
                  </View>

                  <Text className="text-heading4 font-bold mt-4">
                    {selectedOrder.title}
                  </Text>

                  <View className="flex-row gap-4 mt-2">
                    <Text className="text-textGray700 text-bodyMedium">
                      Tác giả: {selectedOrder.author || "Đang cập nhật"}
                    </Text>
                    <Text className="text-textGray700 text-bodyMedium">
                      Môn: {selectedOrder.course || "Đang cập nhật"}
                    </Text>
                  </View>

                  <View className="flex-row items-baseline gap-2 mt-2">
                    <Text className="text-[#54408C] font-bold text-heading3">
                      {formatVND(selectedOrder.price)}đ
                    </Text>
                    {selectedOrder.original_price &&
                      selectedOrder.original_price > selectedOrder.price && (
                        <Text className="text-textGray400 text-bodyMedium line-through ml-2">
                          {formatVND(selectedOrder.original_price)}đ
                        </Text>
                      )}
                  </View>

                  <Text className="text-bodyMedium text-textGray700 mt-2">
                    Mô tả
                  </Text>
                  <Text className="text-textGray500 mt-2">
                    {"Trạng thái: " + selectedOrder.book_status}
                  </Text>
                  <Text className="text-textGray500">
                    Chi tiết tình trạng:{" "}
                    {selectedOrder.description || "Chưa có mô tả."}
                  </Text>

                  <View className="h-[1px] bg-gray-200 w-full my-4" />

                  <Text className="text-bodyMedium text-textGray700">
                    Thông tin giao dịch
                  </Text>

                  <View className="flex-row items-center mb-4 mt-4">
                    <View className="w-8">
                      <IconLocation size={15} />
                    </View>
                    <Text className="text-textGray500 flex-1">
                      {selectedOrder.location || "Khu A - ĐHBK"}
                    </Text>
                  </View>
                  <Pressable
                    className="flex-row items-center"
                    onPress={() => {
                      const phone = selectedOrder.seller_phone;
                      if (!phone) return;
                      Linking.openURL(`tel:${phone}`);
                    }}
                    disabled={!selectedOrder.seller_phone}
                  >
                    <View className="w-8">
                      <IconPhone size={16} />
                    </View>
                    <Text className="text-textGray500 flex-1">
                      {selectedOrder.seller_phone || "Chưa có số điện thoại"}
                    </Text>
                  </Pressable>

                  <View className="h-[1px] bg-gray-200 w-full my-4" />

                  <Text className="text-bodyMedium text-textGray700 mb-4">
                    Người bán
                  </Text>
                  <View className="flex-row items-center mb-2">
                    <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center">
                      <Ionicons name="person" size={24} color="#54408C" />
                    </View>
                    <View className="ml-3 gap-2">
                      <Text className=" text-textGray700 text-bodyMedium">
                        {selectedOrder.seller_name || "Chưa cập nhật"}
                      </Text>
                      {!!selectedOrder.order_time && (
                        <Text className="text-textGray500 text-bodyMedium">
                          Đăng {selectedOrder.order_time}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View className="h-[1px] bg-gray-200 w-full my-4" />

                  <Text className="text-bodyMedium text-textGray700 mb-4">
                    Thông tin đơn hàng
                  </Text>
                  <View className="flex-row items-center mb-4">
                    <Text className="text-textGray500 w-32">Mã đơn hàng:</Text>
                    <Text className="text-textGray700 font-medium">
                      #{selectedOrder.order_id}
                    </Text>
                  </View>
                  <View className="flex-row items-center mb-4">
                    <Text className="text-textGray500 w-32">Trạng thái:</Text>
                    <Text className="text-textGray700 font-medium">
                      {selectedOrder.order_status}
                    </Text>
                  </View>
                  <View className="flex-row items-center mb-10">
                    <Text className="text-textGray500 w-32">
                      Thời gian đặt:
                    </Text>
                    <Text className="text-textGray700 font-medium">
                      {selectedOrder.order_time}
                    </Text>
                  </View>
                </ScrollView>

                <View className="p-4 bg-white">
                  <Pressable
                    className="w-full bg-white border border-[#54408C] h-[54px] rounded-full items-center justify-center mb-2"
                    onPress={() => {
                      const phone = selectedOrder.seller_phone;
                      if (phone) Linking.openURL(`tel:${phone}`);
                    }}
                    disabled={!selectedOrder.seller_phone}
                  >
                    <Text className="text-[#54408C] font-bold text-lg">
                      Liên hệ
                    </Text>
                  </Pressable>
                  <Pressable
                    className="w-full bg-[#54408C] h-[54px] rounded-full items-center justify-center shadow-sm "
                    onPress={() => setIsDetailModalVisible(false)}
                  >
                    <Text className="text-white font-bold text-lg">Đóng</Text>
                  </Pressable>
                </View>
              </>
            ) : null}
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
