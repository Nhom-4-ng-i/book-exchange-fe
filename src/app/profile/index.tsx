import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BottomNav from "@/components/BottomNav";
import HeaderHome from "@/components/HeaderHome";

import { OpenAPI, UserService } from "@/api";
import { ProfileActionCard } from "@/components/profile/ProfileActionCard";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStat } from "@/components/profile/ProfileStat";
import IconHeart from "@/icons/IconHeart";
import IconPost from "@/icons/IconPost";
import IconUser from "@/icons/IconUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

type Profile = {
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  role?: string;
  created_at?: string;
  count_posts?: number;
  count_orders?: number;
  count_sold_orders?: number;
};

type ProfileCounters = {
  totalPosts: number;
  soldOrders: number;
  boughtOrders: number;
  sellingPosts: number;
  newBuyerRequests: number;
};

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [counters, setCounters] = useState<ProfileCounters>({
    totalPosts: 0,
    soldOrders: 0,
    boughtOrders: 0,
    sellingPosts: 0,
    newBuyerRequests: 0,
  });
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
    const fetchAll = async () => {
      try {
        const userJson = await AsyncStorage.getItem("user");
        if (!userJson) {
          router.replace("/auth/login");
          return;
        }

        const user = JSON.parse(userJson) as {
          id: string;
          name?: string;
          email?: string;
        };

        const token = await AsyncStorage.getItem("access_token");
        if (token) {
          OpenAPI.TOKEN = token;
          OpenAPI.BASE = "http://160.187.246.140:8000";
        }

        const [profileRes, myPosts, myOrders] = await Promise.all([
          UserService.getMyProfileRouteApiUserMeGet(),
          UserService.getMyPostsRouteApiUserPostsGet(),
          UserService.getMyOrdersRouteApiUserOrdersGet(),
        ]);

        setProfile(profileRes as Profile);

        console.log("PROFILE:", profileRes);

        const p = profileRes as Profile;

        const totalPosts = p.count_posts ?? 0;
        const soldOrders = p.count_sold_orders ?? 0;
        const boughtOrders = p.count_orders ?? 0;

        const sellingPosts = (myPosts as any[]).filter((p) => {
          return (
            p.post_status === "Đang bán" ||
            p.status === "Đang bán" ||
            p.status_text === "Đang bán"
          );
        }).length;

        const newBuyerRequests = (myOrders as any[]).filter(
          (o) => o.order_status === "Chờ xác nhận"
        ).length;

        setCounters({
          totalPosts,
          soldOrders,
          boughtOrders,
          sellingPosts,
          newBuyerRequests,
        });
      } catch (err) {
        console.log("Fetch profile / stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
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
          phone={profile?.phone ?? "087656534"}
          onLogout={handleLogout}
        />

        <View className="mx-6 mb-4 mt-4 rounded-2xl ">
          <View className="flex-row justify-between gap-3">
            <ProfileStat label="Đã đăng" value={counters.totalPosts} />
            <ProfileStat label="Đã bán" value={counters.soldOrders} />
            <ProfileStat label="Đã mua" value={counters.boughtOrders} />
          </View>
        </View>

        <View className="mx-6">
          <ProfileActionCard
            icon={<IconPost />}
            label="Bài đăng của tôi"
            badgeCount={counters.sellingPosts}
            onPress={() => router.push("/profile/my-posts")}
          />
          <ProfileActionCard
            icon={<IconUser />}
            label="Quản lý người mua"
            badgeCount={counters.newBuyerRequests}
            onPress={() => router.push("/profile/buyer-management")}
          />
          <ProfileActionCard
            icon={<IconHeart />}
            label="Quản lý Wishlist"
            badgeCount={0}
            onPress={() => router.push("/profile/wishlist")}
          />
        </View>
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}
