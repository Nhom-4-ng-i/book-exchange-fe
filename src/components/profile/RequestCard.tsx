import { Image } from "expo-image";
import { Check, Phone, X } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface RequestCardProps {
  buyerName: string;
  buyerNote?: string;
  bookTitle: string;
  price: string;
  statusLabel: string;
  statusColor: string;
  onApprove?: () => void;
  onReject?: () => void;
  showActions?: boolean;
  highlight?: boolean;
  footerLabel?: string;
}

export function RequestCard({
  buyerName,
  buyerNote,
  bookTitle,
  price,
  statusLabel,
  statusColor,
  onApprove,
  onReject,
  showActions = false,
  highlight = false,
  footerLabel,
}: RequestCardProps) {
  return (
    <View
      className={`mb-4 rounded-2xl border border-textGray200 bg-white p-4 ${highlight ? "shadow" : ""}`}
    >
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-base font-semibold text-textPrimary900">
            {buyerName}
          </Text>
          {buyerNote ? (
            <Text className="text-sm text-textGray700">"{buyerNote}"</Text>
          ) : null}
        </View>
        <Pressable className="flex-row items-center gap-2 rounded-full bg-textPrimary50 px-3 py-2">
          <Phone size={16} color="#54408C" />
          <Text className="text-sm font-semibold text-textPrimary500">Gọi</Text>
        </Pressable>
      </View>

      <View className="mt-3 flex-row gap-3 rounded-2xl bg-textGray50 p-3">
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1544731612-de7f96afe55f?auto=format&fit=crop&w=160&q=60",
          }}
          className="h-24 w-20 rounded-xl"
        />
        <View className="flex-1 gap-1">
          <Text className="text-base font-semibold text-textPrimary900">
            {bookTitle}
          </Text>
          <Text className="text-sm text-textGray700">Ngoại ngữ</Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View className="rounded-full bg-textPrimary50 px-3 py-1">
                <Text className="text-xs font-semibold text-textPrimary500">
                  Chưa đọc
                </Text>
              </View>
              <View className={`rounded-full px-3 py-1 ${statusColor}`}>
                <Text className="text-xs font-semibold">{statusLabel}</Text>
              </View>
            </View>
            <Text className="text-base font-bold text-textPrimary900">
              {price}
            </Text>
          </View>
        </View>
      </View>

      {showActions ? (
        <View className="mt-3 flex-row gap-3">
          <Pressable
            className="flex-1 items-center rounded-full border border-textGray300 bg-white py-3"
            onPress={onReject}
          >
            <Text className="text-sm font-semibold text-textGray700">
              Từ chối
            </Text>
          </Pressable>
          <Pressable
            className="flex-1 items-center rounded-full bg-textPrimary500 py-3"
            onPress={onApprove}
          >
            <Text className="text-sm font-semibold text-white">Chấp nhận</Text>
          </Pressable>
        </View>
      ) : footerLabel ? (
        <View className="mt-3 flex-row items-center justify-between rounded-full bg-textGray100 px-4 py-3">
          <View className="flex-row items-center gap-2">
            <View className="h-5 w-5 items-center justify-center rounded-full bg-textGray700">
              <Check size={12} color="#fff" />
            </View>
            <Text className="text-sm font-semibold text-textPrimary900">
              {footerLabel}
            </Text>
          </View>
          <Text className="text-sm font-semibold text-textGray700">Đã bán</Text>
        </View>
      ) : null}

      {!showActions && !footerLabel ? (
        <View className="mt-3 flex-row items-center gap-2 rounded-full bg-textGray100 px-4 py-3">
          <X size={14} color="#EF5A56" />
          <Text className="text-sm font-semibold text-textPrimary900">
            Bạn đã từ chối yêu cầu mua sách này.
          </Text>
        </View>
      ) : null}
    </View>
  );
}
