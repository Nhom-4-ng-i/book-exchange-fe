import IconCard from "@/icons/IconCard";
import IconHome from "@/icons/IconHome";
import IconProfile from "@/icons/IconProfile";
import * as Sentry from '@sentry/react-native';
import { Link, usePathname } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

type NavItem = {
  name: string;
  path: string;
  icon: React.FC<{ color: string }>;
};

const navItems: NavItem[] = [
  { 
    name: 'Trang chủ', 
    path: '/home', 
    icon: IconHome
  },
  { 
    name: 'Giỏ hàng', 
    path: '/cart', 
    icon: IconCard
  },
  { 
    name: 'Hồ sơ', 
    path: '/profile', 
    icon: IconProfile
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <View className="flex-row items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          const iconColor = isActive ? '#54408C' : '#A6A6A6';

          const logBreadcrumb = () => {
            Sentry.addBreadcrumb({
              category: "navigation",
              type: "info",
              message: `BottomNav -> ${item.name}`,
              level: "info",
              data: { to: item.path, from: pathname },
            });
          };

          return (
            <Link
              key={item.path}
              href={item.path}
              asChild
            >
              <Pressable
                className="items-center py-2 px-4"
                onPress={logBreadcrumb}
              >
                <View className={`${isActive ? 'text-textPrimary500' : 'text-gray-500'}`}>
                  <Icon color={iconColor} />
                </View>
                <Text 
                  className={`text-xs mt-1 ${isActive ? 'text-textPrimary500 font-semibold' : 'text-gray-600'}`}
                >
                  {item.name}
                </Text>
              </Pressable>
            </Link>
          );
        })}
      </View>
    </View>
  );
}

