import { NotificationsService, OpenAPI } from "@/api";
import IconMessenger from "@/icons/IconMessenger";
import IconNotification from "@/icons/IconNotification";
import IconNotification2 from "@/icons/IconNotification2";
import IconSearch from "@/icons/IconSearch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AppHeaderProps {
  title: string;
  onSearchPress?: () => void;
  onChatPress?: () => void;
  onBellPress?: () => void;
  showSearch?: boolean;
  showChat?: boolean;
  showNotification?: boolean;
  bellTick?: number;
}

async function ensureAuthToken() {
  const token = await AsyncStorage.getItem("access_token");
  if (token) {
    OpenAPI.BASE = "http://160.187.246.140:8000";
    OpenAPI.TOKEN = token;
  }
}

type NotificationItem = { id: number; is_read: boolean };
export default function AppHeader({
  title,
  onSearchPress = () => {},
  onChatPress = () => {},
  onBellPress,
  showSearch = true,
  showChat = true,
  showNotification = true,
  bellTick,
}: AppHeaderProps) {
  const handleBellPress = () => {
    if (onBellPress) {
      onBellPress();
    } else {
      router.push("/notification");
    }
  };
  const [hasUnread, setHasUnread] = useState(false);

  const refreshBell = useCallback(async () => {
    try {
      await ensureAuthToken();
      const list =
        (await NotificationsService.getNotificationsListRouteApiNotificationsGet()) as
          | NotificationItem[]
          | undefined;

      const anyUnread = (list ?? []).some((n) => n.is_read === false);
      setHasUnread(anyUnread);
      console.log("hasUnread", hasUnread);
    } catch (e) {
      console.log("refreshBell error:", e);
      setHasUnread(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshBell();
    }, [refreshBell])
  );
  useEffect(() => {
    refreshBell();
  }, [bellTick]);

  return (
    <SafeAreaView
      className="bg-white h-[84px]"
      edges={["left", "right", "top"]}
    >
      <View className="px-4 py-2 flex-row items-center">
        {showSearch && (
          <Pressable
            onPress={onSearchPress}
            className="w-10 h-10 flex items-center justify-center rounded-xl"
          >
            <IconSearch color="#121212" />
          </Pressable>
        )}

        <View className="flex-1 items-center">
          {title === "Trang chủ" ? (
            <Text className="pl-12 text-xl font-bold tracking-tight text-gray-900">
              {title}
            </Text>
          ) : title === "Giỏ hàng" ? (
            <Text className="pl-24 text-xl font-bold tracking-tight text-gray-900">
              {title}
            </Text>
          ) : (
            <Text className="pl-24 text-xl font-bold tracking-tight text-gray-900">
              {title}
            </Text>
          )}
        </View>

        <View className="flex-row items-center justify-end gap-2">
          {showChat && (
            <Pressable
              onPress={onChatPress}
              className="w-10 h-10 flex items-center justify-center"
            >
              <IconMessenger />
            </Pressable>
          )}
          {showNotification && (
            <Pressable
              onPress={handleBellPress}
              className="w-10 h-10 flex items-center justify-center relative"
            >
              {hasUnread ? <IconNotification /> : <IconNotification2 />}
              {hasUnread && (
                <View className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></View>
              )}
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
