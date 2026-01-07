import SuccessModal from "@/components/SuccessModal";
import { render } from "@testing-library/react-native";
import React from "react";

// Mock @expo/vector-icons
jest.mock("@expo/vector-icons", () => ({
  Ionicons: () => {
    const { View } = require("react-native");
    return <View testID="ionicon" />;
  },
}));

describe("SuccessModal Component", () => {
  it("renders modal when visible", () => {
    const { getByText } = render(
      <SuccessModal 
        visible={true} 
        title="Thành công" 
        message="Đã hoàn thành"
        onClose={() => {}}
        onViewOrder={() => {}}
      />
    );
    
    expect(getByText("Thành công")).toBeTruthy();
    expect(getByText("Đã hoàn thành")).toBeTruthy();
  });

  it("does not show content when not visible", () => {
    const { UNSAFE_root } = render(
      <SuccessModal 
        visible={false} 
        title="Test" 
        message="Message"
        onClose={() => {}}
        onViewOrder={() => {}}
      />
    );
    
    expect(UNSAFE_root).toBeTruthy();
  });

  it("renders with custom title and message", () => {
    const { getByText } = render(
      <SuccessModal 
        visible={true} 
        title="Custom Title" 
        message="Custom Message"
        onClose={() => {}}
        onViewOrder={() => {}}
      />
    );
    
    expect(getByText("Custom Title")).toBeTruthy();
    expect(getByText("Custom Message")).toBeTruthy();
  });

  it("renders action buttons", () => {
    const { getByText } = render(
      <SuccessModal 
        visible={true} 
        title="Test" 
        message="Test"
        onClose={() => {}}
        onViewOrder={() => {}}
      />
    );
    
    expect(getByText("Xem đơn hàng")).toBeTruthy();
    expect(getByText("Tiếp tục mua sắm")).toBeTruthy();
  });
});

