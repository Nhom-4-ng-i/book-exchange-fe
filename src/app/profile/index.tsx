import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BottomNav from "@/components/BottomNav";
import HeaderHome from "@/components/HeaderHome";

import { OpenAPI, ProfilesService } from "@/api";
import { ProfileActionCard } from "@/components/profile/ProfileActionCard";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStat } from "@/components/profile/ProfileStat";
import IconHeart from "@/icons/IconHeart";
import IconPost from "@/icons/IconPost";
import IconUser from "@/icons/IconUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

type Profile = {
  id: string;
  name: string;
  phone: string;
};

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initApiConfig = async () => {
      const token = await AsyncStorage.getItem("access_token");
      if (token) {
        OpenAPI.TOKEN = token;
        OpenAPI.BASE = "http://160.187.246.140:8000";
      }
    };

    initApiConfig();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // 1. Đọc user từ AsyncStorage
        const userJson = await AsyncStorage.getItem("user");
        if (!userJson) {
          // chưa login thì đá về màn login
          router.replace("/auth/login");
          return;
        }

        const user = JSON.parse(userJson) as {
          id: string;
          name?: string;
          email?: string;
        };

        // 2. Đảm bảo token đã set vào OpenAPI
        const token = await AsyncStorage.getItem("access_token");
        if (token) {
          OpenAPI.TOKEN = token; // hoặc () => token
          OpenAPI.BASE = "http://160.187.246.140:8000";
        }

        // 3. Gọi API get profile
        const res = await ProfilesService.getProfileRouteApiProfilesUserIdGet(
          user.id
        );

        // tuỳ response của BE, giả sử res trả về { id, name, phone, ... }
        setProfile(res);
      } catch (err) {
        console.log("Fetch profile error:", err);
        // nếu lỗi 401 thì clear token và về login
        // ...
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("access_token");
    await AsyncStorage.removeItem("user");
    router.replace("/auth/login");
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
      <StatusBar style="dark" />
      <HeaderHome
        title="Hồ sơ"
        showSearch={false}
        showChat={false}
        showNotification={false}
      />

      <ScrollView
        className="flex-1 mt-2"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <ProfileHeader
          name={profile?.name ?? "Người dùng"}
          phone={profile?.phone ?? "Chưa có số điện thoại"}
          onLogout={handleLogout}
        />

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
