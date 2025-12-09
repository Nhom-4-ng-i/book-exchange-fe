import IconDelete from "@/icons/IconDelete";
import IconEdit2 from "@/icons/IconEdit2";
import { Image } from "expo-image";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface PostCardProps {
  title: string;
  category: string;
  condition: string;
  price: string;
  status: string;
}

export function PostCard({
  title,
  category,
  condition,
  price,
  status,
}: PostCardProps) {
  return (
    <View
      className={`mb-4 flex-row gap-3 rounded-lg border border-[#EAEAEA] bg-white p-2 ${
        status === "Đã bán" ? "opacity-50" : ""
      }`}
      pointerEvents={status === "Đã bán" ? "none" : "auto"}
    >
      <Image
        source={{
          uri: "https://api.builder.io/api/v1/image/assets/TEMP/52fd2ccb12a0cc8215ea23e7fce4db059c2ca1aa?width=328",
        }}
        style={{ width: 60, height: 92, borderRadius: 6 }}
        contentFit="cover"
      />
      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-[2px]">
          <Text className="text-heading5 font-bold text-textPrimary900">
            {title}
          </Text>
          <View className="flex-row gap-2">
            <Pressable>
              <IconEdit2 />
            </Pressable>
            <Pressable>
              <IconDelete />
            </Pressable>
          </View>
        </View>
        <Text className="mb-2 text-bodyMedium text-textGray600">
          {category}
        </Text>
        <View className="mb-2 flex-row items-center gap-2">
          <View
            className={`rounded-full px-4 py-1 ${
              condition === "Chưa đọc" ? "bg-[#e5e5e5]" : "bg-textGray900"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                condition === "Chưa đọc" ? "text-textPrimary900" : "text-white"
              }`}
            >
              {condition}
            </Text>
          </View>
        </View>
        <Text className="text-bodyMedium font-normal text-textGray900">
          {price}
        </Text>
      </View>
    </View>
  );
}
