import { NotificationsService, OpenAPI } from "@/api";
import IconMessenger from "@/icons/IconMessenger";
import IconNotification from "@/icons/IconNotification";
import IconNotification2 from "@/icons/IconNotification2";
import IconSearch from "@/icons/IconSearch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

type HeaderHomeProps = {
  title: string;
  bellTick?: number;
};

async function ensureAuthToken() {
  const token = await AsyncStorage.getItem("access_token");
  if (token) {
    OpenAPI.BASE = "http://160.187.246.140:8000";
    OpenAPI.TOKEN = token;
  }
}

type NotificationItem = { id: number; is_read: boolean };

export default function HeaderHome({ title, bellTick }: HeaderHomeProps) {
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
  }, [bellTick, refreshBell]);

  return (
    <View className="bg-white z-50 border-b border-gray-100 pt-4">
      <View className="px-4 py-2 flex-row items-center">
        <Pressable className="w-10 h-10 flex items-center justify-center rounded-xl">
          <IconSearch />
        </Pressable>

        <View className="flex-1 items-center">
          <Text className="text-xl font-bold tracking-tight text-gray-900">
            {title}
          </Text>
        </View>

        <View className="flex-row items-center justify-end gap-2">
          <Pressable className="w-10 h-10 flex items-center justify-center">
            <IconMessenger />
          </Pressable>

          <Pressable
            onPress={() => router.push("/notification")}
            className="w-10 h-10 flex items-center justify-center"
          >
            {hasUnread ? <IconNotification /> : <IconNotification2 />}
          </Pressable>
        </View>
      </View>
    </View>
  );
}
