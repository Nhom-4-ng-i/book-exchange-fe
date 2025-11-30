import React from "react";
import { Pressable, Text, View } from "react-native";

interface ProfileActionCardProps {
  icon: React.ReactNode;
  label: string;
  badgeCount?: number;
  onPress?: () => void;
}

export function ProfileActionCard({ icon, label, badgeCount, onPress }: ProfileActionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between rounded-2xl border border-textGray200 bg-white px-4 py-3"
    >
      <View className="flex-row items-center gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-xl bg-textPrimary50">
          {icon}
        </View>
        <Text className="text-base font-semibold text-textPrimary900">{label}</Text>
      </View>
      {badgeCount ? (
        <View className="min-w-6 items-center justify-center rounded-full bg-textRed px-2 py-[2px]">
          <Text className="text-xs font-semibold text-white">{badgeCount}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}
