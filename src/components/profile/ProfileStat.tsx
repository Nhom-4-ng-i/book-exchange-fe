import React from "react";
import { Text, View } from "react-native";

interface ProfileStatProps {
  label: string;
  value: number | string;
}

export function ProfileStat({ label, value }: ProfileStatProps) {
  return (
    <View className="items-center flex-1">
      <Text className="text-xl font-semibold text-textPrimary500">{value}</Text>
      <Text className="text-sm text-textGray700">{label}</Text>
    </View>
  );
}
