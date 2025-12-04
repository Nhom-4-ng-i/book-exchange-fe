import React from "react";
import { Text, View } from "react-native";

interface ProfileStatProps {
  label: string;
  value: number | string;
}

export function ProfileStat({ label, value }: ProfileStatProps) {
  return (
    <View className="items-center flex-1">
      <Text className="text-bodyLarge font-semibold text-textPrimary400">{value}</Text>
      <Text className="text-bodyLarge text-textGray900">{label}</Text>
    </View>
  );
}
