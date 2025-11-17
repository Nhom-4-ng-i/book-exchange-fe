import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: 'https://cdf50c32e2af1aa0e5dbb90fa2525c24@o4510374047186944.ingest.de.sentry.io/4510379644354640',
  // DSN (Data Source Name): khóa bí mật để gửi dữ liệu về đúng project của nhóm bạn trên Sentry
  //   Lấy từ Settings → Projects → exchange-old-books → Client Keys (DSN)

  debug: __DEV__,
  // Chỉ bật log chi tiết khi đang chạy ở môi trường dev (expo start). Production sẽ tắt để không làm chậm app.

  environment: __DEV__ ? 'development' : 'production',
  //Đánh dấu mọi event là “development” hay “production”. 
  //   Rất quan trọng để lọc dữ liệu test vs dữ liệu thật trên dashboard.

  replaysSessionSampleRate: 0.1,
  // 10% các session của người dùng sẽ được ghi lại toàn bộ video hành động (Session Replay).
  // Dùng để xem lại người dùng làm gì trước khi crash → cực mạnh cho debug.

  replaysOnErrorSampleRate: 1.0,
  // 100% các session có lỗi sẽ được ghi lại video (rất cần thiết để tái hiện bug).

  sendDefaultPii: false,
  // Tắt việc tự động gửi thông tin cá nhân (IP, cookies, device ID…).
  // Đây là best practice GDPR mà thầy yêu cầu ở mục “Vận dụng được → Best practices trong thu thập dữ liệu”.
  // Nếu để true như docs mặc định → có nguy cơ bị trừ điểm vì vi phạm bảo mật.
});