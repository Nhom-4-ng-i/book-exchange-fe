import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "delete" | "warning" | "info";
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  type = "info",
  isLoading = false,
}) => {
  const getIcon = () => {
    switch (type) {
      case "delete":
        return <Ionicons name="trash-outline" size={48} color="#EF4444" />;
      case "warning":
        return <Ionicons name="warning-outline" size={48} color="#F59E0B" />;
      default:
        return (
          <Ionicons
            name="information-circle-outline"
            size={48}
            color="#3B82F6"
          />
        );
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case "delete":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-4">
        <View className="bg-white w-full rounded-2xl p-6 items-center">
          {/* Icon */}
          <View className="w-20 h-20 items-center justify-center mb-4">
            {getIcon()}
          </View>

          {/* Title */}
          <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
            {title}
          </Text>

          {/* Message */}
          <Text className="text-gray-600 text-center mb-6 px-2">{message}</Text>

          {/* Buttons */}
          <View className="w-full flex-row justify-between gap-3">
            <Pressable
              className={`flex-1 h-12 border border-gray-300 rounded-lg items-center justify-center ${
                isLoading ? "opacity-50" : ""
              }`}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text className="text-gray-700 font-medium">{cancelText}</Text>
            </Pressable>

            <Pressable
              className={`flex-1 h-12 ${getButtonColor()} rounded-lg items-center justify-center ${
                isLoading ? "opacity-70" : ""
              }`}
              onPress={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-medium">{confirmText}</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;
