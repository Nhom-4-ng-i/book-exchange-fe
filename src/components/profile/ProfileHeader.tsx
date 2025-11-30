import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface ProfileHeaderProps {
  name: string;
  phone: string;
  onLogout?: () => void;
  avatarUri?: string;
}

export function ProfileHeader({ name, phone, onLogout, avatarUri }: ProfileHeaderProps) {
  return (
    <View className="flex-row items-center gap-4 px-6 pt-6 pb-4">
      <View className="h-14 w-14 overflow-hidden rounded-full bg-textPrimary100">
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} className="h-full w-full" resizeMode="cover" />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-lg font-semibold text-textPrimary500">BK</Text>
          </View>
        )}
      </View>
      <View className="flex-1">
        <Text className="text-lg font-semibold text-textPrimary900">{name}</Text>
        <Text className="text-base text-textGray700">{phone}</Text>
      </View>
      <Pressable onPress={onLogout} className="rounded-md bg-transparent p-2">
        <Text className="text-base font-semibold text-textPrimary500">Đăng xuất</Text>
      </Pressable>
    </View>
  );
}
