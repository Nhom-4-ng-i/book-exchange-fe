import { AntDesign } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import IconFacebook from '../../../icons/IconFacebook';
import IconGoogle from '../../../icons/IconGoogle';

// Cần thiết cho web
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState<any>(null);

    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: '826333210617-dogrjmu5121isqo1gdnblogr23j6qh6b.apps.googleusercontent.com',
        webClientId: '826333210617-2u5da7jc44f1ttibv621n9e2mdc5321s.apps.googleusercontent.com',
        androidClientId: '826333210617-ocer35aga9t2mp9o2f76av6d70k1ikdh.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            if (authentication?.accessToken) {
                fetchUserInfo(authentication.accessToken);
            }
        }
    }, [response]);

    const fetchUserInfo = async (accessToken: string) => {
        try {
            const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const user = await response.json();
            setUserInfo(user);
            console.log('User Info:', user);
            router.push('/success');
        } catch (error) {
            console.error('Error fetching user info:', error);
            Alert.alert('Lỗi', 'Không thể lấy thông tin người dùng');
        }
    };

    const buttonBaseClass = "flex-row items-center justify-center rounded-full h-[52px] mb-2 shadow-md border position-relative bg-gray-50 border-gray-200";
    const buttonActiveClass = "active:bg-gray-100 active:border-gray-300 active:scale-[.98] active:opacity-80";

    return (
        <View className="flex-1 bg-white">

            <View className="flex-1 px-6 pt-4 mt-28">
                <View className="mb-[131px]">
                    <Text className="text-2xl font-bold text-black mb-2">Chào mừng bạn trở lại 👋</Text>
                    <Text className="text-base text-gray-500">Đăng nhập vào tài khoản của bạn</Text>
                </View>

                <View>
                    <Pressable
                        className={`${buttonBaseClass} ${buttonActiveClass}`}
                        onPress={() => promptAsync()}
                        disabled={!request}
                    >
                        <View className="absolute left-6">
                            <IconGoogle />
                        </View>
                        <Text className="text-sm font-normal text-gray-800">Đăng nhập với Google</Text>
                    </Pressable>

                    <Pressable
                        className={`${buttonBaseClass} ${buttonActiveClass}`}
                        onPress={() => router.push('./phone')}
                    >
                        <View className="absolute left-6">
                            <AntDesign name="apple" size={20} color="#000000" />
                        </View>
                        <Text className="text-sm font-normal text-gray-800">Đăng nhập với Apple</Text>
                    </Pressable>

                    <Pressable
                        className={`${buttonBaseClass} ${buttonActiveClass}`}
                        onPress={() => promptAsync()}
                    >
                        <View className="absolute left-6">
                            <IconFacebook />
                        </View>
                        <Text className="text-sm font-normal text-gray-800">Đăng nhập với Facebook</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

