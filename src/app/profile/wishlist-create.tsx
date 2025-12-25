import { useRouter } from "expo-router";
import { ArrowLeft, ChevronDown } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { CoursesService, WishlistsService } from "@/api";
import { InfoBanner } from "@/components/profile/InfoBanner";

type Course = {
  id: number;
  name: string;
};

export default function WishlistCreateScreen() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [maxPriceText, setMaxPriceText] = useState("");

  const [coursesLoading, setCoursesLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [courseSearch, setCourseSearch] = useState("");

  const filteredCourses = useMemo(() => {
    const q = courseSearch.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter((c) => c.name?.toLowerCase().includes(q));
  }, [courses, courseSearch]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);
        setCoursesError(null);

        const data = await CoursesService.getCoursesListRouteApiCoursesGet();
        const arr: Course[] = Array.isArray(data) ? data : [];

        arr.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

        setCourses(arr);
      } catch (e) {
        console.log("Load courses error:", e);
        setCoursesError("Không thể tải danh sách môn học.");
        setCourses([]);
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const canSubmit = useMemo(() => {
    if (submitting) return false;
    if (title.trim().length === 0) return false;
    return true;
  }, [title, submitting]);

  const parsedMaxPrice = useMemo(() => {
    const cleaned = maxPriceText.replace(/[^\d]/g, "");
    if (!cleaned) return null;
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  }, [maxPriceText]);

  const selectedCourseLabel = useMemo(() => {
    if (selectedCourse) return selectedCourse.name;
    if (coursesLoading) return "Đang tải...";
    if (coursesError) return "Không tải được môn học";
    return "Chọn môn học";
  }, [selectedCourse, coursesLoading, coursesError]);

  const cycleCourse = () => {
    if (coursesLoading || courses.length === 0) return;

    if (!selectedCourse) {
      setSelectedCourse(courses[0]);
      return;
    }
    const idx = courses.findIndex((c) => c.id === selectedCourse.id);
    const next = courses[(idx + 1) % courses.length];
    setSelectedCourse(next);
  };

  const submitWishlist = async () => {
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      setSubmitError(null);

      const payload: any = {
        title: title.trim(),
        course_id: selectedCourse ? selectedCourse.id : 0,
        max_price: parsedMaxPrice ?? 0,
      };

      await WishlistsService.insertWishlistRouteApiWishlistsPost(payload);

      router.back();
    } catch (e) {
      console.log("Create wishlist error:", e);
      setSubmitError("Không thể tạo wishlist. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={["left", "right", "bottom"]}
    >
      <View className="flex-row items-center justify-between px-6 py-2 h-16">
        <Pressable
          onPress={() => router.back()}
          className="rounded-full p-2 active:opacity-70"
        >
          <ArrowLeft size={22} />
        </Pressable>
        <Text className="flex-1 text-center text-xl font-bold text-textPrimary900">
          Tạo Wishlist
        </Text>
        <View className="w-8" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="px-6 mt-6">
          <InfoBanner message="💡 Tạo danh sách sách bạn đang cần. Khi có người đăng bán sách khớp, bạn sẽ nhận thông báo!" />

          {submitError && (
            <Text className="mt-3 text-sm text-red-500">{submitError}</Text>
          )}

          <View className="gap-4 rounded-2xl bg-white">
            <View>
              <Text className="mb-3 text-bodyMedium font-medium text-textPrimary900">
                Tên sách/tài liệu cần tìm *
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="VD: Giải tích 2"
                style={{
                  backgroundColor: "#E8E8E8",
                  paddingTop: 8,
                  paddingBottom: 10,
                  color: "#7A7A7A",
                }}
                className="rounded-lg px-2 text-bodyMedium text-textPrimary900"
              />
            </View>

            <View>
              <Text className="mb-3 text-bodyMedium font-medium text-textPrimary900">
                Môn học (không bắt buộc)
              </Text>
              <Pressable
                className="flex-row items-center justify-between rounded-lg px-2"
                style={{
                  backgroundColor: "#E8E8E8",
                  paddingTop: 8,
                  paddingBottom: 10,
                }}
                onPress={() => setCourseModalOpen(true)}
                disabled={coursesLoading || !!coursesError}
              >
                <Text className="text-bodyMedium text-textGray600">
                  {selectedCourseLabel}
                </Text>

                {coursesLoading ? (
                  <ActivityIndicator />
                ) : (
                  <ChevronDown size={18} />
                )}
              </Pressable>

              {coursesError && (
                <Text className="mt-1 text-xs text-red-500">
                  {coursesError}
                </Text>
              )}

              {selectedCourse && (
                <Pressable
                  className="mt-2 self-start"
                  onPress={() => setSelectedCourse(null)}
                >
                  <Text className="text-xs text-textPrimary500">
                    Bỏ chọn môn học
                  </Text>
                </Pressable>
              )}
            </View>

            <View>
              <Text className="mb-3 text-bodyMedium font-medium text-textPrimary900">
                Giá tối đa (không bắt buộc)
              </Text>
              <TextInput
                placeholder="VD: 120000"
                keyboardType="numeric"
                style={{
                  backgroundColor: "#E8E8E8",
                  paddingTop: 8,
                  paddingBottom: 10,
                  color: "#7A7A7A",
                }}
                className="rounded-lg px-2 text-bodyMedium"
              />
            </View>

            <View
              className="rounded-2xl bg-textGray100 p-4"
              style={{ backgroundColor: "#F5F5F5" }}
            >
              <Text className="text-xs font-semibold text-textGray700">
                Ví dụ Wishlist:
              </Text>
              <Text className="text-xs text-textGray600">
                - &quot;Giải Tích 2&quot; - Toán - Giá tối đa 50.000đ
              </Text>
              <Text className="text-xs text-textGray600">
                - &quot;Vật Lý&quot; - Lý - Không giới hạn giá
              </Text>
              <Text className="text-xs text-textGray600">
                - &quot;Giáo Trình CTDL&quot; - Trí tuệ nhân tạo - Giá tối đa
                100,000đ
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 px-6 bg-textGray50"
        style={{ paddingTop: 20 }}
      >
        <Pressable
          className="items-center rounded-lg bg-textPrimary500 py-3"
          onPress={submitWishlist}
          disabled={!canSubmit}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-heading6 font-bold text-white">
              + Thêm Wishlist mới
            </Text>
          )}
        </Pressable>
      </View>

      <Modal
        visible={courseModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setCourseModalOpen(false)}
      >
        <Pressable
          className="flex-1"
          style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
          onPress={() => setCourseModalOpen(false)}
        />

        <View
          className="absolute bottom-0 left-0 right-0 bg-white px-6 pt-4"
          style={{
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            maxHeight: "75%",
          }}
        >
          <View className="items-center mb-3">
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 999,
                backgroundColor: "#E5E7EB",
              }}
            />
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-textPrimary900">
              Chọn môn học
            </Text>

            <Pressable onPress={() => setCourseModalOpen(false)}>
              <Text className="text-textPrimary500 font-semibold">Đóng</Text>
            </Pressable>
          </View>

          <View className="mt-3">
            <TextInput
              value={courseSearch}
              onChangeText={setCourseSearch}
              placeholder="Tìm môn học..."
              placeholderTextColor="#9CA3AF"
              style={{
                backgroundColor: "#F3F4F6",
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderRadius: 10,
                color: "#111827",
              }}
            />
          </View>

          <View className="flex-row gap-3 mt-3">
            <Pressable
              className="px-3 py-2 rounded-lg"
              style={{ backgroundColor: "#F3F4F6" }}
              onPress={() => {
                setSelectedCourse(null);
                setCourseModalOpen(false);
              }}
            >
              <Text className="text-sm text-textGray700 font-medium">
                Bỏ chọn
              </Text>
            </Pressable>

            <Pressable
              className="px-3 py-2 rounded-lg"
              style={{ backgroundColor: "#F3F4F6" }}
              onPress={() => setCourseSearch("")}
            >
              <Text className="text-sm text-textGray700 font-medium">
                Xóa tìm kiếm
              </Text>
            </Pressable>
          </View>

          <View className="mt-3" style={{ flex: 1 }}>
            {coursesLoading ? (
              <View className="py-6 items-center">
                <ActivityIndicator />
              </View>
            ) : coursesError ? (
              <Text className="text-sm text-red-500">{coursesError}</Text>
            ) : (
              <FlatList
                data={filteredCourses}
                keyExtractor={(item) => String(item.id)}
                keyboardShouldPersistTaps="handled"
                ItemSeparatorComponent={() => (
                  <View style={{ height: 1, backgroundColor: "#EFEFEF" }} />
                )}
                renderItem={({ item }) => {
                  const active = selectedCourse?.id === item.id;
                  return (
                    <Pressable
                      className="py-4"
                      onPress={() => {
                        setSelectedCourse(item);
                        setCourseModalOpen(false);
                      }}
                    >
                      <Text
                        className={`text-base ${active ? "text-textPrimary500 font-bold" : "text-textPrimary900"}`}
                      >
                        {item.name}
                      </Text>
                    </Pressable>
                  );
                }}
                ListEmptyComponent={() => (
                  <View className="py-6 items-center">
                    <Text className="text-sm text-textGray500">
                      Không tìm thấy môn học phù hợp.
                    </Text>
                  </View>
                )}
              />
            )}
          </View>

          <View style={{ height: 20 }} />
        </View>
      </Modal>
    </SafeAreaView>
  );
}
