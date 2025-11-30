import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BottomNav from "@/components/BottomNav";
import HeaderHome from "@/components/HeaderHome";

import { ProfileActionCard } from "@/components/profile/ProfileActionCard";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStat } from "@/components/profile/ProfileStat";
import IconHeart from "@/icons/IconHeart";
import IconPost from "@/icons/IconPost";
import IconUser from "@/icons/IconUser";
import { StatusBar } from "expo-status-bar";

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['left', 'right', 'bottom']}>
      <StatusBar style="dark" />
      <HeaderHome title="Hồ sơ" showSearch={false} showChat={false} showNotification={false} />

      <ScrollView className="flex-1 mt-2" contentContainerStyle={{ paddingBottom: 100 }}>
        <ProfileHeader name="Đặng văn A" phone="08764349" onLogout={() => {}} />

        <View className="mx-6 mb-4 mt-4 rounded-2xl ">
          <View className="flex-row justify-between gap-3">
            <ProfileStat label="Đã đăng" value={12} />
            <ProfileStat label="Đã bán" value={12} />
            <ProfileStat label="Đã mua" value={12} />
          </View>
        </View>

        <View className="mx-6">
          <ProfileActionCard
            icon={<IconPost />}
            label="Bài đăng của tôi"
            onPress={() => router.push("/profile/my-posts")}
          />
          <ProfileActionCard
            icon={<IconUser />}
            label="Quản lý người mua"
            badgeCount={2}
            onPress={() => router.push("/profile/buyer-management")}
          />
          <ProfileActionCard
            icon={<IconHeart />}
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
