---
trigger: manual
description: "Project rule: Ngăn agent chạy `npm run build` tự động trên máy phát triển vì có thể gây lag/giật VS Code"
---

Mục đích
- Ngăn agent thực hiện `npm run build` tự động trong workspace cục bộ để tránh gây lag, giật hoặc tải CPU/RAM quá mức trên máy phát triển.

Quy tắc
- Tuyệt đối KHÔNG chạy `npm run build` tự động trong workspace này nếu không có phép rõ ràng từ người dùng.
- Khi cần build, agent phải hỏi người dùng trước. Gợi mẫu câu hỏi: "`npm run build` có thể gây lag VS Code; bạn có muốn tôi chạy build bây giờ không? (yes/no)".
- Nếu người dùng cho phép, agent phải: (1) thông báo rõ ràng về rủi ro hiệu năng, (2) tuân thủ yêu cầu chạy build trong một terminal do người dùng mở hoặc chạy trên CI/remote, chứ không tự động khởi tạo quy trình nền trong VS Code.

Ngoại lệ
- Chỉ khi người dùng **rõ ràng** yêu cầu agent chạy `npm run build` (ví dụ: "Hãy chạy build bây giờ"), agent mới chạy. Trước khi chạy, agent phải lặp lại: "Bạn xác nhận chạy `npm run build` cục bộ chứ? Tôi có thể gây lag VS Code." và chờ xác nhận.
- Khuyến nghị: ưu tiên chạy build trên môi trường CI, runner từ xa, hoặc trong container thay vì trên máy dev cục bộ.

Gợi ý thay thế (khi có thể)
- Dùng `npm run dev` hoặc dev-server tương đương để kiểm tra thay vì build full.
- Chạy kiểm tra nhanh, lint hoặc unit tests thay vì build.
- Nếu cần kiểm tra output production tĩnh, đề nghị chạy build trên CI và trả kết quả/artefact cho người dùng.

Ví dụ phản hồi agent (mẫu)
- Khi nhận lệnh có thể khởi build: "Tôi sẽ không chạy `npm run build` tự động vì có thể gây lag VS Code. Bạn có muốn tôi chạy build bây giờ không?"
- Khi user đồng ý: "Đã nhận — chuẩn bị chạy `npm run build` theo yêu cầu. Xác nhận lần cuối: bạn cho phép chạy build cục bộ không?"

Lưu ý triển khai
- File này là một chỉ dẫn hành vi (instruction) — agent phải tôn trọng như một luật nội bộ cho workspace.
- Nếu muốn mở rộng: có thể thêm hook ngăn agent gọi bộ lệnh build ở PreToolUse, hoặc tạo prompt riêng để yêu cầu build có xác nhận người dùng.

Nếu bạn muốn, tôi sẽ: (1) điều chỉnh phạm vi `applyTo` để chỉ áp dụng cho file front-end cụ thể; (2) thêm mẫu câu xác nhận bằng tiếng Anh; (3) chuyển thành hook ngăn thực thi `npm run build` tự động. Bạn chọn gì?