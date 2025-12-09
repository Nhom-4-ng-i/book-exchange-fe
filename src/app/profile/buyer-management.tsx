import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { RequestCard } from "@/components/profile/RequestCard";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft } from "lucide-react-native";

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
        <View className="px-6">
          <Text className="mb-3 text-heading5 font-bold text-textPrimary900">
            Yêu cầu mới (2)
          </Text>
          <RequestCard
            buyerName="Phạm Minh Tuấn"
            buyerNote="Sách dùng giao tiếp hằng ngày"
            bookTitle="Giải tích 2"
            price="130.000đ"
            statusLabel="Chưa đọc"
            statusColor="bg-[#F6E1D6] text-textOrange"
            showActions
          />
          <RequestCard
            buyerName="Phạm Minh Tuấn"
            buyerNote="Sách dùng giao tiếp hằng ngày"
            bookTitle="Giải tích 2"
            price="130.000đ"
            statusLabel="Đã bán"
            statusColor="bg-[#EDE7FB] text-textPrimary500"
          />
        </View>

        <View className="px-6">
          <Text className="mb-3 mt-2 text-heading5 font-bold text-textPrimary900">
            Đã chấp nhận (2)
          </Text>
          <RequestCard
            buyerName="Phạm Minh Tuấn"
            bookTitle="Giải tích 2"
            price="130.000đ"
            statusLabel="Đã bán"
            statusColor="bg-[#EDE7FB] text-textPrimary500"
            highlight
          />
          <RequestCard
            buyerName="Phạm Minh Tuấn"
            bookTitle="Giải tích 2"
            price="130.000đ"
            statusLabel="Đã bán"
            statusColor="bg-[#EDE7FB] text-textPrimary500"
            highlight
          />
        </View>

        <View className="px-6">
          <Text className="mb-3 mt-2 text-heading5 font-bold text-textPrimary900">
            Đã hoàn thành (1)
          </Text>
          <RequestCard
            buyerName="Phạm Minh Tuấn"
            bookTitle="Giải tích 2"
            price="130.000đ"
            statusLabel="Đã bán"
            statusColor="bg-[#EDE7FB] text-textPrimary500"
            footerLabel="Bạn và Phạm Minh Tuấn đã hoàn thành giao dịch. Hãy liên hệ người mua để bàn giao nhé!"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
