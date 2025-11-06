import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StatusBar, Text, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import IconLogoPrimary from "@/icons/IconLogoPrimary";
import IconLogoWhite from "@/icons/IconLogoWhite";
import LogoBkoo1 from "@/icons/logoBkoo1";
import LogoBkoo2 from "@/icons/logoBkoo2";
import { getData } from "utils/asyncStorage";

type Phase = "intro1" | "intro2" | "navigating";

export default function LaunchAnimationScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro1");

  const containerFade = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(0);

  const animatePhase1In = () => {
    containerFade.value = withTiming(1, { duration: 260 });
    logoOpacity.value = 0;
    logoTranslateY.value = 20;
    logoOpacity.value = withTiming(1, { duration: 260 });
    logoTranslateY.value = withTiming(0, { duration: 260 });
    textOpacity.value = 0;
    textTranslateY.value = 20;
    textOpacity.value = withTiming(1, { duration: 260 });
    textTranslateY.value = withTiming(0, { duration: 260 });
  };

  const animatePhase1Out = (cb?: () => void) => {
    containerFade.value = withTiming(0, { duration: 220 });
    logoOpacity.value = withTiming(0, { duration: 220 });
    logoTranslateY.value = withTiming(-30, { duration: 220 });
    textOpacity.value = withTiming(0, { duration: 220 });
    textTranslateY.value = withTiming(30, { duration: 220 }, (finished) => {
      if (finished && cb) {
        runOnJS(cb)();
      }
    });
  };

  const animatePhase2In = () => {
    containerFade.value = withTiming(1, { duration: 260 });
    logoOpacity.value = 0;
    logoTranslateY.value = -30;
    logoOpacity.value = withTiming(1, { duration: 260 });
    logoTranslateY.value = withTiming(0, { duration: 260 });
    textOpacity.value = 0;
    textTranslateY.value = 30;
    textOpacity.value = withTiming(1, { duration: 260 });
    textTranslateY.value = withTiming(0, { duration: 260 });
  };

  const animatePhase2Out = (cb?: () => void) => {
    containerFade.value = withTiming(0, { duration: 220 });
    logoOpacity.value = withTiming(0, { duration: 220 });
    textOpacity.value = withTiming(0, { duration: 220 });
    containerFade.value = withTiming(0, { duration: 220 }, (finished) => {
      if (finished && cb) {
        runOnJS(cb)();
      }
    });
  };

  useEffect(() => {
    let t1: NodeJS.Timeout | undefined;
    let t2: NodeJS.Timeout | undefined;

    const run = async () => {
      animatePhase1In();
      t1 = setTimeout(() => {
        animatePhase1Out(() => {
          setPhase("intro2");
          animatePhase2In();
          t2 = setTimeout(() => {
            animatePhase2Out(() => {
              // setPhase("navigating");
              checkFirstTimeOpen();
            });
          }, 900);
        });
      }, 900);
    };
    run();

    return () => {
      if (t1) clearTimeout(t1);
      if (t2) clearTimeout(t2);
    };
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return { opacity: containerFade.value };
  });
  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [{ translateY: logoTranslateY.value }],
    };
  });
  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
      transform: [{ translateY: textTranslateY.value }],
    };
  });
const checkFirstTimeOpen = async () => {
    let onboarded = await getData('onboarded');
    if (onboarded !== '1') {
      router.replace('/onboarding');
    }
    else{
      router.replace('/auth/login');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <StatusBar barStyle={phase === "intro1" ? "light-content" : "dark-content"} />

      <Animated.View
        className={`flex-1 items-center justify-center ${
          phase === "intro1" ? "bg-[#5E3EA1]" : "bg-white"
        }`}
        style={containerAnimatedStyle}
      >
        <Animated.View className="items-center justify-center" style={logoAnimatedStyle}>
          {phase === "intro1" ? (
            <LogoBkoo2 width={140} height={40} fill="#fff" />
          ) : (
            <LogoBkoo1 width={140} height={40} fill="textPrimary500" />
          )}
        </Animated.View>

        <Animated.View style={textAnimatedStyle}>
          <Text
            className={`mt-3 text-center text-sm opacity-90 ${
              phase === "intro1" ? "text-white" : "text-textPrimary500"
            }`}
          >
            Mua — Bán sách và tài liệu trong trường, nhanh và tiết kiệm.
          </Text>
        </Animated.View>

        <View className="absolute bottom-10 left-5">
          {phase === "intro1" ? (
            <IconLogoWhite />
          ) : (
            <IconLogoPrimary />
          )}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}