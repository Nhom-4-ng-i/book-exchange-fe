import IconLink from "@/icons/IconLink";
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
      className="flex-row items-center justify-between rounded-2xl bg-white py-4"
    >
      <View className="flex-row items-center gap-4">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-textPrimary50">
          {icon}
        </View>
        <Text className="text-base font-semibold text-textPrimary900">{label}</Text>
        {badgeCount ? (
        <View className="min-w-6 items-center justify-center rounded-full bg-textRed px-2 py-[2px]">
          <Text className="text-xs font-semibold text-white">{badgeCount}</Text>
        </View>
      ) : null}
      </View>
      <View className="py-1 px-2">
        <IconLink />
      </View>
    </Pressable>
  );
}
