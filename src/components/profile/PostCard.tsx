import React from "react";
import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { Pencil, Trash2 } from "lucide-react-native";

interface PostCardProps {
  title: string;
  category: string;
  condition: string;
  price: string;
  status: string;
}

export function PostCard({ title, category, condition, price, status }: PostCardProps) {
  const statusColor = status === "Đã bán" ? "bg-textPrimary50 text-textPrimary500" : "bg-textGray100 text-textGray700";

  return (
    <View className="mb-4 flex-row gap-3 rounded-2xl border border-textGray200 bg-white p-3 shadow-sm">
      <Image
        source={{ uri: "https://images.unsplash.com/photo-1544731612-de7f96afe55f?auto=format&fit=crop&w=160&q=60" }}
        className="h-28 w-20 rounded-xl"
      />
      <View className="flex-1 gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-semibold text-textPrimary900">{title}</Text>
          <View className="flex-row gap-2">
            <Pressable className="rounded-full border border-textGray200 p-1">
              <Pencil size={16} color="#54408C" />
            </Pressable>
            <Pressable className="rounded-full border border-textGray200 p-1">
              <Trash2 size={16} color="#EF5A56" />
            </Pressable>
          </View>
        </View>
        <Text className="text-sm text-textGray700">{category}</Text>
        <View className="flex-row items-center gap-2">
          <View className="rounded-full bg-textGray100 px-3 py-1">
            <Text className="text-xs font-semibold text-textPrimary900">{condition}</Text>
          </View>
          <View className={`rounded-full px-3 py-1 ${statusColor}`}>
            <Text className="text-xs font-semibold">{status}</Text>
          </View>
        </View>
        <Text className="text-base font-bold text-textPrimary900">{price}</Text>
      </View>
    </View>
  );
}
