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

Repo không kèm file nhạc. Để bật nhạc, đặt một file MP3 vào `assets/audio/nha-nhac.mp3` (đúng tên này); nút loa ở góc trên phải sẽ phát lặp kèm fade in/out. Khi chưa có file, nút vẫn hiện nhưng mờ và không phát gì.

## Ghi chú

- Font dùng Google Fonts (Cormorant Garamond, Be Vietnam Pro), có font dự phòng của hệ thống nên vẫn đọc được khi offline.
- Nút góc dưới trái: tự chuyển slide; nút góc trên phải: bật/tắt nhạc.
- Tôn trọng `prefers-reduced-motion` (tắt hiệu ứng chuyển động và fade).
