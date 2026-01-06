import SuccessModal from "@/components/SuccessModal";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronDown } from "lucide-react-native";
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
import IconBack from "@/icons/IconBack";
import * as Sentry from "@sentry/react-native";

type Course = {
  id: number;
  name: string;
};

const WishlistEditScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const wishlistId = useMemo(() => {
    const raw = params?.id;
    if (!raw) return null;
    const s = Array.isArray(raw) ? raw[0] : String(raw);
    const n = parseInt(s, 10);
    return Number.isFinite(n) ? n : null;
  }, [params]);

  // ✅ lấy dữ liệu item truyền qua params (từ list screen)
  const initialTitle = useMemo(() => {
    const raw = params?.title;
    return Array.isArray(raw) ? String(raw[0] ?? "") : raw ? String(raw) : "";
  }, [params]);

  const initialCourseId = useMemo(() => {
    const raw = params?.course_id;
    const s = Array.isArray(raw)
      ? String(raw[0] ?? "")
      : raw
        ? String(raw)
        : "";
    const n = s ? parseInt(s, 10) : NaN;
    return Number.isFinite(n) ? n : null;
  }, [params]);

  const initialMaxPrice = useMemo(() => {
    const raw = params?.max_price;
    const s = Array.isArray(raw)
      ? String(raw[0] ?? "")
      : raw
        ? String(raw)
        : "";
    const n = s ? parseInt(s, 10) : NaN;
    return Number.isFinite(n) ? n : null;
  }, [params]);

  // form state
  const [title, setTitle] = useState(initialTitle);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [maxPriceText, setMaxPriceText] = useState(
    initialMaxPrice != null ? String(initialMaxPrice) : ""
  );

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // modal
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [courseSearch, setCourseSearch] = useState("");

  const filteredCourses = useMemo(() => {
    const q = courseSearch.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter((c) => (c.name || "").toLowerCase().includes(q));
  }, [courses, courseSearch]);

  // parse max price
  const parsedMaxPrice = useMemo(() => {
    const cleaned = maxPriceText.replace(/[^\d]/g, "");
    if (!cleaned) return null;
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  }, [maxPriceText]);

  const canSubmit = useMemo(() => {
    if (loading || submitting) return false;
    if (title.trim().length === 0) return false;
    return true;
  }, [loading, submitting, title]);

  useEffect(() => {
    if (!wishlistId) {
      router.back();
      return;
    }

    const fetchCoursesAndHydrate = async () => {
      try {
        setLoading(true);
        setCoursesError(null);
        setSubmitError(null);

        // 1) load courses
        const coursesData =
          await CoursesService.getCoursesListRouteApiCoursesGet();
        const coursesArr: Course[] = Array.isArray(coursesData)
          ? coursesData
          : [];
        coursesArr.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        setCourses(coursesArr);

        // 2) hydrate form from params (không gọi GET detail)
        setTitle(initialTitle);
        setMaxPriceText(initialMaxPrice != null ? String(initialMaxPrice) : "");

        if (initialCourseId != null) {
          const found =
            coursesArr.find((c) => c.id === initialCourseId) ?? null;
          setSelectedCourse(found);
        } else {
          setSelectedCourse(null);
        }
      } catch (e) {
        Sentry.withScope((scope) => {
          scope.setTag("feature", "WishlistEditScreen");
          scope.setContext("api", {
            url: "http://160.187.246.140:8000/api/courses/",
            method: "GET",
          });
          scope.setLevel("error");
          Sentry.captureException(e);
        });
        console.log("Load courses error:", e);
        setCoursesError("Không thể tải danh sách môn học.");
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndHydrate();
  }, [wishlistId, initialTitle, initialCourseId, initialMaxPrice, router]);

  useEffect(() => {
    console.log("Params:", params);
    console.log("Initial title:", initialTitle);
    console.log("Initial course ID:", initialCourseId);
    console.log("Initial max price:", initialMaxPrice);
  }, [params]);
  const submitWishlist = async () => {
    if (!wishlistId || !canSubmit) return;

    try {
      setSubmitting(true);
      setSubmitError(null);

      const payload = {
        title: title.trim(),
        course_id: selectedCourse?.id ?? null,
        max_price: parsedMaxPrice ?? null,
      };

      await WishlistsService.updateWishlistRouteApiWishlistsWishlistIdPut(
        wishlistId,
        payload as any
      );

      setShowSuccess(true);
    } catch (e) {
      Sentry.withScope((scope) => {
        scope.setTag("feature", "WishlistEditScreen");
        scope.setContext("api", {
          url: "http://160.187.246.140:8000/api/wishlists/",
          method: "PUT",
        });
        scope.setLevel("error");
        Sentry.captureException(e);
      });
      console.log("Update wishlist error:", e);
      setSubmitError("Không thể cập nhật wishlist. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#5E3EA1" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["left", "right", "top"]}>
      <View className="flex-row items-center justify-between px-6 py-2 h-16">
        <Pressable
          onPress={() => router.back()}
          className="rounded-full p-2 active:opacity-70"
        >
          <IconBack />
        </Pressable>
        <Text className="flex-1 text-center text-xl font-bold text-textPrimary900">
          Chỉnh sửa Wishlist
        </Text>
        <View className="w-8" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="px-6 mt-6">
          <InfoBanner message="💡 Cập nhật thông tin wishlist của bạn. Khi có sách phù hợp, bạn sẽ nhận được thông báo!" />

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
                placeholderTextColor="#7A7A7A"
                style={{
                  backgroundColor: "#E8E8E8",
                  paddingTop: 8,
                  paddingBottom: 10,
                }}
                className="rounded-lg px-2 text-bodyMedium text-textPrimary900"
              />
              <Text className="text-bodySmall mt-1 text-textGray600">
                Không cần chính xác, hệ thống sẽ tìm sách có tên tương tự
              </Text>
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
                disabled={!!coursesError}
              >
                <Text className="text-bodyMedium text-textPrimary900">
                  {selectedCourse?.name || "Chọn môn học"}
                </Text>
                <ChevronDown size={18} />
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
                value={maxPriceText}
                onChangeText={setMaxPriceText}
                placeholder="VD: 120000"
                placeholderTextColor="#7A7A7A"
                keyboardType="numeric"
                style={{
                  backgroundColor: "#E8E8E8",
                  paddingTop: 8,
                  paddingBottom: 10,
                }}
                className="rounded-lg px-2 text-bodyMedium text-textPrimary900"
              />
              <Text className="text-bodySmall mt-1 text-textGray600">
                Chỉ thông báo khi sách có giá ≤ số tiền này
              </Text>
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

      <SafeAreaView edges={["bottom"]} className="bg-textGray50">
        <View className="px-6 pt-3 pb-5">
          <Pressable
            className="items-center rounded-lg bg-textPrimary500 py-3 active:opacity-80 disabled:opacity-60"
            onPress={submitWishlist}
            disabled={!canSubmit}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-heading6 font-bold text-white">
                Cập nhật Wishlist
              </Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>

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
            height: "75%",
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
            <Text
              className={`text-bodyMedium ${selectedCourse ? "text-textPrimary900" : "text-textGray600"}`}
            >
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

          <View className="mt-3" style={{ flex: 1, minHeight: 0 }}>
            {coursesError ? (
              <Text className="text-sm text-red-500">{coursesError}</Text>
            ) : (
              <FlatList
                data={filteredCourses}
                keyExtractor={(item) => String(item.id)}
                keyboardShouldPersistTaps="handled"
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 20 }}
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
                        className={`text-base ${
                          active
                            ? "text-textPrimary500 font-bold"
                            : "text-textPrimary900"
                        }`}
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

      <SuccessModal
        visible={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          router.back();
        }}
        onViewOrder={() => {
          setShowSuccess(false);
          router.back();
        }}
        title="Cập nhật thành công!"
        message="Wishlist của bạn đã được cập nhật thành công."
        viewOrderText="Đã hiểu"
        continueText="Đóng"
      />
    </SafeAreaView>
  );
};

export default WishlistEditScreen;
