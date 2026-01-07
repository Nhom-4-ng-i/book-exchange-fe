import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

// Mock dependencies
jest.mock("@/icons/IconEdit", () => {
  const { View } = require("react-native");
  return function MockIconEdit() {
    return <View testID="icon-edit" />;
  };
});

jest.mock("@/api", () => ({
  AuthService: {
    updatePhoneRouteApiAuthPhonePut: jest.fn().mockResolvedValue({}),
  },
}));

jest.mock("@/components/ConfirmationModal", () => {
  const { View, Pressable, Text } = require("react-native");
  return function MockConfirmationModal({ visible, onClose, onConfirm, title }: any) {
    if (!visible) return null;
    return (
      <View testID="confirmation-modal">
        <Text>{title}</Text>
        <Pressable testID="confirm-btn" onPress={onConfirm}>
          <Text>Confirm</Text>
        </Pressable>
        <Pressable testID="cancel-btn" onPress={onClose}>
          <Text>Cancel</Text>
        </Pressable>
      </View>
    );
  };
});

import { ProfileHeader } from "@/components/profile/ProfileHeader";

describe("ProfileHeader", () => {
  const mockOnLogout = jest.fn();
  const mockOnPhoneUpdated = jest.fn();
  const mockOnProfileUpdate = jest.fn();

  const defaultProps = {
    name: "Nguyễn Văn A",
    phone: "0123456789",
    onLogout: mockOnLogout,
    onPhoneUpdated: mockOnPhoneUpdated,
    onProfileUpdate: mockOnProfileUpdate,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders profile header correctly", () => {
    const { getByText } = render(<ProfileHeader {...defaultProps} />);
    expect(getByText("Nguyễn Văn A")).toBeTruthy();
    expect(getByText("0123456789")).toBeTruthy();
  });

  it("shows logout button", () => {
    const { getByText } = render(<ProfileHeader {...defaultProps} />);
    expect(getByText("Đăng xuất")).toBeTruthy();
  });

  it("shows edit button", () => {
    const { getByTestId } = render(<ProfileHeader {...defaultProps} />);
    expect(getByTestId("icon-edit")).toBeTruthy();
  });

  it("shows confirmation modal when logout is pressed", () => {
    const { getByText, getByTestId } = render(<ProfileHeader {...defaultProps} />);
    
    fireEvent.press(getByText("Đăng xuất"));
    
    expect(getByTestId("confirmation-modal")).toBeTruthy();
    expect(getByText("Xác nhận đăng xuất")).toBeTruthy();
  });

  it("calls onLogout when confirmed", () => {
    const { getByText, getByTestId } = render(<ProfileHeader {...defaultProps} />);
    
    fireEvent.press(getByText("Đăng xuất"));
    fireEvent.press(getByTestId("confirm-btn"));
    
    expect(mockOnLogout).toHaveBeenCalled();
  });

  it("closes confirmation modal when cancelled", () => {
    const { getByText, getByTestId, queryByTestId } = render(<ProfileHeader {...defaultProps} />);
    
    fireEvent.press(getByText("Đăng xuất"));
    expect(getByTestId("confirmation-modal")).toBeTruthy();
    
    fireEvent.press(getByTestId("cancel-btn"));
    
    expect(queryByTestId("confirmation-modal")).toBeNull();
  });

  it("shows default avatar when no avatarUri", () => {
    const { getByText } = render(<ProfileHeader {...defaultProps} />);
    expect(getByText("BK")).toBeTruthy();
  });

  it("renders with avatar", () => {
    const { UNSAFE_root, queryByText } = render(
      <ProfileHeader {...defaultProps} avatarUri="https://example.com/avatar.jpg" />
    );
    expect(UNSAFE_root).toBeTruthy();
    expect(queryByText("BK")).toBeNull();
  });

  it("opens phone editor when edit button is pressed", () => {
    const { getByTestId, getByText } = render(<ProfileHeader {...defaultProps} />);
    
    const editBtn = getByTestId("icon-edit").parent;
    if (editBtn) {
      fireEvent.press(editBtn);
    }
    
    expect(getByText("Cập nhật số điện thoại")).toBeTruthy();
  });

  it("shows phone input in editor", () => {
    const { getByTestId, getByPlaceholderText } = render(<ProfileHeader {...defaultProps} />);
    
    const editBtn = getByTestId("icon-edit").parent;
    if (editBtn) {
      fireEvent.press(editBtn);
    }
    
    expect(getByPlaceholderText("VD: 0907 608 170")).toBeTruthy();
  });

  it("shows save and cancel buttons in editor", () => {
    const { getByTestId, getByText } = render(<ProfileHeader {...defaultProps} />);
    
    const editBtn = getByTestId("icon-edit").parent;
    if (editBtn) {
      fireEvent.press(editBtn);
    }
    
    expect(getByText("Hủy")).toBeTruthy();
    expect(getByText("Lưu")).toBeTruthy();
  });
});

