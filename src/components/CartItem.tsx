import IconDelete from "@/icons/IconDelete";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

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
        className="bg-white flex-row relative rounded-lg p-2 gap-4 border border-[#EAEAEA] active:opacity-70"
      >
        {/* ẢNH SÁCH */}
        <Image
          className="w-[80px] h-[110px] rounded-lg bg-gray-100"
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
            <Text
              className="text-heading5 font-bold text-textGray900"
              numberOfLines={1}
            >
              {bookName}
            </Text>
            <Text className="text-textGray600 text-bodyMedium">
              Người bán: {seller}
            </Text>
          </View>

          <View className="flex-row justify-between items-end">
            <View className="gap-y-2">
              <View className="bg-[#FFEF96] rounded-full self-start px-4 py-1">
                <Text className="text-[#845330] text-[11px] font-semibold">
                  {status}
                </Text>
              </View>
              <Text className="text-textGray900 text-bodyMedium">
                {formatVND(price)}đ
              </Text>
            </View>
          </View>
        </View>

        {/* NÚT XOÁ (CANCEL ORDER) */}
        <Pressable
          onPress={(e) => {
            e.stopPropagation(); // Ngăn việc hiện Detail Modal khi bấm xoá
            if (orderId) ondelete(orderId);
          }}
          hitSlop={20} // Tăng vùng chạm cho nút xoá trên iPhone
        >
          <IconDelete />
        </Pressable>
      </Pressable>
    </View>
  );
}
