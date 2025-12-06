import IconMessenger from '@/icons/IconMessenger';
import IconNotification from '@/icons/IconNotification';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface AppHeaderCart {
    title : String , 
    onChatPress?: () => void;
    onBellPress?: () => void;
}

export default function AppHeaderCart({
    title,
    onChatPress,
    onBellPress,
}: AppHeaderCart){
    return(
        <View className="bg-white z-50 border-b border-gray-100 pt-4">
            <View className="px-4 py-2 flex-row items-center">
                <View className = 'w-10 h-10'></View>
                {/* title chính giữa */}
                <View className = 'flex-1 items-center'>
                <Text className="text-xl font-bold tracking-tight text-gray-900">
                   {title}
                </Text>
                </View>
                {/* nhóm 2 cái nút tin nhắn và thông báo */}
        <View className="w-10 flex-row items-center justify-end gap-1">
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
    )
}