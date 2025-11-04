import React, { useRef, useState, useMemo, useCallback } from 'react';
import IconOnboarding1 from '../../icons/IconOnboarding';
import IconOnboarding2 from '../../icons/IconOnboarding2';
import IconOnboarding3 from '../../icons/IconOnboarding3';
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  StyleSheet,
  Dimensions,
  ViewToken,
  StatusBar,
  SafeAreaView,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const PADDING_H = 24;
const PURPLE = '#5E3EA1';
const PURPLE_DARK = '#4B3282';
const GRAY = '#8C8C8C';
const DOT_INACTIVE = '#D8CFF2';
const DOT_ACTIVE = PURPLE;
type OnboardingItem = {
  key: string;
  title: string;
  subtitle: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};


const ONBOARDING_DATA = [
  {
    key: 'find',
    title: 'Tìm sách nhanh',
    subtitle:
      'Tìm và lọc sách theo môn, trạng thái, trường, phạm vi giá,… Hỗ trợ nhanh lẹ trong việc tìm kiếm có kết quả ngay.',
      Icon: IconOnboarding1,
  },
  {
    key: 'sell',
    title: 'Đăng bán trong 1 phút',
    subtitle:
      'Đăng tải ảnh sách lên, điền các thông tin cơ bản cần thiết và bấm “Đăng lên”. Người mua thấy ngay lập tức!',
      Icon: IconOnboarding2,
  },
  {
    key: 'wishlist',
    title: 'Wishlist thông minh',
    subtitle:
      'Lưu sách mà bạn mong muốn mua; nhận thông báo ngay khi có người đăng bán sách tương ứng.',
      Icon: IconOnboarding3,
  },
];

type Props = {
  onDone?: () => void; 
};

export default function OnboardingScreen({onDone} : Props ) {
  const listRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);
  
  const isLast = index === ONBOARDING_DATA.length - 1;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 60 });
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems?.length > 0) {
      setIndex(viewableItems[0].index ?? 0);
    }
  });

  const goNext = useCallback(() => {
    if (isLast) {
      console.log('Onboarding done');
      onDone?.(); 
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    }
  }, [index, isLast, onDone]);

  const goPrev = useCallback(() => {
    if (index > 0) {
      listRef.current?.scrollToIndex({ index: index - 1, animated: true });
    }
  }, [index]);

  const skipToLast = useCallback(() => {
    const last = ONBOARDING_DATA.length - 1;
    listRef.current?.scrollToIndex({ index: last, animated: true });
  }, []);

  const renderItem = useCallback(({ item }: { item: OnboardingItem }) => {
    return (
      <View style={styles.slide}>
        {/* Bỏ qua */}
        <Pressable onPress={skipToLast} hitSlop={10} style={styles.skipWrap}>
          <Text style={styles.skipText}>Bỏ qua</Text>
        </Pressable>

        {/* Ảnh + aura */}
        <View style={styles.illustrationWrap}>
          <View style={styles.aura} />
          <item.Icon className="w-64 h-64" />
        </View>

        {/* Text */}
        <View style={styles.textBlock}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </View>
    );
  }, [skipToLast]);

  const dots = useMemo(
    () => (
      <View style={styles.dotsRow}>
        {ONBOARDING_DATA.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i === index ? DOT_ACTIVE : DOT_INACTIVE,
                width: i === index ? 18 : 8,
              },
            ]}
          />
        ))}
      </View>
    ),
    [index]
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <FlatList
        ref={listRef}
        horizontal
        data={ONBOARDING_DATA}
        keyExtractor={(it) => it.key}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewConfigRef.current}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
      />

      {/* Dots */}
      {dots}

      {/* Buttons */}
      <View style={styles.actions}>
        <Pressable style={[styles.primaryBtn, isLast && styles.primaryBtnLast]} onPress={goNext}>
          <Text style={styles.primaryText}>{isLast ? 'Bắt đầu' : 'Tiếp tục'}</Text>
        </Pressable>

        {index > 0 && (
          <Pressable style={styles.secondaryBtn} onPress={goPrev}>
            <Text style={styles.secondaryText}>Quay lại</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  slide: {
    width,
    paddingHorizontal: PADDING_H,
    paddingTop: 8,
    paddingBottom: 24,
  },
  skipWrap: { alignSelf: 'flex-start', marginBottom: 8 },
  skipText: { fontSize: 14, color: PURPLE, fontWeight: '600' },

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
  image: { width: width * 0.75, height: '100%' },

  textBlock: { marginTop: 8, alignItems: 'center', paddingHorizontal: 8 },
  title: { fontSize: 22, fontWeight: '700', color: '#111111', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 15, lineHeight: 22, color: GRAY, textAlign: 'center' },

  dotsRow: { flexDirection: 'row', gap: 8, alignSelf: 'center' },
  dot: { height: 8, borderRadius: 4 },

  actions: { marginTop: 16, paddingHorizontal: PADDING_H, paddingBottom: 12, gap: 12 },
  primaryBtn: {
    backgroundColor: PURPLE,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
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

