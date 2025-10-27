import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from 'react';
import { Pressable } from "react-native";

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
                options={({ navigation }) => ({
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
