# 🌞 Chương Trình Sáng Của Bé

Một website nhỏ để mỗi sáng đưa bé đi học, anh chỉ cần **mở web → bấm 1 nút** là bé
được nghe một "chương trình" tiếng Anh ~15 phút (bài hát + học chữ/số/màu + vận động),
tự phát hết rồi dừng.

- **Mỗi ngày trong tuần một chủ đề** (tự đổi theo ngày, không cần chọn):
  - Thứ Hai — 🔤 ABC & Chữ cái
  - Thứ Ba — 🔢 Số đếm
  - Thứ Tư — 🎨 Màu sắc & Hình khối
  - Thứ Năm — 🐮 Thế giới động vật
  - Thứ Sáu — 🕺 Vận động & Cơ thể
  - Thứ Bảy — 🌦️ Khám phá thế giới
  - Chủ Nhật — ⭐ Tổng hợp yêu thích
- Nguồn video: kênh giáo dục uy tín cho bé — **Super Simple Songs**, Pinkfong, StoryBots.
- Video nào lỗi/không cho nhúng sẽ **tự động bỏ qua** sang bài kế.
- Đang phát thì **giữ màn hình sáng** (tiện để điện thoại trên xe).

> ⚠️ Cần có **mạng internet** trên xe (phát trực tiếp từ YouTube).

---

## Cách dùng nhanh nhất (khuyên dùng)

Đưa website lên một dịch vụ host miễn phí để có 1 đường link, rồi lưu vào màn hình
chính điện thoại như một app:

### Cách 1 — Netlify (kéo–thả, không cần tài khoản kỹ thuật)
1. Vào **https://app.netlify.com/drop**
2. Kéo **cả thư mục `kid`** này thả vào ô trên trang.
3. Netlify cho anh một đường link dạng `https://ten-ngau-nhien.netlify.app`.
4. Mở link đó trên điện thoại → menu trình duyệt → **"Thêm vào màn hình chính"**.
   Từ đó mỗi sáng chỉ cần chạm icon là vào ngay.

### Cách 2 — GitHub Pages
1. Tạo repo mới, tải toàn bộ file trong thư mục này lên.
2. Settings → Pages → chọn nhánh `main`, thư mục `/root` → Save.
3. Vài phút sau có link `https://<tài-khoản>.github.io/<repo>/`.

> Nên dùng link **https** để tính năng "giữ màn hình sáng" và "thêm vào màn hình chính"
> hoạt động đầy đủ.

---

## Chạy thử trên máy tính
Trong thư mục này, mở terminal và gõ:

```bash
python -m http.server 8123
```

Rồi mở trình duyệt vào `http://localhost:8123`.

---

## Muốn thêm / đổi / bớt video?

Mở file **`programs.js`** — mọi thứ nằm ở đó, có ghi chú tiếng Việt.

- Mỗi ngày là một danh sách các dòng:
  ```js
  { id: "vD98OvvDNEs", title: "The Alphabet Song — Bài hát ABC" },
  ```
- **`id`** chính là đoạn sau `watch?v=` trong link YouTube.
  Ví dụ link `https://www.youtube.com/watch?v=vD98OvvDNEs` → `id: "vD98OvvDNEs"`.
- **`title`** là tên hiển thị (anh muốn ghi sao cũng được).
- Thêm bài: chèn thêm một dòng. Bớt bài: xoá dòng đó.
- Muốn ngày nào dài/ngắn hơn thì thêm/bớt số bài (mỗi bài ~2–3 phút).

Lưu file, tải lại trang là xong. Nếu đang host trên Netlify/GitHub thì cập nhật lại
file `programs.js` trên đó.

---

## Các file trong thư mục
| File | Vai trò |
|------|---------|
| `index.html` | Trang chính |
| `styles.css` | Giao diện, màu sắc |
| `app.js` | Điều khiển phát nhạc, chuyển bài, giữ màn hình sáng |
| `programs.js` | **Danh sách video từng ngày — sửa ở đây** |
| `manifest.json`, `icon.svg` | Cho phép "thêm vào màn hình chính" như app |

---

## Vài lưu ý cho bé 3 tuổi
- 15 phút là vừa đủ; nên ưu tiên **nghe** hơn nhìn khi đang trên xe.
- Nội dung hiện tại là **tiếng Anh**. Muốn chuyển tiếng Việt, chỉ cần thay các `id`
  bằng video tiếng Việt yêu thích trong `programs.js`.
- Các kênh gợi ý để tìm thêm: *Super Simple Songs, Pinkfong, StoryBots, Cocomelon,
  Little Baby Bum*.
