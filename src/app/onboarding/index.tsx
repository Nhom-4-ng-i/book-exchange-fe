

import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Dimensions, ViewToken, StatusBar, SafeAreaView } from 'react-native';
import IconOnboarding1 from '../../icons/IconOnboarding';
import IconOnboarding2 from '../../icons/IconOnboarding2';
import IconOnboarding3 from '../../icons/IconOnboarding3';
import LogoBkoo1 from '../../icons/logoBkoo1'
import LogoBkoo2 from '../../icons/logoBkoo2'

const { width, height } = Dimensions.get('window');
const PADDING_H = 24;
const PURPLE = '#5E3EA1';
const PURPLE_DARK = '#4B3282';
const GRAY = '#8C8C8C';
const DOT_INACTIVE = '#D8CFF2';
const DOT_ACTIVE = PURPLE;


type IconLike = React.ComponentType<{ width?: number; height?: number }>;

type IntroSlide = {
  kind: 'intro';
  key: string;
  variant: 'purple' | 'white';   
  Logo: React.ComponentType<any>; 
};

type OnboardingSlide = {
  kind: 'onboarding';
  key: string;
  title: string;
  subtitle: string;
  Icon: IconLike;
};

type Slide = IntroSlide | OnboardingSlide;

const INTRO_SLIDES: IntroSlide[] = [
  { kind: 'intro', key: 'intro-purple', variant: 'purple' ,  Logo: LogoBkoo2  },
  { kind: 'intro', key: 'intro-white', variant: 'white' ,  Logo: LogoBkoo1 },
];

const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    kind: 'onboarding',
    key: 'find',
    title: 'Tìm sách nhanh',
    subtitle:
      'Tìm và lọc sách theo môn, trạng thái, trường, phạm vi giá,… Hỗ trợ nhanh lẹ trong việc tìm kiếm có kết quả ngay.',
    Icon: IconOnboarding1,
  },
  {
    kind: 'onboarding',
    key: 'sell',
    title: 'Đăng bán trong 1 phút',
    subtitle:
      'Đăng tải ảnh sách lên, điền các thông tin cơ bản cần thiết và bấm “Đăng lên”. Người mua thấy ngay lập tức!',
    Icon: IconOnboarding2,
  },
  {
    kind: 'onboarding',
    key: 'wishlist',
    title: 'Wishlist thông minh',
    subtitle:
      'Lưu sách mà bạn mong muốn mua; nhận thông báo ngay khi có người đăng bán sách tương ứng.',
    Icon: IconOnboarding3,
  },
];

const SLIDES: Slide[] = [...INTRO_SLIDES, ...ONBOARDING_SLIDES];
const INTRO_COUNT = INTRO_SLIDES.length;
const OB_COUNT = ONBOARDING_SLIDES.length;

type Props = { onDone?: () => void };

