import IconEdit from "@/icons/IconEdit";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { AuthService } from "@/api";

interface ProfileHeaderProps {
  name: string;
  phone: string;
  onLogout?: () => void;
  avatarUri?: string;
  onProfileUpdate?: () => void;
  onPhoneUpdated?: (newPhone: string) => void;
}

function formatPhoneDigits(digits: string) {
  const s = digits.replace(/\D/g, "");
  const parts: string[] = [];
  for (let i = 0; i < s.length; i += 3) parts.push(s.slice(i, i + 3));
  return parts.join(" ");
}

export function ProfileHeader({
  name,
  phone,
  onLogout,
  avatarUri,
  onPhoneUpdated,
  onProfileUpdate,
}: ProfileHeaderProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [digits, setDigits] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatted = useMemo(() => formatPhoneDigits(digits), [digits]);

  const onTextChange = (text: string) => {
    const newDigits = text.replace(/\D/g, "");
    if (newDigits.length > 0) {
      const digitsWithoutLeadingZero = newDigits.startsWith("0")
        ? newDigits.substring(1)
        : newDigits;
      setDigits(`0${digitsWithoutLeadingZero}`.slice(0, 16));
    } else {
      setDigits("0");
    }
  };

  const canSave = digits.length > 6 && !submitting;

  const openEditor = () => {
    const cleanPhone = (phone || "").replace(/\D/g, "");
    const initial = cleanPhone.startsWith("0") ? cleanPhone : `0${cleanPhone}`;
    setDigits(initial);
    setError(null);
    setEditOpen(true);
  };

  const closeEditor = () => {
    if (submitting) return;
    setEditOpen(false);
  };

  const savePhone = async () => {
    if (!canSave) return;

    try {
      setSubmitting(true);
      setError(null);

      const phoneWithoutLeadingZero = digits.startsWith("0")
        ? digits.substring(1)
        : digits;
      await AuthService.updatePhoneRouteApiAuthPhonePut({
        phone: phoneWithoutLeadingZero,
      });

      setEditOpen(false);
      onPhoneUpdated?.(digits);
      onProfileUpdate?.();
    } catch (e) {
      console.log("Update phone error:", e);
      setError("Không thể cập nhật số điện thoại.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <View className="flex-row items-center gap-4 px-6 pt-4 pb-4 border-b border-b-gray-100">
      <View className="h-14 w-14 overflow-hidden rounded-full bg-textPrimary100">
        {avatarUri ? (
          <Image
            source={{ uri: avatarUri }}
            className="h-full w-full"
            resizeMode="cover"
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-lg font-semibold text-textPrimary500">
              BK
            </Text>
          </View>
        )}
      </View>
      <View className="flex-1 gap-[2px]">
        <Text className="text-heading6 font-semibold text-textGray900">
          {name}
        </Text>
        <View className="flex-1 flex-row items-center gap-2">
          <Text className="text-bodyMedium text-textGray500">{phone}</Text>
          <Pressable
            onPress={openEditor}
            className="p-1 rounded-md active:opacity-70"
            hitSlop={10}
          >
            <IconEdit />
          </Pressable>
        </View>
      </View>
      <Pressable onPress={onLogout} className="rounded-md bg-transparent p-2">
        <Text className="text-bodyMedium font-semibold text-textRed">
          Đăng xuất
        </Text>
      </Pressable>

      <Modal
        visible={editOpen}
        transparent
        animationType="fade"
        onRequestClose={closeEditor}
      >
        <View
          className="flex-1 items-center justify-center px-6"
          style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
        >
          <View className="w-full rounded-2xl bg-white p-5">
            <Text className="text-lg font-bold text-textPrimary900">
              Cập nhật số điện thoại
            </Text>

            <Text className="mt-2 text-sm text-textGray500">
              Nhập số điện thoại mới của bạn.
            </Text>

            <View className="mt-4 rounded-lg bg-gray-50 px-3 py-3">
              <TextInput
                value={digits.replace(/(\d{3})(?=\d)/g, "$1 ")}
                onChangeText={onTextChange}
                style={{
                  lineHeight: 18,
                }}
                keyboardType="phone-pad"
                placeholder="VD: 0907 608 170"
                placeholderTextColor="#9CA3AF"
                editable={!submitting}
                className="text-base text-textPrimary900"
              />
            </View>

            {error && (
              <Text className="mt-2 text-xs text-red-500">{error}</Text>
            )}

            <View className="mt-5 flex-row gap-3">
              <Pressable
                onPress={closeEditor}
                disabled={submitting}
                className="flex-1 items-center justify-center rounded-xl py-3"
                style={{ backgroundColor: "#F3F4F6" }}
              >
                <Text className="font-semibold text-textGray700">Hủy</Text>
              </Pressable>

              <Pressable
                onPress={savePhone}
                disabled={!canSave}
                className="flex-1 items-center justify-center rounded-xl py-3 disabled:opacity-60"
                style={{ backgroundColor: "#5E3EA1" }}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="font-semibold text-white">Lưu</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
