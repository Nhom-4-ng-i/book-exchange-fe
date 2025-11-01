import { AntDesign } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import IconFacebook from '../../../icons/IconFacebook';
import IconGoogle from '../../../icons/IconGoogle';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const router = useRouter();

    const [googlePressed, setGooglePressed] = useState(false);
    const [applePressed, setApplePressed] = useState(false);
    const [facebookPressed, setFacebookPressed] = useState(false);
    const [userInfo, setUserInfo] = useState<any>(null);

    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: '826333210617-dogrjmu5121isqo1gdnblogr23j6qh6b.apps.googleusercontent.com',
        androidClientId: '826333210617-ocer35aga9t2mp9o2f76av6d70k1ikdh.apps.googleusercontent.com',
        webClientId: '826333210617-2u5da7jc44f1ttibv621n9e2mdc5321s.apps.googleusercontent.com',
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
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        const user = await res.json();
        setUserInfo(user);
        console.log('Google user:', user);

        router.push('/success');

        } catch (err) {
            console.warn('Failed to fetch user info', err);
        }
    };

    const getButtonStyle = (isPressed: boolean) => ({
        backgroundColor: isPressed ? '#f3f4f6' : '#f9fafb',
        borderColor: isPressed ? '#d1d5db' : '#e5e7eb',
        transform: [{ scale: isPressed ? 0.98 : 1 }],
        opacity: isPressed ? 0.8 : 1,
    });

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>Chào mừng bạn trở lại 👋</Text>
                    <Text style={styles.subtitle}>Đăng nhập vào tài khoản của bạn</Text>
                </View>

                <View>
                    <Pressable
                        style={({ pressed }) => [styles.button, getButtonStyle(pressed || googlePressed)]}
                        onPressIn={() => setGooglePressed(true)}
                        onPressOut={() => setGooglePressed(false)}
                        onPress={() => {
                        if (!request) {
                            console.warn('Google auth request not ready yet');
                            return;
                        }
                        promptAsync();
                        }}
                    >
                        <View style={styles.iconLeft}>
                        <IconGoogle />
                        </View>
                        <Text style={styles.buttonText}>Đăng nhập với Google</Text>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            getButtonStyle(pressed || applePressed),
                        ]}
                        onPressIn={() => setApplePressed(true)}
                        onPressOut={() => setApplePressed(false)}
                        onPress={() => router.push('./phone')}
                    >
                        <View style={styles.iconLeft}>
                            <AntDesign name="apple" size={20} color="#000000" />
                        </View>
                        <Text style={styles.buttonText}>Đăng nhập với Apple</Text>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            getButtonStyle(pressed || facebookPressed),
                        ]}
                        onPressIn={() => setFacebookPressed(true)}
                        onPressOut={() => setFacebookPressed(false)}
                        onPress={() => console.log('Login with Facebook')}
                    >
                        <View style={styles.iconLeft}>
                            <IconFacebook />
                        </View>
                        <Text style={styles.buttonText}>Đăng nhập với Facebook</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    innerContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    header: {
        marginBottom: 131,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9999,
        height: 52,
        marginBottom: 8,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        position: 'relative',
    },
    iconLeft: {
        position: 'absolute',
        left: 24,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '400',
        color: '#1f2937',
    },
});
