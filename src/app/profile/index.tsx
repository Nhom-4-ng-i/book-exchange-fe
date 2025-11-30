import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { BookOpen, Heart, ShoppingBag, Users } from "lucide-react-native";

import BottomNav from "@/components/BottomNav";
import { ProfileActionCard } from "@/components/profile/ProfileActionCard";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStat } from "@/components/profile/ProfileStat";

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className="border-b border-textGray200 px-6 pb-3 pt-4">
        <Text className="text-center text-lg font-bold text-textPrimary900">Hồ sơ</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        <ProfileHeader name="Đặng văn A" phone="08764349" onLogout={() => {}} />

        <View className="mx-6 mb-6 mt-2 rounded-2xl bg-[#EDE7FB] p-4">
          <View className="flex-row justify-between gap-3">
            <ProfileStat label="Đã đăng" value={12} />
            <ProfileStat label="Đã bán" value={12} />
            <ProfileStat label="Đã mua" value={12} />
          </View>
        </View>

        <View className="mx-6 gap-4">
          <ProfileActionCard
            icon={<BookOpen color="#54408C" size={22} />}
            label="Bài đăng của tôi"
            onPress={() => router.push("/profile/my-posts")}
          />
          <ProfileActionCard
            icon={<ShoppingBag color="#54408C" size={22} />}
            label="Đã mua"
          />
          <ProfileActionCard
            icon={<Users color="#54408C" size={22} />}
            label="Quản lý người mua"
            badgeCount={2}
            onPress={() => router.push("/profile/buyer-management")}
          />
          <ProfileActionCard
            icon={<Heart color="#54408C" size={22} />}
            label="Quản lý Wishlist"
            badgeCount={2}
            onPress={() => router.push("/profile/wishlist")}
          />
        </View>
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}
