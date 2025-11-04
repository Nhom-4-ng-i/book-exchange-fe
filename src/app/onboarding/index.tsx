import React, { useEffect, useMemo, useRef, useState } from "react";
import { useOnboardingGate } from "../hooks/useOnboardingGate";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  FlatList,
  useWindowDimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

// ====== Các image thay bằng SVG của mình  ======
import IconOnboarding1 from '../../icons/IconOnboarding1'
import IconOnboarding2 from '../../icons/IconOnboarding2'
import IconOnboarding3 from '../../icons/IconOnboarding3'
import LogoBkoo1 from '../../icons/logoBkoo1'
import LogoBkoo2 from '../../icons/logoBkoo2'


type Phase = "intro1" | "intro2" | "slides";

type Slide = {
  key: string;
  title: string;
  body: string;
  IconOnboarding: React.ComponentType<any>;
};

const PADDING_H = 20;
const PURPLE = "#5E3EA1";
const PURPLE_DARK = "#4B3282";
const INACTIVE_DOT = "#D8CFF2"

const SLIDES: Slide[] = [
  {
    key: "s1",
    title: "Tìm sách nhanh",
    body:
      "Tìm và lọc theo môn, trạng thái, trường, phạm vi giá… Hỗ trợ nhanh lẹ để có kết quả ngay.",
    IconOnboarding: IconOnboarding1 ,
  },
  {
    key: "s2",
    title: "Đăng bán trong 1 phút",
    body:
      "Tải ảnh sách, nhập vài thông tin cơ bản và bấm “Đăng lên”. Người mua thấy ngay lập tức!",
      IconOnboarding: IconOnboarding2 ,
  },
  {
    key: "s3",
    title: "Wishlist thông minh",
    body:
      "Lưu sách muốn mua và nhận thông báo khi có người đăng bán tương ứng.",
      IconOnboarding: IconOnboarding3 ,
  },
];

export default function Onboarding() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { markDone } = useOnboardingGate();

  const [phase, setPhase] = useState<Phase>("intro1");
  const fade = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(20)).current;
    // Tự động chạy intro1 (800ms) -> intro2 (800ms) -> slides
    useEffect(() => {
      let t1: NodeJS.Timeout | undefined;
      let t2: NodeJS.Timeout | undefined;
  
      const run = async () => {
        // intro1 in
        animateIn();
        t1 = setTimeout(() => {
          animateOut(() => {
            setPhase("intro2");
            animateIn();
            t2 = setTimeout(() => {
              animateOut(() => setPhase("slides"));
            }, 900);
          });
        }, 900);
      };
      run();
  
      return () => {
        if (t1) clearTimeout(t1);
        if (t2) clearTimeout(t2);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    // Mỗi khi phase đổi (sang slides) thì reset fade để render mượt
    useEffect(() => {
      if (phase === "slides") {
        fade.setValue(1);
        translate.setValue(0);
      }
    }, [phase]);
  
    const animateIn = () => {
      fade.setValue(0);
      translate.setValue(20);
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 260, useNativeDriver: true }),
        Animated.timing(translate, { toValue: 0, duration: 260, useNativeDriver: true }),
      ]).start();
    };
  
    const animateOut = (cb?: () => void) => {
      Animated.parallel([
        Animated.timing(fade, { toValue: 0, duration: 220, useNativeDriver: true }),
        Animated.timing(translate, { toValue: -10, duration: 220, useNativeDriver: true }),
      ]).start(() => cb?.());
    };
    const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);

  const onNext = () => {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    } else {
      onDone();
    }
  };
  const onPrev = () => {
    if (index > 0) {
      listRef.current?.scrollToIndex({ index: index - 1, animated: true });
    }
  };
  const onSkip = () => onDone();

  const onDone = async () => {
    await markDone();
    router.replace("/login");
  };  

