import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import IconPhone from '../../../icons/IconPhone';


    import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';


    export default function PhoneNumberScreen() {
    const router = useRouter();
    const [digits, setDigits] = useState<string>('');

    const countryCode = '(+965)';

    const formatted = useMemo(() => {
        const s = digits.replace(/\D/g, '');
        const parts: string[] = [];
        for (let i = 0; i < s.length; i += 3) parts.push(s.slice(i, i + 3));
        return parts.join(' ');
    }, [digits]);

    const onKeyPress = (n: string) => {
        if (n === 'del') return setDigits(prev => prev.slice(0, -1));
        setDigits(prev => (prev + n).slice(0, 15));
    };

    const canContinue = digits.length >= 6;

    return (
        <SafeAreaView style={styles.safe}>
        {/* <View style={styles.topBar}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>{'< '}</Text>
            </Pressable>
            <Pressable onPress={() => router.replace('/')}>
            <Text style={styles.skip}>Bỏ qua</Text>
            </Pressable>
        </View> */}

        <View style={styles.content}>
            <Text style={styles.heading}>Số điện thoại</Text>
            <Text style={styles.hint}>Vui lòng nhập số điện thoại của bạn để chúng tôi có thể giao hàng dễ dàng hơn</Text>

            <View style={styles.labelWrap}>
            <Text style={styles.label}>Số điện thoại</Text>
            <View style={styles.inputBox}>
                <View style={styles.countryCodeBox}>
                    <IconPhone />
                    <Text style={styles.countryCodeText}>{countryCode}</Text>
                </View>
                <Text style={[
                  styles.phoneText,
                  !digits && styles.phoneTextPlaceholder
                ]}>
                  {formatted || '123 435 7565'}
                </Text>
            </View>
            </View>

            <Pressable
            disabled={!canContinue}
            onPress={() => router.push('./')}
            style={({ pressed }) => [
                styles.continue,
                !canContinue && styles.continueDisabled,
                pressed && { opacity: 0.85 },
            ]}
            >
            <Text style={styles.continueText}>Tiếp tục</Text>
            </Pressable>
        </View>

        <View style={styles.keypad}>
            {['1','2','3','4','5','6','7','8','9','.','0','del'].map(k => (
            <Pressable
                key={k}
                onPress={() => onKeyPress(k)}
                style={({ pressed }) => [styles.key, pressed && styles.keyPressed]}
            >
                <Text style={styles.keyText}>{k === 'del' ? '⌫' : k}</Text>
            </Pressable>
            ))}
        </View>
        </SafeAreaView>
    );
    }

    const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#ffffff' },
    //   topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
    backButton: { padding: 8 },
    backText: { fontSize: 20 },
    skip: { color: '#54408C', fontWeight: '500' , fontSize: 14},

    content: { paddingHorizontal: 24, marginBottom: 24},
    heading: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 16 },
    hint: { color: '#A6A6A6', textAlign: 'center', marginTop: 8, marginBottom: 24, fontWeight: '400' },

    labelWrap: { marginTop: 8 },
    label: { fontWeight: '500', marginBottom: 8, fontSize: 14 },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fafafa',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 12,
        marginBottom: 80,
    },
    phoneIcon: { marginRight: 12, fontSize: 18 },
    phoneText: { fontSize: 16, color: '#121212' },
    phoneTextPlaceholder: { color: '#9CA3AF' },

    continue: {
        marginTop: 24,
        backgroundColor: '#54408C',
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    continueDisabled: { backgroundColor: '#c4b5fd' },
    continueText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    countryCodeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 4,
    },
    countryCodeText: {
        marginLeft: 4,
        fontSize: 16,
        color: '#121212',
        fontWeight: '600',
    },

    keypad: {
        backgroundColor: '#54408C',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingTop: 8,
        height: '100%',
        paddingBottom: 20,
    },
    key: {
        width: '33%',
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    keyPressed: { opacity: 0.7, backgroundColor: '#c4b5fd' },
    keyText: { 
        color: '#fff', 
        fontSize: 24, 
        fontWeight: '700',
        textAlign: 'center',
    },
    });
