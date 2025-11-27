# 📚 Exchange Old Books - Frontend

## 🌐 Giới thiệu

Đây là mã nguồn **frontend** cho ứng dụng di động **Exchange Old Books**, được xây dựng bằng **React Native + Expo**.
Ứng dụng giúp người dùng **đăng bán, tìm kiếm và trao đổi sách/tài liệu cũ**, mang lại trải nghiệm tiện lợi và dễ sử dụng.

---

## ✨ Tính năng chính

* 📖 Đăng bán và quản lý sách cũ
* 🔍 Tìm kiếm, lọc và xem chi tiết sách
* 👤 Quản lý tài khoản cá nhân
* 🔗 Tích hợp API từ backend

---

## 🚀 Cách chạy dự án

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Chạy ứng dụng

```bash
npx expo start
```

Sau khi chạy, bạn có thể lựa chọn:

* 📱 **Expo Go** (trên Android/iOS)
* 📱 **Android Emulator** (Android Studio)
* 🍏 **iOS Simulator** (Xcode)
* 🛠️ **Development Build**

---

## 📂 Cấu trúc thư mục

* `app/` → chứa source code chính theo [file-based routing](https://docs.expo.dev/router/introduction/)
* `components/` → các component UI tái sử dụng
* `services/` → gọi API backend
* `icons/` → các icon sử dụng trong ứng dụng
* `features/` → các tính năng của ứng dụng
* `assets/` → các tài nguyên như ảnh, video, font

---
## 🔍 Hướng dẫn lấy icon
- Vào Figma copy dưới dạng svg
- paste phần nội dung copy vào [link](https://react-svgr.com/playground)
- Copy code 
- Tạo file icon trong thư mục icons rồi paste phần trong () của JSX output vào như mẫu "IconExport.tsx"
- Nhớ chuyển <sgv> thành <Svg> và <path> thành <Path>

## 🛠️ Lệnh hữu ích

Reset về dự án trống để phát triển từ đầu:

```bash
npm run reset-project
```

Chạy các test trong folder __tests__/

```bash
npm run test
```

---

## 📚 Tài liệu tham khảo

* [Expo Documentation](https://docs.expo.dev/)
* [Learn Expo Tutorial](https://docs.expo.dev/tutorial/introduction/)
* [React Native Docs](https://reactnative.dev/)

---

## 🤝 Cộng đồng

* [Expo GitHub](https://github.com/expo/expo)
* [Expo Discord](https://chat.expo.dev)

---

## 👋 Welcome

Chỉnh sửa file trong thư mục **app/** để bắt đầu phát triển.
Mỗi thay đổi sẽ được cập nhật trực tiếp khi ứng dụng đang chạy 🚀

---

[![React Native CI - Test, Report & SonarCloud](https://github.com/Nhom-4-ng-i/book-exchange-fe/actions/workflows/ci.yml/badge.svg)](https://github.com/Nhom-4-ng-i/book-exchange-fe/actions/workflows/ci.yml)

[![SonarQube Cloud](https://sonarcloud.io/images/project_badges/sonarcloud-light.svg)](https://sonarcloud.io/summary/new_code?id=Nhom-4-ng-i_book-exchange-fe)