import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import IconSuccess from '../icons/IconSuccess';


export default function SuccessScreen() {
  
  const handleStart = () => {
    router.replace('/home'); 
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['left', 'right', 'bottom']}>
      <View className="flex-1" /> 

      <View className="items-center px-6">
        <IconSuccess/>
        <Text className="text-2xl font-bold text-black mb-2 mt-10">
          Cập nhật thành công
        </Text>
        <Text className="text-base text-[#A6A6A6] text-center">
          Bạn đã cập nhật thành công các thông tin, hãy tận hưởng phần mềm tuyệt vời nhất !
        </Text>
      </View>

      <View className="p-6 pt-10">
        <Pressable 
          className="bg-textPrimary500 h-12 rounded-full items-center justify-center active:opacity-80"
          onPress={handleStart}
        >
          <Text className="text-white font-bold text-base">Bắt đầu</Text>
        </Pressable>
      </View>
      
      <View className="flex-1" />
    </SafeAreaView>
  );
}
