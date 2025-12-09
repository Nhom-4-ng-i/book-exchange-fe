import React from "react";
import { Text, View } from "react-native";

interface InfoBannerProps {
  message: string;
}

export function InfoBanner({ message }: InfoBannerProps) {
  return (
    <View className="mb-4 flex-row items-start gap-3 rounded-lg border border-textBlue bg-[#EBF3FF] px-2 py-3">
      <Text className="flex-1 text-sm font-medium text-textBlue">
        {message}
      </Text>
    </View>
  );
}
