import IconEdit from "@/icons/IconEdit";
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
    <View className="flex-row items-center gap-4 px-6 pt-4 pb-4 border-b border-b-gray-100">
      <View className="h-14 w-14 overflow-hidden rounded-full bg-textPrimary100">
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} className="h-full w-full" resizeMode="cover" />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-lg font-semibold text-textPrimary500">BK</Text>
          </View>
        )}
      </View>
      <View className="flex-1 gap-[2px]">
        <Text className="text-heading6 font-semibold text-textGray900">{name}</Text>
        <View className="flex-1 flex-row items-center gap-2">
          <Text className="text-bodyMedium text-textGray500">{phone}</Text>
          <IconEdit />
        </View>
      </View>
      <Pressable onPress={onLogout} className="rounded-md bg-transparent p-2">
        <Text className="text-bodyMedium font-semibold text-textRed">Đăng xuất</Text>
      </Pressable>
    </View>
  );
}
