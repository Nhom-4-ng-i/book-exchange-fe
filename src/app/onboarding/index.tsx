import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOnboardingGate } from "../hooks/useOnboardingGate";

import IconOnboarding1 from "../../icons/IconOnboarding1";
import IconOnboarding2 from "../../icons/IconOnboarding2";
import IconOnboarding3 from "../../icons/IconOnboarding3";

type Slide = {
  key: string;
  title: string;
  body: string;
  IconOnboarding: React.ComponentType<any>;
};

const INACTIVE_DOT = "#D8CFF2";
const PURPLE = "#5E3EA1";

const SLIDES: Slide[] = [
  {
    key: "s1",
    title: "Tìm sách nhanh",
    body: "Tìm và lọc sách theo môn, trạng thái, trường, phạm vi giá,... Hỗ trợ nhanh lẹ trong việc tìm kiếm có kết quả ngay.",
    IconOnboarding: IconOnboarding1,
  },
  {
    key: "s2",
    title: "Đăng bán trong 1 phút",
    body: "Đăng tải ảnh sách lên, điền các thông tin cơ bản cần thiết và bấm “Đăng lên”. Người mua thấy ngay lập tức!",
    IconOnboarding: IconOnboarding2,
  },
  {
    key: "s3",
    title: "Wishlist thông minh",
    body: "Lưu sách mà bạn mong muốn mua; nhận thông báo ngay khi có người đăng bán sách tương ứng.",
    IconOnboarding: IconOnboarding3,
  },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function OnboardingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { markDone } = useOnboardingGate();

  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);

  const backButtonOpacity = useSharedValue(0);

  const onNext = () => {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    } else {
      onDone();
    }
  };
  const onPrev = () =>
    index > 0 && listRef.current?.scrollToIndex({ index: index - 1, animated: true });
  const onSkip = () => onDone();
  const onDone = async () => {
    await markDone();
    router.replace("/auth/login");
  };

  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    const newIndex = viewableItems?.[0]?.index ?? 0;
    setIndex(newIndex);
    backButtonOpacity.value = withTiming(newIndex > 0 ? 1 : 0, {
      duration: 200,
    });
  }).current;

  const backButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: backButtonOpacity.value,
    };
  });

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" />

      <View className="flex-1 bg-white">
        <View className="px-6 pt-2 items-start">
          <Pressable onPress={onSkip} hitSlop={12}>
            <Text className="text-primary text-[14px] font-semibold opacity-90 px-4 py-2">
              Bỏ qua
            </Text>
          </Pressable>
        </View>

        <FlatList
          ref={listRef}
          data={SLIDES}
          keyExtractor={(it) => it.key}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          getItemLayout={(_, i) => ({
            length: width,
            offset: width * i,
            index: i,
          })}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
          renderItem={({ item }) => (
            <View
              className="flex-1 items-center px-5"
              style={{ width }}
            >
              <View className="mt-10 mb-5 items-center justify-center">
                <item.IconOnboarding width={width} height={width * 1.1} />
              </View>
              <Text className="px-[25px] text-[24px] font-extrabold text-center mb-2 text-[#1C1C1E]">
                {item.title}
              </Text>
              <Text className="px-[25px] text-[16px] font-[400] text-center text-textGray500 leading-6">
                {item.body}
              </Text>
            </View>
          )}
        />

        <View className="px-5 py-4">
          <View className="flex-row justify-center items-center mb-5">
            {SLIDES.map((_, i) => (
              <AnimatedDot key={i} index={i} currentIndex={index} />
            ))}
          </View>

          <View className="flex-col items-stretch justify-center">
            <Pressable
              className="w-full bg-primary py-4 rounded-xl items-center justify-center"
              onPress={onNext}
            >
              <Text className="text-white font-bold text-base px-5">
                {index === SLIDES.length - 1 ? "Bắt đầu" : "Tiếp tục"}
              </Text>
            </Pressable>

            <AnimatedPressable
              className={`w-full py-4 rounded-xl items-center justify-center mt-3 bg-primary50 mb-4`}
              disabled={index === 0}
              onPress={onPrev}
              style={backButtonAnimatedStyle}
            >
              <Text className="text-primary font-bold text-base">
                Quay lại
              </Text>
            </AnimatedPressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const AnimatedDot = ({
  index,
  currentIndex,
}: {
  index: number;
  currentIndex: number;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const isActive = index === currentIndex;

    const size = withTiming(isActive ? 8 : 4, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    return {
      width: size,
      height: size,
      backgroundColor: withTiming(isActive ? PURPLE : INACTIVE_DOT, {
        duration: 300,
      }),
      marginHorizontal: 2,
    };
  });

  return (
    <Animated.View
      className="rounded-full"
      style={animatedStyle}
    />
  );
};