const viewabilityConfig = { itemVisiblePercentThreshold: 50 };
const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
  const i = viewableItems?.[0]?.index ?? 0;
  setIndex(i);
}).current;



  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <StatusBar barStyle={phase === "intro1" ? "light-content" : "dark-content"} />
      {phase !== "slides" ? (
        // ---------- INTRO 1 + INTRO 2 ----------
        <Animated.View
          style={[
            styles.introRoot,
            phase === "intro1" ? styles.introPurple : styles.introWhite,
            { opacity: fade, transform: [{ translateY: translate }] },
          ]}
        >
          {/* Logo + tagline */}
          <View style={styles.introCenter}>
        {phase === "intro1" ? (
            <LogoBkoo2 width={140} height={40} fill="#fff" />
          ) : (
            <LogoBkoo1 width={140} height={40} fill={PURPLE} />
          )}
            <Text
              style={[
                styles.tagline,
                { color: phase === "intro1" ? "#fff" : PURPLE_DARK },
              ]}
            >
              Mua — Bán sách và tài liệu trong trường, nhanh và tiết kiệm.
            </Text>
          </View>

          {/* Watermark lớn mờ ở góc dưới (nhẹ nhàng giống mockup) */}
          <View pointerEvents="none" style={styles.watermarkBox}>
            <View style={styles.watermark} />
          </View>
        </Animated.View>
      ) : (
        // ---------- SLIDES ----------
        <View style={styles.slidesRoot}>
          {/* Header: Skip */}
          <View style={styles.header}>
            <Pressable onPress={onSkip} hitSlop={12}>
              <Text style={[styles.skip, { color: PURPLE_DARK }]}>Bỏ qua</Text>
            </Pressable>
          </View>

          <FlatList
  ref={listRef}
  data={SLIDES}
  keyExtractor={(it) => it.key}
  horizontal
  pagingEnabled
  showsHorizontalScrollIndicator={false}
  getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
  onScrollToIndexFailed={(info) => {
    setTimeout(() => {
      listRef.current?.scrollToIndex({ index: info.index, animated: true });
    }, 50);
  }}
  viewabilityConfig={viewabilityConfig}
  onViewableItemsChanged={onViewableItemsChanged}
  renderItem={({ item }) => (
    <View style={[styles.slide, { width }]}>
      <View style={styles.illuWrap}>
        <item.IconOnboarding width={260} height={260} />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.body}>{item.body}</Text>
    </View>
  )}
/>



          {/* Dots + CTA */}
          <View style={styles.footer}>
            <View style={styles.dots}>
              {SLIDES.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === index && styles.dotActive]}
                />
              ))}
            </View>

            <View style={styles.ctaCol}>
  <Pressable style={styles.btnPrimary} onPress={onNext} accessibilityRole="button">
    <Text style={styles.btnPrimaryText}>
      {index === SLIDES.length - 1 ? "Bắt đầu" : "Tiếp tục"}
    </Text>
  </Pressable>

  <Pressable
    style={[styles.btnGhost, index === 0 && styles.btnDisabled]}
    onPress={onPrev}
    disabled={index === 0}
    accessibilityRole="button"
  >
    <Text style={styles.btnGhostText}>Quay lại</Text>
  </Pressable>
</View>

          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  // ===== INTROS =====
  introRoot: { flex: 1, alignItems: "center", justifyContent: "center" },
  introPurple: { backgroundColor: PURPLE },
  introWhite: { backgroundColor: "#fff" },

  introCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  tagline: {
    marginTop: 12,
    fontSize: 14,
    textAlign: "center",
    opacity: 0.9,
  },
  watermarkBox: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  watermark: {
    width: 220,
    height: 220,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    opacity: 0.08,
    transform: [{ translateY: 40 }],
  },

  // ===== SLIDES =====
  slidesRoot: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingHorizontal: PADDING_H,
    paddingTop: 8,
  },
  skip: { fontSize: 14, fontWeight: "600", opacity: 0.9 },

  slide: {
    flex: 1,
    paddingHorizontal: PADDING_H,
    alignItems: "center",
    justifyContent: "center",
  },
  illuWrap: {
    marginTop: 8,
    marginBottom: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 24, fontWeight: "800", textAlign: "center", marginBottom: 8, color: "#1C1C1E" },
  body: {
    fontSize: 15,
    textAlign: "center",
    color: "#3A3A3C",
    lineHeight: 22,
    paddingHorizontal: 8,
  },

  footer: {
    paddingHorizontal: PADDING_H,
    paddingVertical: 16,
  },
  dots: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: INACTIVE_DOT },
  dotActive: { backgroundColor: PURPLE, width: 24 },

  ctaRow: {
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center", 
  gap: 12, 
  },

  ctaCol: {
    flexDirection: "column",
    alignItems: "stretch",   
    justifyContent: "center",
  },

  btnPrimary: {
    width: "100%",           
    backgroundColor: PURPLE,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimaryText: { color: "#fff", fontWeight: "700", fontSize: 16 , paddingHorizontal: 20,  },

  btnGhost: {
    width: "100%",          
    borderColor: PURPLE,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginTop: 12,          
  },
  btnGhostText: { color: PURPLE, fontWeight: "700", fontSize: 16 },
  btnDisabled: { opacity: 0 },
});
