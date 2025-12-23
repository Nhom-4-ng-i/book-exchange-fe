import IconEdit2 from "@/icons/IconEdit2";
import { Trash2 } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface WishlistCardProps {
  title: string;
  subject: string;
  price: string;
  createdAt: string;
}

export function WishlistCard({
  title,
  subject,
  price,
  createdAt,
}: WishlistCardProps) {
  return (
    <View className="mb-4 rounded-lg border border-[#54408C] bg-[#EEEBF5] p-2">
      <View className="mb-2 flex-row justify-between">
        <View>
          <Text className="text-heading5 font-semibold text-textPrimary900 mb-2">
            {title}
          </Text>
          <View className="flex-row items-center gap-3">
            <Text className="text-sm text-textGray900 bg-textWhite px-3 py-0.5 border border-textGray200 rounded-2xl">
              {subject}
            </Text>
            <Text className="text-sm text-textGray900 bg-textWhite px-3 py-0.5 border border-textGray200 rounded-2xl">
              {price}
            </Text>
          </View>
        </View>
        <View className="flex-row gap-2">
          <Pressable>
            <IconEdit2 />
          </Pressable>
          <Pressable>
            <Trash2 size={16} color="#EF5A56" />
          </Pressable>
        </View>
      </View>
      <View className="gap-1">
        {/* <Text className="text-xs font-semibold text-textGray700">
          Giá tối đa (không bắt buộc)
        </Text> */}
        <Text className="text-xs text-textGray600">Tạo lúc: {createdAt}</Text>
      </View>
      <View className="rounded-lg bg-textWhite px-2 py-2 mt-2">
        <Text className="text-xs font-normal text-textGray600">
          🔔 Bạn sẽ nhận thông báo khi có sách khớp
        </Text>
      </View>
    </View>
  );
}
