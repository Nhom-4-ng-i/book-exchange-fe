import ConfirmationModal from '@/components/ConfirmationModal';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

/* MOCK IONICONS */
jest.mock('@expo/vector-icons', () => {
  return {
    Ionicons: 'Ionicons',
  };
});

describe('ConfirmationModal', () => {
  test('Hiển thị tiêu đề, nội dung và nút xác nhận/huỷ', () => {
    const { getByText } = render(
      <ConfirmationModal
        visible
        title="Xác nhận xoá"
        message="Bạn có chắc muốn xoá?"
        onClose={() => {}}
        onConfirm={() => {}}
      />
    );

    expect(getByText('Xác nhận xoá')).toBeTruthy();
    expect(getByText('Bạn có chắc muốn xoá?')).toBeTruthy();
    expect(getByText('Hủy')).toBeTruthy();
    expect(getByText('Xác nhận')).toBeTruthy();
  });

  test('Nhấn huỷ gọi onClose, nhấn xác nhận gọi onConfirm', () => {
    const onClose = jest.fn();
    const onConfirm = jest.fn();

    const { getByText } = render(
      <ConfirmationModal
        visible
        title="Thông báo"
        message="Bạn chắc chứ?"
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    fireEvent.press(getByText('Hủy'));
    expect(onClose).toHaveBeenCalled();

    fireEvent.press(getByText('Xác nhận'));
    expect(onConfirm).toHaveBeenCalled();
  });
});
