import React from "react";
import { Pressable, Text, View, Image, Alert } from "react-native";
import TrashIcon from '@/icons/IconTrash';

interface CartItemProps {
  orderId: number;
  bookName: string;
  seller: string;
  status: string;
  price: number;
  image: string;
  ondelete: (id: number) => void; 
  onPress: () => void; // Sửa lại: Chỉ cần gọi hàm, không cần truyền tham số ở đây
}

const formatVND = (price: number) => {
  return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function CartItem({
  orderId,
  bookName,
  seller,
  status,
  price,
  image,
  ondelete,
  onPress,
}: CartItemProps) {
  return (
    <View className="w-full bg-white">
      {/* Thẻ Pressable chính bọc toàn bộ nội dung */}
      <Pressable 
        onPress={onPress} // Gán sự kiện mở chi tiết tại đây
        className="bg-white flex-row relative rounded-[16px] p-4 gap-4 border border-[#F5F5F5] shadow-sm active:opacity-70"
      >
        {/* ẢNH SÁCH */}
        <Image
          className="w-[80px] h-[110px] rounded-[12px] bg-gray-100"
          source={{
            uri:
            image === "DefaultAvatarURL" || !image
            ? "https://api.builder.io/api/v1/image/assets/TEMP/52fd2ccb12a0cc8215ea23e7fce4db059c2ca1aa?width=328"
            : image,
          }}
          resizeMode="cover"
        />

        {/* THÔNG TIN BÊN PHẢI */}
        <View className="flex-1 justify-between py-1">
          <View className="gap-y-1">
            <Text className="text-[16px] font-bold text-gray-900" numberOfLines={1}>
              {bookName}
            </Text>
            <Text className="text-gray-500 text-[13px]">
              Người bán: <Text className="text-gray-700 font-medium">{seller}</Text>
            </Text>
          </View>

          <View className="flex-row justify-between items-end">
            <View className="gap-y-2">
              <View className="bg-[#FFEF96] rounded-full self-start px-3 py-1">
                <Text className="text-[#845330] text-[11px] font-bold">
                  {status}
                </Text>
              </View>
              <Text className="text-[#54408C] font-bold text-[16px]">
                {formatVND(price)}đ
              </Text>
            </View>
          </View>
        </View>

        {/* NÚT XOÁ (CANCEL ORDER) */}
        <Pressable
          className="absolute top-2 right-2 p-2 bg-red-50 rounded-full" 
          onPress={(e) => {
            e.stopPropagation(); // Ngăn việc hiện Detail Modal khi bấm xoá
            if (orderId) ondelete(orderId);
          }}
          hitSlop={20} // Tăng vùng chạm cho nút xoá trên iPhone
        >
          <TrashIcon width={18} height={18} color="#EF4444" />
        </Pressable>
      </Pressable>
    </View>
  );
}