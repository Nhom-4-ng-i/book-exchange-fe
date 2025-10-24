import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import IconFacebook from '../../../icons/IconFacebook';
import IconGoogle from '../../../icons/IconGoogle';

export default function LoginScreen() {
    return (
        <View className="flex-1 bg-white">
            <View className="flex-1 px-6 pt-4">
                <View className="mb-32">
                    <Text className="text-3xl font-bold text-black mb-2">
                        Chào mừng bạn trở lại 👋
                    </Text>
                    <Text className="text-base text-gray-500">
                        Đăng nhập vào tài khoản của bạn
                    </Text>
                </View>

                {/* === Phần Nút Đăng Nhập === */}
                <View>
                    {/* Nút Google */}
                    <Pressable
                        className="flex-row items-center justify-center bg-gray-50 border border-gray-200 rounded-full h-16 mb-6 shadow-sm"
                        style={{
                            shadowColor: '#000000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.08,
                            shadowRadius: 8,
                            elevation: 4,
                        }}
                    >
                        <View className="absolute left-6">
                            <IconGoogle />
                        </View>
                        <Text className="text-base font-semibold text-gray-800">
                            Đăng nhập với Google
                        </Text>
                    </Pressable>

                    {/* Nút Apple */}
                    <Pressable
                        className="flex-row items-center justify-center bg-gray-50 border border-gray-200 rounded-full h-16 mb-6 shadow-sm"
                        style={{
                            shadowColor: '#000000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.08,
                            shadowRadius: 8,
                            elevation: 4,
                        }}
                    >
                        <View className="absolute left-6">
                            <AntDesign name="apple" size={20} color="#000000" />
                        </View>
                        <Text className="text-base font-semibold text-gray-800">
                            Đăng nhập với Apple
                        </Text>
                    </Pressable>

                    {/* Nút Facebook */}
                    <Pressable
                        className="flex-row items-center justify-center bg-gray-50 border border-gray-200 rounded-full h-16 mb-6 shadow-sm"
                        style={{
                            shadowColor: '#000000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.08,
                            shadowRadius: 8,
                            elevation: 4,
                        }}
                    >
                        <View className="absolute left-6">
                            <IconFacebook />
                        </View>
                        <Text className="text-base font-semibold text-gray-800">
                            Đăng nhập với Facebook
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}