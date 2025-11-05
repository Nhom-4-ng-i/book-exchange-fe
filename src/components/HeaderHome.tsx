import IconMessenger from '@/icons/IconMessenger';
import IconNotification from '@/icons/IconNotification';
import IconSearch from '@/icons/IconSearch';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface AppHeaderProps {
  title: string;
  onSearchPress?: () => void;
  onChatPress?: () => void;
  onBellPress?: () => void;
}

export default function AppHeader({
  title,
  onSearchPress,
  onChatPress,
  onBellPress,
}: AppHeaderProps) {
  return (
    <View className="bg-white z-50 border-b border-gray-100 pt-4">
      <View className="px-4 py-2 flex-row items-center">
        <Pressable
          onPress={onSearchPress}
          className="w-10 h-10 flex items-center justify-center rounded-xl"
        >
          <IconSearch />
        </Pressable>

        <View className="flex-1 items-center">
          <Text className="text-xl font-bold tracking-tight text-gray-900">
            {title}
          </Text>
        </View>

        <View className="w-10 flex-row items-center justify-end gap-2">
          <Pressable
            onPress={onChatPress}
            className="w-10 h-10 flex items-center justify-center"
          >
            <IconMessenger />
          </Pressable>
          <Pressable
            onPress={onBellPress}
            className="w-10 h-10 flex items-center justify-center relative"
          >
            <IconNotification />
            <View className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

