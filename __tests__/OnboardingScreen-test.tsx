import {
  act,
  fireEvent,
  render,
  RenderAPI,
  waitFor,
} from "@testing-library/react-native";
import React from "react";
import { FlatList } from "react-native";

import * as Sentry from "@sentry/react-native";
import { useRouter } from "expo-router";
import { storeData } from "utils/asyncStorage";
import OnboardingScreen from "../src/app/onboarding";

(global as any).__DEV__ = true;

jest.mock("@sentry/react-native", () => ({
  captureMessage: jest.fn(),
}));

// Mock useOnboardingGate để tránh chạy useEffect async gây cảnh báo act(...)
jest.mock("../src/app/hooks/useOnboardingGate", () => ({
  useOnboardingGate: () => ({
    loading: false,
    shouldShowOnboarding: false,
    markDone: jest.fn(),
  }),
}));

jest.mock("../src/icons/IconOnboarding1", () => () => null);
jest.mock("../src/icons/IconOnboarding2", () => () => null);
jest.mock("../src/icons/IconOnboarding3", () => () => null);

jest.mock("utils/asyncStorage", () => ({
  storeData: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

const mockRouterReplace = jest.fn();
const mockStoreData = storeData as jest.MockedFunction<typeof storeData>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockCaptureMessage = Sentry.captureMessage as jest.MockedFunction<
  typeof Sentry.captureMessage>
;


const renderOnboarding = () => render(<OnboardingScreen />);

const updateVisibleSlide = (api: RenderAPI, index: number) => {
  const flatList = api.UNSAFE_getByType(FlatList);
  act(() => {
    flatList.props.onViewableItemsChanged?.({
      viewableItems: [{ index }],
    });
  });
};

describe("<OnboardingScreen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ replace: mockRouterReplace } as any);
    mockStoreData.mockResolvedValue(undefined as any);
  });

  test("render tiêu đề và mô tả của slide đầu tiên", () => {
    const { getByText } = renderOnboarding();

    expect(getByText("Tìm sách nhanh")).toBeTruthy();
    expect(
      getByText(
        "Tìm và lọc sách theo môn, trạng thái, trường, phạm vi giá,... Hỗ trợ nhanh lẹ trong việc tìm kiếm có kết quả ngay."
      )
    ).toBeTruthy();
  });

  test("bỏ qua sẽ lưu cờ onboarding và điều hướng", async () => {
    const { getByText } = renderOnboarding();

    fireEvent.press(getByText("Bỏ qua"));

    await waitFor(() => {
      expect(mockStoreData).toHaveBeenCalledWith("onboarded", "1");
    });
    expect(mockRouterReplace).toHaveBeenCalledWith("/auth/login");
  });

  test("chuyển sang slide kế tiếp không ghi vào async storage", () => {
    const api = renderOnboarding();
    const { getByText } = api;

    fireEvent.press(getByText("Tiếp tục"));
    expect(mockStoreData).not.toHaveBeenCalled();

    updateVisibleSlide(api, 1);
    expect(getByText("Đăng bán trong 1 phút")).toBeTruthy();
  });

  test("hoàn tất slide cuối sẽ lưu cờ onboarding và điều hướng", async () => {
    const api = renderOnboarding();
    const { getByText } = api;

    updateVisibleSlide(api, 2);

    const doneButton = getByText("Bắt đầu");
    fireEvent.press(doneButton);

    await waitFor(() => {
      expect(mockStoreData).toHaveBeenCalledWith("onboarded", "1");
    });
    expect(mockRouterReplace).toHaveBeenCalledWith("/auth/login");
  });

  test("nút quay lại hoạt động khi không ở slide đầu tiên", () => {
    const api = renderOnboarding();
    const { getByText } = api;

    updateVisibleSlide(api, 1);
    expect(getByText("Quay lại")).toBeTruthy();

    fireEvent.press(getByText("Quay lại"));

    expect(getByText("Tiếp tục")).toBeTruthy();
  });

  test("nút Sentry test hiển thị và gửi message + throw error khi ấn", () => {
    const { getByText } = renderOnboarding();

    const crashButton = getByText("CRASH ĐỂ NỘP BÀI 10/10");

    expect(() => {
      fireEvent.press(crashButton);
    }).toThrow();

    expect(mockCaptureMessage).toHaveBeenCalledWith(
      "Test từ Onboarding – Nhóm 4 đã hoàn thành 100%"
    );
  });
});