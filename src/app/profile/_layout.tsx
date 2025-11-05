import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Stack } from "expo-router";
import React from 'react';
import { Pressable } from "react-native";

type RootStackParamList = {
  profile: undefined;
  'profile/settings': undefined;
  // Add other screens in your stack here
};

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'profile/settings'>;

export default function ProfileLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: "Hồ sơ cá nhân",
                    headerTitleAlign: "center",
                }}
            />
            <Stack.Screen
                name="settings"
                options={({ navigation }: { navigation: SettingsScreenNavigationProp }) => ({
                    title: "Cài đặt",
                    headerLeft: () => (
                        <Pressable onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </Pressable>
                    ),
                })}
            />
        </Stack>
    );
}
