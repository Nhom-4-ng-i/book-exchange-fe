import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

// Mock icons
jest.mock("@/icons/IconArrowDown", () => {
  const { View } = require("react-native");
  return function MockIconArrowDown() {
    return <View testID="icon-arrow-down" />;
  };
});

jest.mock("@/icons/IconEdit2", () => {
  const { View } = require("react-native");
  return function MockIconEdit2() {
    return <View testID="icon-edit" />;
  };
});

jest.mock("@/icons/IconTrash", () => {
  const { View } = require("react-native");
  return function MockIconTrash() {
    return <View testID="icon-trash" />;
  };
});

jest.mock("expo-image", () => ({
  Image: ({ source, style }: any) => {
    const { View } = require("react-native");
    return <View testID="mock-expo-image" style={style} />;
  },
}));

// Import components after mocks
import { InfoBanner } from "@/components/profile/InfoBanner";
import { ProfileActionCard } from "@/components/profile/ProfileActionCard";
import { ProfileStat } from "@/components/profile/ProfileStat";
import { WishlistCard } from "@/components/profile/WishlistCard";

describe("ProfileComponents", () => {
  describe("InfoBanner", () => {
    it("renders info banner correctly", () => {
      const { getByText } = render(
        <InfoBanner
          message="Test message here"
        />
      );
      expect(getByText("Test message here")).toBeTruthy();
    });

    it("renders info banner with different content", () => {
      const { getByText } = render(
        <InfoBanner
          message="Vui lòng cập nhật số điện thoại"
        />
      );
      expect(getByText("Vui lòng cập nhật số điện thoại")).toBeTruthy();
    });
  });

  describe("ProfileStat", () => {
    it("renders profile stat correctly", () => {
      const { getByText } = render(
        <ProfileStat
          value={42}
          label="Bài đăng"
        />
      );
      expect(getByText("42")).toBeTruthy();
      expect(getByText("Bài đăng")).toBeTruthy();
    });

    it("renders with zero count", () => {
      const { getByText } = render(
        <ProfileStat
          value={0}
          label="Yêu thích"
        />
      );
      expect(getByText("0")).toBeTruthy();
    });

    it("renders with large count", () => {
      const { getByText } = render(
        <ProfileStat
          value={9999}
          label="Đơn hàng"
        />
      );
      expect(getByText("9999")).toBeTruthy();
    });
  });

  describe("ProfileActionCard", () => {
    const mockOnPress = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("renders action card correctly", () => {
      const { getByText } = render(
        <ProfileActionCard
          label="Quản lý người mua"
          onPress={mockOnPress}
          icon={<></>}
        />
      );
      expect(getByText("Quản lý người mua")).toBeTruthy();
    });

    it("calls onPress when pressed", () => {
      const { getByText } = render(
        <ProfileActionCard
          label="Test Action"
          onPress={mockOnPress}
          icon={<></>}
        />
      );
      
      fireEvent.press(getByText("Test Action"));
      expect(mockOnPress).toHaveBeenCalled();
    });

    it("renders with different labels", () => {
      const { getByText } = render(
        <ProfileActionCard
          label="Danh sách yêu thích"
          onPress={mockOnPress}
          icon={<></>}
        />
      );
      expect(getByText("Danh sách yêu thích")).toBeTruthy();
    });
  });

  describe("WishlistCard", () => {
    const mockOnDelete = jest.fn();
    const mockOnEdit = jest.fn();

    const defaultProps = {
      title: "Sách Toán",
      subject: "Toán cao cấp",
      price: "150.000đ",
      createdAt: "01/01/2024",
      onDelete: mockOnDelete,
      onEdit: mockOnEdit,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("renders wishlist card correctly", () => {
      const { getByText } = render(<WishlistCard {...defaultProps} />);
      expect(getByText("Sách Toán")).toBeTruthy();
      expect(getByText("Toán cao cấp")).toBeTruthy();
      expect(getByText("150.000đ")).toBeTruthy();
    });

    it("shows created at date", () => {
      const { getByText } = render(<WishlistCard {...defaultProps} />);
      expect(getByText(/Tạo lúc:/)).toBeTruthy();
    });

    it("calls onEdit when edit button is pressed", () => {
      const { getByTestId } = render(<WishlistCard {...defaultProps} />);
      
      const editBtn = getByTestId("icon-edit").parent;
      if (editBtn) {
        fireEvent.press(editBtn);
      }
      expect(mockOnEdit).toHaveBeenCalled();
    });

    it("calls onDelete when delete button is pressed", () => {
      const { getByTestId } = render(<WishlistCard {...defaultProps} />);
      
      const deleteBtn = getByTestId("icon-trash").parent;
      if (deleteBtn) {
        fireEvent.press(deleteBtn);
      }
      expect(mockOnDelete).toHaveBeenCalled();
    });

    it("renders notification message", () => {
      const { getByText } = render(<WishlistCard {...defaultProps} />);
      expect(getByText(/Bạn sẽ nhận thông báo khi có sách khớp/)).toBeTruthy();
    });

    it("renders structure correctly", () => {
      const { UNSAFE_root } = render(<WishlistCard {...defaultProps} />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
