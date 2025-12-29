// src/components/SuccessModal.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  onViewOrder: () => void;
  title?: string;
  message?: string;
  viewOrderText?: string;
  continueText?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  onClose,
  onViewOrder,
  title = "Đặt mua thành công!",
  message = "Yêu cầu của bạn đã được gửi đến người bán. Bạn có thể theo dõi đơn hàng trong Giỏ hàng.",
  viewOrderText = "Xem đơn hàng",
  continueText = "Tiếp tục mua sắm",
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 justify-center items-center px-[14px]">
        <View className="bg-white w-full rounded-[24px] p-6 items-center">
          {/* Success Icon */}
          <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="checkmark-circle" size={60} color="#10B981" />
          </View>

          <Text className="text-[20px] font-bold text-gray-900 mb-2">
            {title}
          </Text>
          <Text className="text-gray-500 text-center mb-8 px-4">{message}</Text>

          <View className="w-full gap-y-3">
            <Pressable
              className="w-full bg-[#54408C] h-[52px] rounded-full items-center justify-center"
              onPress={onViewOrder}
            >
              <Text className="text-white font-bold text-base">
                {viewOrderText}
              </Text>
            </Pressable>

            <Pressable
              className="w-full h-[52px] items-center justify-center"
              onPress={onClose}
            >
              <Text className="text-gray-400 font-medium">{continueText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SuccessModal;
