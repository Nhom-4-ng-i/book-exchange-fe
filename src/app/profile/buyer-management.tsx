import { OpenAPI, OrdersService, UserService } from "@/api";
import {
  OrderRequestCard,
  type RequestStatus,
} from "@/components/profile/OrderRequestCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
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

function mapStatusToEnum(statusText: string): RequestStatus | "completed" {
  switch (statusText.trim()) {
    case "Chờ xác nhận":
      return "pending";
    case "Đã chấp nhận":
      return "accepted";
    case "Bị từ chối":
      return "rejected";
    case "Đã hoàn thành":
      return "completed";
    default:
      return "pending";
  }
}

export default function BuyerManagementScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadOrders = async () => {
    try {
      await ensureAuthToken();
      const res = await UserService.getMyOrdersRouteApiUserOrdersGet();

      const normalized = res.map((item: any) => {
        const orderId = item.id ?? item.order_id;

        return {
          id: String(orderId),
          orderId,
          bookTitle: item.title,
          price: item.price,
          imageUri:
            item.avatar_url === "DefaultAvatarURL"
              ? "https://api.builder.io/api/v1/image/assets/TEMP/52fd2ccb12a0cc8215ea23e7fce4db059c2ca1aa?width=328"
              : item.avatar_url,
          buyerName: item.seller_name,
          buyerPhone: "0908090876",
          requestedAt: new Date(item.created_at).toLocaleString("vi-VN"),
          status: mapStatusToEnum(item.order_status),
        };
      });

      setOrders(normalized);
    } catch (err) {
      console.log("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const withReload = async (apiCall: () => Promise<any>) => {
    try {
      setActionLoading(true);
      await ensureAuthToken();
      await apiCall();
      await loadOrders();
    } catch (err) {
      console.log("Order action error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAccept = async (orderId: number) => {
    await withReload(() =>
      OrdersService.acceptOrderRouteApiOrdersOrderIdAcceptPost(orderId)
    );
  };

  const handleReject = async (orderId: number) => {
    await withReload(() =>
      OrdersService.rejectOrderRouteApiOrdersOrderIdRejectPost(orderId)
    );
  };

  const handleComplete = async (orderId: number) => {
    await withReload(() =>
      OrdersService.completeOrderRouteApiOrdersOrderIdCompletePost(orderId)
    );
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#5E3EA1" />
      </View>
    );
  }

  const newOrders = orders.filter((o) => o.status === "pending");
  const acceptedOrders = orders.filter((o) => o.status === "accepted");
  const completedOrders = orders.filter((o) => o.status === "completed");
  const rejectedOrders = orders.filter((o) => o.status === "rejected");

  return (
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

      {actionLoading && (
        <View className="absolute top-0 left-0 right-0 z-10 items-center justify-center py-2 bg-black/5">
          <ActivityIndicator size="small" color="#5E3EA1" />
        </View>
      )}

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* YÊU CẦU MỚI */}
        <View className="px-6 mt-2">
          <Text className="mb-4 text-heading5 font-semibold text-textPrimary900">
            Yêu cầu mới ({newOrders.length})
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
          {acceptedOrders.length === 0 ? (
            <Text className="text-center text-gray-500 w-full py-4">
              Không có yêu cầu đã chấp nhận
            </Text>
          ) : (
            acceptedOrders.map((item, index) => (
              <OrderRequestCard
                key={item.id}
                {...item}
                isFirst={index === 0}
                isLast={index === acceptedOrders.length - 1}
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
  );
}
