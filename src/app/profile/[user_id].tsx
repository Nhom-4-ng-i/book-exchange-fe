import React from 'react';
import { Text, View , Image, Pressable} from "react-native";
import PageHeader from '@/components/PageHeader';
import BottomNav from '@/components/BottomNav'
import { useLocalSearchParams } from "expo-router";
const USER_DATA = 
    {
        name : 'Võ Duy Hiệu',
        phone : '0122774909',
        posted : 8 ,
        sold : 11,
        bought : 9,
        ava : 'https://i.pravatar.cc/300?u=mrA'
    }




export default function ProfileById() {
     const { user_id } = useLocalSearchParams();
     const userId = user_id as string;
  
    return (
      <View className="flex-1 bg-white">
        <PageHeader title = 'Hồ Sơ'/>
        <View className ='flex-row border-bottom items-center justify-between p-4'>
            <View className = 'flex-row items-center gap-3 '>
                <Image source={{ uri: USER_DATA.ava }} className="w-[70px] h-[70px] rounded-[360px]" />
                <View className = 'flex-1 gap-1'>
                    <Text className = 'font-medium text-[16px]'>{USER_DATA.name}</Text>
                    <Text className = 'text-gray-500 text-[14px]] font-light'>{USER_DATA.phone}</Text>
                </View>
            </View>
            
            <Pressable>
                <Text className = 'font-bold text-red-700 text-[16px]'> Đăng Xuất </Text>
            </Pressable>
        </View>
        <View className="h-[1px] w-full bg-gray-300" />
        <View className = 'flex-row p-4'>
            <View className ='flex-1 items-center gap-1'>
                <Text className = 'text-[16px] text-[#7D64C3]'>Đã mua</Text>
                <Text className = ' text-[16px]font-medium'>{USER_DATA.bought}</Text>
            </View>
            <View  className ='flex-1 items-center gap-1'>
                <Text className = 'text-[16px] text-[#7D64C3]'>Đã bán</Text>
                <Text className = ' text-[16px]font-medium'>{USER_DATA.sold}</Text>
            </View>
            <View className ='flex-1 items-center gap-1'>
                <Text className = 'text-[16px] text-[#7D64C3]'>Đã đăng</Text>
                <Text className = ' text-[16px]font-medium'>{USER_DATA.posted}</Text>
            </View>
        </View>

        <BottomNav/>



    
      </View>
    );
  }