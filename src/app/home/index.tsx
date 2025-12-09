import BottomNav from "@/components/BottomNav";
import HeaderHome from "@/components/HeaderHome";
import * as Sentry from "@sentry/react-native";
import { StatusBar } from "expo-status-bar";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HAS_LAUNCHED = "hasLaunched";
const IS_LOGGED_IN = "isLoggedIn";

const books = [
  {
    id: 1,
    title: "Giải tích",
    price: "120.000đ",
    originalPrice: "150.000đ",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/52fd2ccb12a0cc8215ea23e7fce4db059c2ca1aa?width=328",
    badge: "Khá",
    hasDiscount: true,
  },
  {
    id: 2,
    title: "Giải tích",
    price: "120.000đ",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/52fd2ccb12a0cc8215ea23e7fce4db059c2ca1aa?width=328",
    badge: "Khá",
  },
  {
    id: 3,
    title: "Giải tích",
    price: "120.000đ",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/52fd2ccb12a0cc8215ea23e7fce4db059c2ca1aa?width=328",
    badge: "Khá",
  },
  {
    id: 4,
    title: "Giải tích",
    price: "120.000đ",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/52fd2ccb12a0cc8215ea23e7fce4db059c2ca1aa?width=328",
    badge: "Khá",
  },
  {
    id: 5,
    title: "Giải tích",
    price: "120.000đ",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/52fd2ccb12a0cc8215ea23e7fce4db059c2ca1aa?width=328",
    badge: "Khá",
  },
  {
    id: 6,
    title: "Giải tích",
    price: "120.000đ",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/52fd2ccb12a0cc8215ea23e7fce4db059c2ca1aa?width=328",
    badge: "Khá",
  },
];

const categories = ["Tất cả", "Ngoại ngữ", "Ngoại ngữ", "Ngoại ngữ"];

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <HeaderHome title="Trang chủ" />

      <ScrollView className="flex-1" contentContainerClassName="pb-24">
        <View className="px-4 mb-4 mt-4">
          <Pressable
            className="w-full py-3 bg-textPrimary500 items-center justify-center text-white font-bold rounded-lg tracking-wide"
            onPress={() => {
              console.log(
                "=== TEST SENTRY: Crash tại nút + Đăng sách/tài liệu mới ==="
              );

              // Gửi message
              Sentry.captureMessage(
                "Test Sentry từ nút + Đăng sách/tài liệu mới – Nhóm 4 test crash"
              );

              // Gửi exception
              Sentry.captureException(
                new Error(
                  "SENTRY ERROR: Crash test – nút + Đăng sách/tài liệu mới (error + sourcemaps + performance)"
                )
              );

              // Crash thật
              throw new Error(
                "CRASHED: Crash test từ màn hình Đăng Sách/Tài Liệu – Sentry test"
              );
            }}
          >
            <Text className="text-white font-bold text-base tracking-wide">
              + Đăng sách/tài liệu mới
            </Text>
          </Pressable>
        </View>

        <View className="mb-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="px-4 flex-row gap-2"
          >
            {categories.map((category, index) => (
              <Pressable
                key={index}
                className={`px-2 py-1 rounded-lg whitespace-nowrap ${
                  index === 0 ? "bg-gray-500/20" : "border border-[#E5E5E5]"
                }`}
              >
                <Text className="text-sm text-gray-800">{category}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View className="px-4 mb-6">
          <Text className="text-lg font-bold tracking-tight text-gray-900">
            Danh sách
          </Text>
        </View>

        <View className="px-4">
          <View className="flex-row flex-wrap justify-between">
            {books.map((book) => (
              <Pressable key={book.id} className="w-[48%] mb-8">
                <View className="flex-col">
                  <View className="relative mb-2">
                    <Image
                      source={{ uri: book.image }}
                      className="w-full aspect-[164/256] object-cover rounded-lg"
                      resizeMode="cover"
                    />
                    {book.badge && (
                      <View className="absolute top-2 left-2 px-2 py-0.5 bg-white rounded-lg">
                        <Text className="text-xs text-gray-800">
                          {book.badge}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-sm text-gray-900 mb-1">
                    {book.title}
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-xs font-bold text-textPrimary500 tracking-wide">
                      {book.price}
                    </Text>
                    {book.hasDiscount && book.originalPrice && (
                      <Text className="text-xs text-gray-500 line-through">
                        {book.originalPrice}
                      </Text>
                    )}
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}
