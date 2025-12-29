import { NotificationsService } from "@/api";
import BottomNav from "@/components/BottomNav";
import IconBack from "@/icons/IconBack";
import IconBell from "@/icons/IconBell";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ApiNotification = {
  id: number;
  type_id: number;
  title: string;
  content: string;
  is_read: boolean;
  created_at: string;
  user_id: string;
};

type NotificationItem = {
  id: number;
  date: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  createdAt: string;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatDDMMYYYY(d: Date) {
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function formatHHmm(d: Date) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function toUiItem(n: ApiNotification): NotificationItem {
  const d = new Date(n.created_at);
  const ddmm = `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}`;
  return {
    id: n.id,
    date: formatDDMMYYYY(d),
    title: n.title ?? "Thông báo",
    message: n.content ?? "",
    time: `${ddmm} • ${formatHHmm(d)}`,
    isRead: !!n.is_read,
    createdAt: n.created_at,
  };
}

function NotificationRow({
  title,
  message,
  time,
  isLast,
  isRead,
  onPress,
}: {
  title: string;
  message: string;
  time: string;
  isLast: boolean;
  isRead: boolean;
  onPress?: () => void;
}) {
  return (
    <View
      className={`py-4 ${isLast ? "" : "border-b border-[#EFEFEF]"} ${isRead ? "opacity-58" : ""}`}
      onTouchEnd={onPress}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-4">
          <Text
            className={`text-heading6 font-semibold ${isRead ? "text-textPrimary300" : "text-textPrimary500"}`}
          >
            {title}
          </Text>
          <Text
            className={`mt-2 text-bodyMedium ${isRead ? "text-textGray500" : "text-textGray900"}`}
          >
            {message}
          </Text>
        </View>

        <Text
          className={`text-xs ${isRead ? "text-textGray400" : "text-textGray500"}`}
        >
          {time}
        </Text>
      </View>
    </View>
  );
}

export default function NotificationScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readingIds, setReadingIds] = useState<Set<number>>(new Set());
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);

        const data =
          await NotificationsService.getNotificationsListRouteApiNotificationsGet();

        const arr: ApiNotification[] = Array.isArray(data) ? data : [];
        arr.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setNotifications(arr.map(toUiItem));
      } catch (e) {
        console.log("Load notifications error:", e);
        setError("Không thể tải thông báo.");
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, NotificationItem[]>();
    for (const n of notifications) {
      const list = map.get(n.date) ?? [];
      list.push(n);
      map.set(n.date, list);
    }
    return Array.from(map.entries()).map(([date, items]) => ({ date, items }));
  }, [notifications]);

  const isEmpty = !loading && notifications.length === 0;

  const markAsRead = async (notificationId: number) => {
    const isReading = readingIds.has(notificationId);
    const current = notifications.find((x) => x.id === notificationId);
    if (!current || current.isRead || isReading) return;

    setNotifications((prev) =>
      prev.map((x) => (x.id === notificationId ? { ...x, isRead: true } : x))
    );
    setReadingIds((prev) => new Set(prev).add(notificationId));

    try {
      await NotificationsService.readNotificationRouteApiNotificationsNotificationIdReadPost(
        notificationId
      );
    } catch (e) {
      console.log("Mark read error:", e);
      setNotifications((prev) =>
        prev.map((x) => (x.id === notificationId ? { ...x, isRead: false } : x))
      );
    } finally {
      setReadingIds((prev) => {
        const next = new Set(prev);
        next.delete(notificationId);
        return next;
      });
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#5E3EA1" />
      </View>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={["left", "right", "bottom"]}
    >
      <View className="flex-row items-center justify-between px-6 py-2 h-16">
        <Pressable
          onPress={() => router.back()}
          className="rounded-full p-2 active:opacity-70"
          hitSlop={10}
        >
          <IconBack />
        </Pressable>

        <Text className="flex-1 text-center text-xl font-bold text-textPrimary900">
          Thông báo
        </Text>

        <View className="w-8" />
      </View>

      {isEmpty ? (
        <View className="flex-1 items-center justify-center px-6">
          <IconBell />
          <Text className="mt-12 text-bodyXLarge font-medium text-textPrimary900">
            Ở đây không có thông báo
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6 mt-8">
            {grouped.map((group) => (
              <View key={group.date} className="pt-2">
                <Text className="text-heading5 font-semibold text-textPrimary900">
                  {group.date}
                </Text>

                <View className="mt-2">
                  {group.items.map((item, idx) => (
                    <NotificationRow
                      key={item.id}
                      title={item.title}
                      message={item.message}
                      time={item.time}
                      isRead={item.isRead}
                      isLast={idx === group.items.length - 1}
                      onPress={() => {
                        if (!item.isRead) markAsRead(item.id);
                      }}
                    />
                  ))}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      <BottomNav />
    </SafeAreaView>
  );
}
