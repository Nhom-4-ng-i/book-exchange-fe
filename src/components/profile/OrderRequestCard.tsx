import { Image } from "expo-image";
import React from "react";
import { Pressable, Text, View } from "react-native";

export type RequestStatus = "pending" | "accepted" | "rejected";

interface OrderRequestCardProps {
  bookTitle: string;
  price: number;
  imageUri?: string;
  buyerName: string;
  buyerPhone: string;
  requestedAt: string;
  status?: RequestStatus;

  isFirst?: boolean;
  isLast?: boolean;
  isSingle?: boolean;

  onAccept?: () => void;
  onReject?: () => void;
  onChat?: () => void;
  onMarkSold?: () => void;
}

export function OrderRequestCard({
  bookTitle,
  price,
  imageUri,
  buyerName,
  buyerPhone,
  requestedAt,
  status = "pending",
  isFirst = false,
  isLast = false,
  isSingle = false,
  onAccept,
  onReject,
  onChat,
  onMarkSold,
}: OrderRequestCardProps) {
  const formatPrice = (value: number) =>
    new Intl.NumberFormat("vi-VN").format(value) + "đ";

  const isPending = status === "pending";
  const isAccepted = status === "accepted";
  const isRejected = status === "rejected";

  const bgColor = isAccepted
    ? "bg-[#E8FFE8]"
    : isPending
      ? "bg-[#FFF8E1]"
      : "bg-[#FFF8E1]";

  const borderColor = isAccepted
    ? "border-textGreen"
    : isPending
      ? "border-textYellow"
      : "border-textRed";

  const statusLabel = isPending
    ? "Chờ xác nhận"
    : isAccepted
      ? "Đã chấp nhận"
      : "Đã từ chối";

  const statusBgClasses = isPending
    ? "bg-gray-200"
    : isAccepted
      ? "bg-textGreen"
      : "bg-textRed";

  const statusTextClasses = isPending ? "text-textBlack" : "text-white";

  let radiusClass = "";
  if (isSingle) radiusClass = "rounded-2xl";
  else if (isFirst) radiusClass = "rounded-t-2xl";
  else if (isLast) radiusClass = "rounded-b-2xl";
  else radiusClass = "rounded-none";

  if (isRejected) {
    return (
      <View
        className={`w-full border border-[#E5E5E5] bg-white px-4 py-4 ${radiusClass}`}
      >
        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-bodySmall font-medium text-textGray600">
              {buyerName}
            </Text>

            <Text className="mt-2 text-bodySmall font-medium text-textGray600">
              {bookTitle}
            </Text>
          </View>

          <View className="rounded-full bg-textGray600 px-4 py-1">
            <Text className="text-bodySmall font-medium text-textWhite">
              Hoàn thành
            </Text>
          </View>
        </View>
      </View>
    );
  }
  return (
    <View
      className={`w-full border ${borderColor} px-4 py-4 ${bgColor} ${radiusClass}`}
    >
      <View className="flex-row items-start gap-4">
        <View className="rounded-md bg-gray-200">
          <Image
            source={{
              uri: "https://api.builder.io/api/v1/image/assets/TEMP/52fd2ccb12a0cc8215ea23e7fce4db059c2ca1aa?width=328",
            }}
            style={{ width: 60, height: 92, borderRadius: 6 }}
            contentFit="cover"
          />
        </View>

        <View className="flex-1">
          <Text className="text-bodyLarge font-medium text-textGray900">
            {bookTitle}
          </Text>
          <Text className="mt-1 text-bodyMedium font-medium text-textGreen">
            {formatPrice(price)}
          </Text>
        </View>
      </View>

      <View className="mt-4 rounded-md bg-white px-3 py-3">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-bodySmall font-medium text-textGray600">
            Người mua:
          </Text>

          <View className={`rounded-full px-3 py-1 ${statusBgClasses}`}>
            <Text
              className={`text-bodySmall font-medium px-3 ${statusTextClasses}`}
            >
              {statusLabel}
            </Text>
          </View>
        </View>

        <View className="gap-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-bodySmall">👤</Text>
            <Text className="text-bodySmall text-textGray900 font-medium">
              {buyerName}
            </Text>
          </View>

          <View className="mt-1 flex-row items-center gap-2">
            <Text className="text-bodySmall">📞</Text>
            <Text className="text-bodySmall text-textGray900 font-medium">
              {buyerPhone}
            </Text>
          </View>

          <Text className="mt-1 text-bodySmall text-textGray600">
            Yêu cầu lúc: {requestedAt}
          </Text>
        </View>
      </View>

      <View className="mt-4 flex-row items-center justify-between gap-4">
        {isPending && (
          <>
            <Pressable
              onPress={onAccept}
              className="flex-1 items-center justify-center rounded-lg bg-textGreen py-2"
            >
              <Text className="text-bodyMedium font-medium text-white">
                ✓ Chấp nhận
              </Text>
            </Pressable>

            <Pressable
              onPress={onReject}
              className="flex-1 items-center justify-center rounded-lg border border-textRed bg-white py-2"
            >
              <Text className="text-bodyMedium font-medium text-textRed">
                ✗ Từ chối
              </Text>
            </Pressable>
          </>
        )}

        {isAccepted && (
          <>
            <Pressable
              onPress={onChat}
              className="flex-1 bg-textWhite items-center justify-center rounded-lg border border-[#6A4FC3] py-2"
            >
              <Text className="text-bodyMedium font-medium text-[#6A4FC3]">
                💬 Chat
              </Text>
            </Pressable>

            <Pressable
              onPress={onMarkSold}
              className="flex-1 items-center justify-center rounded-lg bg-[#6A4FC3] py-2"
            >
              <Text className="text-bodyMedium font-medium text-white">
                ✓ Đã bán
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}
