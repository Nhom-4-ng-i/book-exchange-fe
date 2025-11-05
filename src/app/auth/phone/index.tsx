import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View
} from 'react-native';
import Header from '../../../components/Header';
import IconPhone from '../../../icons/IconPhone';

export default function PhoneNumberScreen() {
  const router = useRouter();
  const [digits, setDigits] = useState<string>('');

  const countryCode = '(+965)';

  const formatted = useMemo(() => {
    const s = digits.replace(/\D/g, '');
    const parts: string[] = [];
    for (let i = 0; i < s.length; i += 3) parts.push(s.slice(i, i + 3));
    return parts.join(' ');
  }, [digits]);

  const onTextChange = (text: string) => {
    const newDigits = text.replace(/\D/g, '');
    if (newDigits.length <= 15) {
      setDigits(newDigits);
    }
  };

  const canContinue = digits.length >= 6;

  return (
    <View className="flex-1 bg-white h-full">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <Header showBackButton showSkipButton/>
        
        <View className="flex-1 px-6 mb-6">
          <Text className="text-2xl font-bold text-center mt-4">Số điện thoại</Text>
          <Text className="text-[#A6A6A6] text-center mt-2 mb-6 font-normal">
            Vui lòng nhập số điện thoại của bạn để chúng tôi có thể giao hàng dễ dàng hơn
          </Text>

          <View className="mt-2">
            <Text className="font-medium mb-2 text-sm">Số điện thoại</Text>
            <View className="flex-row justify-center items-center bg-gray-50 rounded-lg h-14 px-3">
              <View className="flex-row items-center mr-1">
                <IconPhone />
                <Text className="ml-1 text-base text-gray-900 font-semibold">
                  {countryCode}
                </Text>
              </View>
              
              <TextInput
                className="flex-1 text-base text-gray-900 py-3"
                value={formatted}
                onChangeText={onTextChange}
                placeholder="123 435 7565"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                maxLength={15 + 4}
              />
            </View>
          </View>

          <View className="h-20" />
          
          <Pressable
            disabled={!canContinue}
            onPress={() => router.push('./')}
            className="bg-primary h-14 rounded-[28px] items-center justify-center active:opacity-85 disabled:bg-violet-300"
          >
            <Text className="text-white font-bold text-base">Tiếp tục</Text>
          </Pressable>
        </View>

      </KeyboardAvoidingView>
    </View>
  );
}

