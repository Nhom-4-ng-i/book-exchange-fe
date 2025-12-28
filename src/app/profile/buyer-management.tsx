import { OpenAPI, OrdersService, UserService } from "@/api";
import {
  OrderRequestCard,
  type RequestStatus,
} from "@/components/profile/OrderRequestCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import { StatusBar } from "expo-status-bar";
import { ArrowLeft } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

async function ensureAuthToken() {
  const token = await AsyncStorage.getItem("access_token");
  if (!token) throw new Error("Missing access_token");

  OpenAPI.BASE = "http://160.187.246.140:8000";
  OpenAPI.TOKEN = token;
}

export default function BuyerManagementScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [screenKey, setScreenKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadOrders = useCallback(async (opts?: { silent?: boolean }) => {
    const silent = opts?.silent ?? false;

    try {
      if (!silent) setLoading(true);
      setError(null);
      await ensureAuthToken();

      let res;
      try {
        res = await UserService.getMySalesRouteApiUserSalesGet();
        if (!res) {
          res = { pending: [], accepted: [], completed: [], rejected: [] };
        }
      } catch (err) {
        console.error("Error fetching sales:", err);
        throw new Error(
          "Không thể tải danh sách yêu cầu. Vui lòng thử lại sau."
        );
      }

      const allOrders = [
        ...(Array.isArray(res.pending) ? res.pending : []).map((item: any) => ({
          ...item,
          status: "pending" as RequestStatus,
        })),
        ...(Array.isArray(res.accepted) ? res.accepted : []).map(
          (item: any) => ({
            ...item,
            status: "accepted" as RequestStatus,
          })
        ),
        ...(Array.isArray(res.completed) ? res.completed : []).map(
          (item: any) => ({
            ...item,
            status: "completed" as RequestStatus,
          })
        ),
        ...(Array.isArray(res.rejected) ? res.rejected : []).map(
          (item: any) => ({
            ...item,
            status: "rejected" as RequestStatus,
          })
        ),
      ];

      const normalized = allOrders.map((item: any) => ({
        id: String(item.order_id),
        orderId: item.order_id,
        bookTitle: item.title,
        price: item.price,
        imageUri:
          item.avatar_url === "DefaultAvatarURL"
            ? "https://api.builder.io/api/v1/image/assets/TEMP/52fd2ccb12a0cc8215ea23e7fce4db059c2ca1aa?width=328"
            : item.avatar_url,
        buyerName: item.buyer_name || "Người dùng",
        buyerPhone: item.buyer_phone || "Chưa cập nhật",
        requestedAt: item.order_time,
        status: item.status,
        order_status: item.order_status,
      }));

      setOrders(normalized);
      return normalized;
    } catch (err) {
      console.error("Failed to load orders:", err);
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải dữ liệu"
      );
    } finally {
      if (!silent) setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const hardReload = useCallback(() => {
    setScreenKey((k) => k + 1);
  }, []);

  const withReload = useCallback(
    async (apiCall: () => Promise<any>, message?: string) => {
      try {
        setIsSubmitting(true);
        await ensureAuthToken();
        await apiCall();

        if (message) {
          setSuccessMessage(message);
          setTimeout(() => setSuccessMessage(null), 3000);
        }

        await loadOrders({ silent: true });
      } catch (err) {
        console.error("Order action error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Đã xảy ra lỗi khi thực hiện thao tác"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [loadOrders]
  );

  const handleChat = useCallback(async (phone: string) => {
    try {
      const digits = (phone || "").replace(/[^\d+]/g, "");
      if (!digits) return;
      await Linking.openURL(`tel:${digits}`);
    } catch (e) {
      console.log("Open chat error:", e);
    }
  }, []);

  const handleAccept = useCallback(
    async (orderId: number) => {
      Alert.alert("Xác nhận", "Bạn có chắc chắn muốn chấp nhận yêu cầu này?", [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Chấp nhận",
          style: "default",
          onPress: async () => {
            await withReload(
              () =>
                OrdersService.acceptOrderRouteApiOrdersOrderIdAcceptPost(
                  orderId
                ),
              "Đã chấp nhận yêu cầu mua hàng thành công!"
            );
          },
        },
      ]);
    },
    [withReload]
  );

  const handleReject = useCallback(
    async (orderId: number) => {
      Alert.alert("Xác nhận", "Bạn có chắc chắn muốn từ chối yêu cầu này?", [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Từ chối",
          style: "destructive",
          onPress: async () => {
            await withReload(
              () =>
                OrdersService.rejectOrderRouteApiOrdersOrderIdRejectPost(
                  orderId
                ),
              "Đã từ chối yêu cầu mua hàng!"
            );
          },
        },
      ]);
    },
    [withReload]
  );

  const handleComplete = useCallback(
    async (orderId: number) => {
      Alert.alert("Xác nhận", "Bạn có chắc chắn đã bán sách này?", [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: async () => {
            await withReload(
              () =>
                OrdersService.completeOrderRouteApiOrdersOrderIdCompletePost(
                  orderId
                ),
              "Đã xác nhận bán sách thành công!"
            );
          },
        },
      ]);
    },
    [withReload]
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadOrders({ silent: true }).catch(console.error);
  }, [loadOrders]);

  useEffect(() => {
    loadOrders().catch(console.error);
  }, [loadOrders]);

  const { newOrders, acceptedOrders, completedOrders, rejectedOrders } =
    useMemo(
      () => ({
        newOrders: orders.filter((o) => o.status === "pending"),
        acceptedOrders: orders.filter((o) => o.status === "accepted"),
        completedOrders: orders.filter((o) => o.status === "completed"),
        rejectedOrders: orders.filter((o) => o.status === "rejected"),
      }),
      [orders]
    );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#5E3EA1" />
      </View>
    );
  }

  return (
    <React.Fragment key={screenKey}>
      <SafeAreaView
        className="flex-1 bg-white"
        edges={["left", "right", "bottom"]}
      >
        <StatusBar style="dark" />

        <View className="flex-row items-center justify-between px-6 py-2 h-16">
          <Pressable
            onPress={() => router.back()}
            className="rounded-full p-2 active:opacity-70"
          >
            <ArrowLeft size={22} />
          </Pressable>
          <Text className="flex-1 text-center text-xl font-bold text-textPrimary900">
            Quản lý người mua
          </Text>
          <View className="w-8" />
        </View>

        {successMessage && (
          <View className="px-6 py-2">
            <View className="bg-green-100 border border-green-400 rounded-lg p-3">
              <Text className="text-green-700 text-center">
                {successMessage}
              </Text>
            </View>
          </View>
        )}

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#5E3EA1"]}
              tintColor="#5E3EA1"
            />
          }
        >
          {error && (
            <View className="px-6 py-2 bg-red-50">
              <Text className="text-red-600 text-center">{error}</Text>
            </View>
          )}
          {/* YÊU CẦU MỚI */}
          <View className="px-6 mt-2">
            <Text className="mb-4 text-heading5 font-semibold text-textPrimary900">
              Yêu cầu mới ({newOrders.length})
            </Text>
            <Text className="mb-4 text-bodyMedium text-textGray600">
              Có người muốn mua sách của bạn. Chấp nhận để chia sẻ thông tin
              liên hệ.
            </Text>

            {newOrders.length === 0 ? (
              <Text className="text-center text-gray-500 w-full py-4">
                Không có yêu cầu mới
              </Text>
            ) : (
              newOrders.map((item, index) => (
                <OrderRequestCard
                  key={item.id}
                  {...item}
                  isSingle={newOrders.length === 1}
                  isFirst={index === 0}
                  isLast={index === newOrders.length - 1}
                  onAccept={() => handleAccept(item.orderId)}
                  onReject={() => handleReject(item.orderId)}
                />
              ))
            )}
          </View>

          {/* ĐÃ CHẤP NHẬN */}
          <View className="px-6">
            <Text className="mb-4 mt-6 text-heading5 font-semibold text-textPrimary900">
              Đã chấp nhận ({acceptedOrders.length})
            </Text>
            <Text className="mb-4 text-bodyMedium text-textGray600">
              Sách đang chờ giao dịch. Hãy liên hệ người mua để hẹn gặp.
            </Text>

            {acceptedOrders.length === 0 ? (
              <Text className="text-center text-gray-500 w-full py-4">
                Không có yêu cầu đã chấp nhận
              </Text>
            ) : (
              acceptedOrders.map((item, index) => (
                <OrderRequestCard
                  key={item.id}
                  {...item}
                  isSingle={acceptedOrders.length === 1}
                  isFirst={index === 0}
                  isLast={index === acceptedOrders.length - 1}
                  onChat={() => handleChat(item.buyerPhone)}
                  onMarkSold={() => handleComplete(item.orderId)}
                  onReject={() => handleReject(item.orderId)}
                />
              ))
            )}
          </View>

          {/* BỊ TỪ CHỐI */}
          <View className="px-6">
            <Text className="mb-4 mt-6 text-heading5 font-bold text-textPrimary900">
              Bị từ chối ({rejectedOrders.length})
            </Text>
            <Text className="mb-4 text-bodyMedium text-textGray600">
              Sách đã bị từ chối.
            </Text>

            {rejectedOrders.length === 0 ? (
              <Text className="text-center text-gray-500 w-full py-4">
                Không có yêu cầu bị từ chối
              </Text>
            ) : (
              rejectedOrders.map((item, index) => (
                <OrderRequestCard
                  key={item.id}
                  isSingle={rejectedOrders.length === 1}
                  {...item}
                  isFirst={index === 0}
                  isLast={index === rejectedOrders.length - 1}
                />
              ))
            )}
          </View>

          {/* ĐÃ HOÀN THÀNH */}
          <View className="px-6">
            <Text className="mb-4 mt-6 text-heading5 font-bold text-textPrimary900">
              Đã hoàn thành ({completedOrders.length})
            </Text>

            {completedOrders.length === 0 ? (
              <Text className="text-center text-gray-500 w-full py-4">
                Không có yêu cầu đã hoàn thành
              </Text>
            ) : (
              completedOrders.map((item, index) => (
                <OrderRequestCard
                  key={item.id}
                  isSingle={completedOrders.length === 1}
                  {...item}
                  isFirst={index === 0}
                  isLast={index === completedOrders.length - 1}
                />
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </React.Fragment>
  );
}
