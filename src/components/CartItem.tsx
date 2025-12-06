import React from "react";
import { Pressable, Text, View, Image } from "react-native";

interface CartItemProps {
  bookName: string;
  seller: string;
  status: string;
  price: string;
  image: string; // URL
}

export default function CartItem({
  bookName,
  seller,
  status,
  price,
  image,
}: CartItemProps) {
  return (
    <View className="w-full flex-row bg-white">
      {/* khoảng cách hai bên */}
      <View className="w-[10px]" />

      <Pressable className="bg-white flex-row flex-1 rounded-[15px] p-4 gap-6 border border-[#EAEAEA]">
        {/* ẢNH */}
        <Image
          className="w-[70px] h-[110px] rounded-[8px]"
          source={{ uri: image }}
          resizeMode="cover"
        />

        {/* TEXT BÊN PHẢI */}
        <View className="flex flex-1 gap-2">
          <Text className="text-[16px] font-semibold">{bookName}</Text>
          <Text className="text-gray-600 text-[14px]">
            Người bán: {seller}
          </Text>

          <View className="bg-[#FFEF96] rounded-[15px] p-2 self-start px-6">
            <Text className="text-[#845330] text-[12px] font-bold">
              {status}
            </Text>
          </View>

          <Text className="text-gray-900 text-[14px]">{price}</Text>
        </View>
      </Pressable>

      <View className="w-[10px]" />
    </View>
  );
}