export default function OnboardingScreen({ onDone }: Props) {
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;
  const inIntro = index < INTRO_COUNT;
  const obIndex = Math.max(0, index - INTRO_COUNT); 

  
  useEffect(() => {
    if (!inIntro) return;
    const t = setTimeout(() => {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    }, 1200);
    return () => clearTimeout(t);
  }, [index, inIntro]);

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 60 });
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems?.length > 0) {
      setIndex(viewableItems[0].index ?? 0);
    }
  });

  const goNext = useCallback(() => {
    if (!isLast) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    } else {
      onDone?.();
    }
  }, [index, isLast, onDone]);

  const goPrev = useCallback(() => {
    if (index > 0) listRef.current?.scrollToIndex({ index: index - 1, animated: true });
  }, [index]);

  const skipToLast = useCallback(() => {
    listRef.current?.scrollToIndex({ index: SLIDES.length - 1, animated: true });
  }, []);

  const renderIntro = (variant: IntroSlide['variant']) => {
    if (variant === 'purple') {
      return (
        <View style={[styles.introBase, { backgroundColor: PURPLE }]}>
          <LogoBkoo2/>
          <Text style={styles.taglineWhite}>Mua — Bán sách và tài liệu trong trường, nhanh và tiết kiệm.</Text>
        </View>
      );
    }
    return (
      <View style={[styles.introBase, { backgroundColor: 'white' }]}>
         <LogoBkoo1/>
        <Text style={styles.taglinePurple}>Mua — Bán sách và tài liệu trong trường, nhanh và tiết kiệm.</Text>
      </View>
    );
  };

  const renderItem = useCallback(({ item }: { item: Slide }) => {
    if (item.kind === 'intro') {
      return <View style={styles.slide}>{renderIntro(item.variant)}</View>;
    }
    return (
      <View style={styles.slide}>
        <Pressable onPress={skipToLast} hitSlop={10} style={styles.skipWrap}>
          <Text style={styles.skipText}>Bỏ qua</Text>
        </Pressable>

        <View style={styles.illustrationWrap}>
          <View style={styles.aura} />
          <item.Icon width={width * 0.6} height={width * 0.6} />
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </View>
    );
  }, [skipToLast]);

  const dots = useMemo(() => {
    if (inIntro) return null;
    return (
      <View style={styles.dotsRow}>
        {Array.from({ length: OB_COUNT }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i === obIndex ? DOT_ACTIVE : DOT_INACTIVE,
                width: i === obIndex ? 18 : 8,
              },
            ]}
          />
        ))}
      </View>
    );
  }, [inIntro, obIndex]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={inIntro ? 'light-content' : 'dark-content'} />

      <FlatList
        ref={listRef}
        horizontal
        data={SLIDES}
        keyExtractor={(it) => it.key}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewConfigRef.current}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        scrollEnabled={!inIntro} 
      />

      {dots}

      
      {!inIntro && (
        <View style={styles.actions}>
          <Pressable style={[styles.primaryBtn, isLast && styles.primaryBtnLast]} onPress={goNext}>
            <Text style={styles.primaryText}>{isLast ? 'Bắt đầu' : 'Tiếp tục'}</Text>
          </Pressable>
          {index > INTRO_COUNT && (
            <Pressable style={styles.secondaryBtn} onPress={goPrev}>
              <Text style={styles.secondaryText}>Quay lại</Text>
            </Pressable>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  slide: { width,height },
  // paddingHorizontal: PADDING_H, 
  // Intro styles
  introBase: { flex: 1, alignItems: 'center', justifyContent: 'center' ,  maxWidth: width,height },
  brandWhite: { color: 'white', fontSize: 36, fontWeight: '800', marginBottom: 12},
  taglineWhite: { color: 'white', opacity: 0.9, fontSize: 14, paddingHorizontal: PADDING_H },
  brandPurple: { color: PURPLE, fontSize: 36, fontWeight: '800', marginBottom: 12 },
  taglinePurple: { color: PURPLE, opacity: 0.9, fontSize: 14,paddingHorizontal: PADDING_H },

  skipWrap: { alignSelf: 'flex-start', marginBottom: 8 },
  skipText: { fontSize: 14, color: PURPLE, fontWeight: '600' , marginLeft : 20 , marginTop : 20 },

  illustrationWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
    height: height * 0.36,
  },
  aura: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width,
    backgroundColor: '#F1EAFE',
    opacity: 0.9,
    top: '5%',
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
  },

  textBlock: { marginTop: 8, alignItems: 'center', paddingHorizontal: 8 },
  title: { fontSize: 22, fontWeight: '700', color: '#111111', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 15, lineHeight: 22, color: GRAY, textAlign: 'center' },

  dotsRow: { flexDirection: 'row', gap: 8, alignSelf: 'center' },
  dot: { height: 8, borderRadius: 4 },

  actions: { marginTop: 16, paddingHorizontal: PADDING_H, paddingBottom: 12, gap: 12 },
  primaryBtn: {
    backgroundColor: PURPLE, borderRadius: 14, paddingVertical: 14, alignItems: 'center', justifyContent: 'center',
  },
  primaryBtnLast: { backgroundColor: PURPLE_DARK },
  primaryText: { color: 'white', fontSize: 16, fontWeight: '700' },
  secondaryBtn: {
    backgroundColor: '#F4F1FB',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5DDF9',
  },
  secondaryText: { color: PURPLE, fontSize: 15, fontWeight: '600' },
});


