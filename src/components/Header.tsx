import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import '../../global.css';
import IconBack from '../icons/IconBack';

interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
  showSkipButton?: boolean;
  onSkipPress?: () => void;
}

export default function Header({
  title,
  showBackButton = false,
  showSkipButton = false,
  onSkipPress,
}: AppHeaderProps) {
  const router = useRouter();

  const handleBack = () => router.back();

  return (
    <SafeAreaView className="bg-white" edges={['top']}>
      <View className="flex-row items-center justify-between px-6 py-2 h-16">
      
      <View className="flex-1 items-start">
        {showBackButton && (
          <Pressable onPress={handleBack} className="p-2 active:opacity-70">
            <IconBack />
          </Pressable>
        )}
      </View>

      <View className="flex-1 items-center">
        {title && (
          <Text className="text-lg font-bold text-gray-900">{title}</Text>
        )}
      </View>

      <View className="flex-1 items-end">
        {showSkipButton && (
          <Pressable onPress={onSkipPress} className="p-2 active:opacity-70">
            <Text className="text-base font-medium text-primary">Bỏ qua</Text>
          </Pressable>
        )}
      </View>

      </View>
    </SafeAreaView>
  );
}

