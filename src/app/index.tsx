import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Đây là trang chủ 📚</Text>
      <Button title="Hồ sơ" onPress={() => router.push("./profile")} />
      <Button title="Đăng nhập" onPress={() => router.push("./auth/login")} />
    </View>
  );
}
