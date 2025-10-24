import { Stack } from "expo-router";
import { Pressable } from "react-native";
import 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Trang chủ 📚",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="detail"
        options={({ navigation }) => ({
          title: "Chi tiết",
          headerLeft: () => (
            <Pressable onPress={() => navigation.goBack()}>
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="profile"
        options={{ headerShown: false }} // vì bên trong profile có layout riêng
      />
      <Stack.Screen
        name="auth"
        options={{ headerShown: false }} // auth cũng có layout riêng
      />
    </Stack>
  );
}
