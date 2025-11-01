import { router } from 'expo-router';
import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import IconSuccess from '../icons/IconSuccess';


export default function SuccessScreen() {
  
  const handleStart = () => {
    router.replace('/'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }} /> 

      <View style={styles.content}>
        <IconSuccess/>
        <Text style={styles.title}>Cập nhật thành công</Text>
        <Text style={styles.subtitle}>
          Bạn đã cập nhật thành công các thông tin, hãy tận hưởng phần mềm tuyệt vời nhất !
        </Text>
      </View>

      <View style={styles.footer}>
        <Pressable 
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.8 }
          ]} 
          onPress={handleStart}
        >
          <Text style={styles.buttonText}>Bắt đầu</Text>
        </Pressable>
      </View>
      <View style={{ flex: 1 }} />
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    marginTop: 40, 
  },
  subtitle: {
    fontSize: 16,
    color: '#A6A6A6', 
    textAlign: 'center',
  },
  footer: {
    padding: 24,
    paddingTop: 40, 
  },
  button: {
    backgroundColor: '#54408C',
    height: 48,
    borderRadius: 9999, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
