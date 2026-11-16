# Nhã nhạc cung đình Huế

Slideshow dọc giới thiệu nhã nhạc cung đình Huế — di sản phi vật thể đại diện của nhân loại, UNESCO 2003.
Mỗi ảnh chiếm trọn màn hình, chữ song ngữ Việt – Anh, hiệu ứng zoom/parallax nhẹ, có nút tự chuyển slide và nhạc nền lặp.

## Chạy

Mở trực tiếp `index.html`, hoặc chạy server tĩnh kèm sẵn:

```bash
node serve-local.js            # http://127.0.0.1:3001
node serve-local.js <thư-mục>  # phục vụ thư mục khác
```

## Cấu trúc

| Đường dẫn | Nội dung |
| --- | --- |
| `index.html` | 16 slide, mỗi slide là một `<section class="slide">` |
| `styles.css` | bố cục, lớp tối trên ảnh, hiệu ứng chữ |
| `main.js` | parallax khi cuộn, tự chuyển slide (7 giây), nhạc nền fade in/out |
| `assets/img/p01…p16.jpg` | ảnh từng slide (bản upscale 4x) |
| `serve-local.js` | server tĩnh Node, không phụ thuộc package nào |

## Nhạc nền

Nhạc nền nằm ở `assets/audio/nha-nhac.mp3` (phát lặp, fade in/out khi bật/tắt). Muốn đổi bản khác thì ghi đè file cùng tên; nếu xoá file, nút loa vẫn hiện nhưng mờ và không phát gì. Trình duyệt chỉ cho phát sau khi người xem bấm nút — đây là quy định autoplay của trình duyệt, không phải lỗi trang.

## Ghi chú

- Font dùng Google Fonts (Cormorant Garamond, Be Vietnam Pro), có font dự phòng của hệ thống nên vẫn đọc được khi offline.
- Nút góc dưới trái: tự chuyển slide; nút góc trên phải: bật/tắt nhạc.
- Tôn trọng `prefers-reduced-motion` (tắt hiệu ứng chuyển động và fade).
