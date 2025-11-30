import React from "react";
import { Pressable, Text, View } from "react-native";
import { Bell, Pencil, Trash2 } from "lucide-react-native";

interface WishlistCardProps {
  title: string;
  subject: string;
  price: string;
  createdAt: string;
}

export function WishlistCard({ title, subject, price, createdAt }: WishlistCardProps) {
  return (
    <View className="mb-4 rounded-2xl border border-textGray200 bg-white p-4">
      <View className="mb-2 flex-row items-center justify-between">
        <View>
          <Text className="text-base font-semibold text-textPrimary900">{title}</Text>
          <Text className="text-sm text-textGray700">{subject}</Text>
        </View>
        <View className="flex-row gap-2">
          <Pressable className="rounded-full border border-textGray200 p-2">
            <Pencil size={16} color="#54408C" />
          </Pressable>
          <Pressable className="rounded-full border border-textGray200 p-2">
            <Trash2 size={16} color="#EF5A56" />
          </Pressable>
        </View>
      </View>
      <View className="flex-row items-center justify-between">
        <View className="gap-1">
          <Text className="text-xs font-semibold text-textGray700">Giá tối đa (không bắt buộc)</Text>
          <Text className="text-base font-semibold text-textPrimary900">{price}</Text>
          <Text className="text-xs text-textGray700">Tạo lúc: {createdAt}</Text>
        </View>
        <View className="items-center rounded-xl bg-textPrimary50 px-3 py-2">
          <Bell size={18} color="#54408C" />
          <Text className="mt-1 text-xs font-semibold text-textPrimary500">Bạn sẽ nhận</Text>
          <Text className="text-xs font-semibold text-textPrimary500">thông báo khi</Text>
          <Text className="text-xs font-semibold text-textPrimary500">có sách khớp</Text>
        </View>
      </View>
    </View>
  );
}
