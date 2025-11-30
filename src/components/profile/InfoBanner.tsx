import React from "react";
import { Text, View } from "react-native";
import { Lightbulb } from "lucide-react-native";

interface InfoBannerProps {
  message: string;
}

export function InfoBanner({ message }: InfoBannerProps) {
  return (
    <View className="mb-4 flex-row items-start gap-3 rounded-2xl bg-[#F5F1FF] px-4 py-3">
      <Lightbulb size={20} color="#54408C" />
      <Text className="flex-1 text-sm text-textGray800">{message}</Text>
    </View>
  );
}
