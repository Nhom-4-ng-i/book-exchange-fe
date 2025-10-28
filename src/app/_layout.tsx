import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import 'react-native-gesture-handler';
import "../../styles/global.css";
globalThis.React = React;
 
export default function RootLayout() {
  return (
    <View style={styles.container}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'Trang Chủ',
            headerShown: false,
            headerTitleAlign: 'center',
            headerBackButtonDisplayMode: 'minimal',
          }}
        />

        <Stack.Screen
          name="login/index"
          options={{
            headerShown: false,
            headerBackButtonDisplayMode: 'minimal',
          }}
        />

        <Stack.Screen
          name="profile/index"
          options={{
            headerShown: false,
            headerBackButtonDisplayMode: 'minimal',
          }}
        />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
});