import BottomNav from "@/components/BottomNav";
import IconBell from "@/icons/IconBell";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Demo data (chưa cần API)
 * - date: "DD/MM/YYYY"
 * - time: "DD/MM • HH:mm"
 */
type NotificationItem = {
  id: string;
  date: string;
  title: string;
  message: string;
  time: string;
};

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    date: "12/10/2025",
    title: "Wishlist",
    message: "Đã tìm thấy bài đăng có sách bạn cần.",
    time: "12/10 • 08:00",
  },
  {
    id: "n2",
    date: "12/10/2025",
    title: "Wishlist",
    message: "Đã tìm thấy bài đăng có sách bạn cần.",
    time: "12/10 • 20:30",
  },
  {
    id: "n3",
    date: "10/10/2025",
    title: "Wishlist",
    message: "Đã tìm thấy bài đăng có sách bạn cần.",
    time: "10/10 • 11:00",
  },
];

function NotificationRow({
  title,
  message,
  time,
  isLast,
}: {
  title: string;
  message: string;
  time: string;
  isLast: boolean;
}) {
  return (
    <View className={`py-4 ${isLast ? "" : "border-b border-[#EFEFEF]"}`}>
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-heading6 font-semibold text-textPrimary500">
            {title}
          </Text>
          <Text className="mt-2 text-bodyMedium text-textGray900">
            {message}
          </Text>
        </View>

        <Text className="text-xs text-textGray500">{time}</Text>
      </View>
    </View>
  );
}

export default function NotificationScreen() {
  const notifications = MOCK_NOTIFICATIONS;

  const grouped = useMemo(() => {
    const map = new Map<string, NotificationItem[]>();
    for (const n of notifications) {
      const arr = map.get(n.date) ?? [];
      arr.push(n);
      map.set(n.date, arr);
    }
    return Array.from(map.entries()).map(([date, items]) => ({ date, items }));
  }, [notifications]);

  const isEmpty = notifications.length === 0;

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
          <ArrowLeft size={22} />
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
                      isLast={idx === group.items.length - 1}
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
