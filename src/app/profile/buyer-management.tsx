import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  OrderRequestCard,
  type RequestStatus,
} from "@/components/profile/OrderRequestCard";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft } from "lucide-react-native";

const orders = [
  {
    id: "ord_001",
    bookTitle: "Giải tích 2",
    price: 120000,
    imageUri:
      "https://api.builder.io/api/v1/image/assets/TEMP/52fd2ccb12a0cc8215ea23e7fce4db059c2ca1aa?width=328",
    buyerName: "Phạm Minh Tuấn",
    buyerPhone: "0908070605",
    requestedAt: "07:00:00 8/2/2025",
    status: "pending" as RequestStatus,
  },
  {
    id: "ord_002",
    bookTitle: "Giải tích 2",
    price: 120000,
    imageUri:
      "https://api.builder.io/api/v1/image/assets/TEMP/52fd2ccb12a0cc8215ea23e7fce4db059c2ca1aa?width=328",
    buyerName: "Nguyễn Thành Đạt",
    buyerPhone: "0935123456",
    requestedAt: "09:15:00 9/2/2025",
    status: "pending" as RequestStatus,
  },
];

const orders2 = [
  {
    id: "ord_001",
    bookTitle: "Giải tích 2",
    price: 120000,
    imageUri:
      "https://api.builder.io/api/v1/image/assets/TEMP/52fd2ccb12a0cc8215ea23e7fce4db059c2ca1aa?width=328",
    buyerName: "Phạm Minh Tuấn",
    buyerPhone: "0908070605",
    requestedAt: "07:00:00 8/2/2025",
    status: "accepted" as RequestStatus,
  },
  {
    id: "ord_002",
    bookTitle: "Giải tích 2",
    price: 120000,
    imageUri:
      "https://api.builder.io/api/v1/image/assets/TEMP/52fd2ccb12a0cc8215ea23e7fce4db059c2ca1aa?width=328",
    buyerName: "Nguyễn Thành Đạt",
    buyerPhone: "0935123456",
    requestedAt: "09:15:00 9/2/2025",
    status: "accepted" as RequestStatus,
  },
];

const orders3 = [
  {
    id: "ord_001",
    bookTitle: "Giải tích 2",
    price: 120000,
    imageUri:
      "https://api.builder.io/api/v1/image/assets/TEMP/52fd2ccb12a0cc8215ea23e7fce4db059c2ca1aa?width=328",
    buyerName: "Phạm Minh Tuấn",
    buyerPhone: "0908070605",
    requestedAt: "07:00:00 8/2/2025",
    status: "rejected" as RequestStatus,
  },
  {
    id: "ord_002",
    bookTitle: "Giải tích 2",
    price: 120000,
    imageUri:
      "https://api.builder.io/api/v1/image/assets/TEMP/52fd2ccb12a0cc8215ea23e7fce4db059c2ca1aa?width=328",
    buyerName: "Nguyễn Thành Đạt",
    buyerPhone: "0935123456",
    requestedAt: "09:15:00 9/2/2025",
    status: "rejected" as RequestStatus,
  },
];

export default function BuyerManagementScreen() {
  const router = useRouter();

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

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-6 mt-2">
          <Text className="mb-4 text-heading5 font-semibold text-textPrimary900">
            Yêu cầu mới (2)
          </Text>

          <Text className="mb-4 text-bodyMedium font-normal text-textGray600">
            Có người muốn mua sách của bạn. Chấp nhận để chia sẻ thông tin liên
            hệ.
          </Text>

          {orders.map((item, index) => (
            <OrderRequestCard
              key={item.id}
              {...item}
              isSingle={orders.length === 1}
              isFirst={index === 0 && orders.length > 1}
              isLast={index === orders.length - 1 && orders.length > 1}
              onAccept={() => console.log("Accept:", item.id)}
              onReject={() => console.log("Reject:", item.id)}
            />
          ))}
        </View>

        <View className="px-6">
          <Text className="mb-4 mt-6 text-heading5 font-semibold text-textPrimary900">
            Đã chấp nhận (2)
          </Text>

          <Text className="mb-4 text-bodyMedium font-normal text-textGray600">
            Sách đang chờ giao dịch. Hãy liên hệ người mua để hẹn gặp.
          </Text>

          {orders2.map((item, index) => (
            <OrderRequestCard
              key={item.id}
              {...item}
              isSingle={orders.length === 1}
              isFirst={index === 0 && orders.length > 1}
              isLast={index === orders.length - 1 && orders.length > 1}
              onAccept={() => console.log("Accept:", item.id)}
              onReject={() => console.log("Reject:", item.id)}
            />
          ))}
        </View>

        <View className="px-6">
          <Text className="mb-4 mt-6 text-heading5 font-bold text-textPrimary900">
            Đã hoàn thành (1)
          </Text>
          {orders3.map((item, index) => (
            <OrderRequestCard
              key={item.id}
              {...item}
              isSingle={orders.length === 1}
              isFirst={index === 0 && orders.length > 1}
              isLast={index === orders.length - 1 && orders.length > 1}
              onAccept={() => console.log("Accept:", item.id)}
              onReject={() => console.log("Reject:", item.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
