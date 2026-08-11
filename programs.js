/*
 * DANH SÁCH CHƯƠNG TRÌNH SÁNG CHO BÉ (7 NGÀY TRONG TUẦN)
 * ------------------------------------------------------
 * Mỗi ngày là 1 "chương trình" ~15 phút gồm nhiều video YouTube nối tiếp.
 * Tất cả link đều là video THẬT từ các kênh giáo dục tiếng Anh cho bé:
 *   - Super Simple Songs  (bài hát, học chữ/số/màu, vận động)
 *   - Pinkfong / StoryBots (bổ sung)
 *
 * MUỐN THÊM / ĐỔI VIDEO?  Rất dễ:
 *   - "id" chính là đoạn phía sau  watch?v=  trong link YouTube.
 *     Ví dụ  https://www.youtube.com/watch?v=vD98OvvDNEs  ->  id: "vD98OvvDNEs"
 *   - Thêm một dòng  { id: "MÃ_VIDEO", title: "Tên bài" }  vào ngày bạn muốn.
 *   - Video nào lỗi/không cho nhúng, trình phát sẽ TỰ ĐỘNG bỏ qua sang bài kế.
 *
 * Thứ tự trong tuần theo JavaScript: 0 = Chủ Nhật, 1 = Thứ Hai, ... 6 = Thứ Bảy.
 */

const PROGRAMS = {
  1: {
    theme: "ABC & Chữ cái",
    emoji: "🔤",
    desc: "Làm quen bảng chữ cái tiếng Anh qua bài hát vui nhộn.",
    videos: [
      { id: "32ysrBC6B6k", title: "Hello! — Chào buổi sáng" },
      { id: "vD98OvvDNEs", title: "The Alphabet Song — Bài hát ABC" },
      { id: "I_3mbra4dHU", title: "ABC Quack — Học chữ cùng vịt con" },
      { id: "x7q5JVdPTng", title: "The Alphabet Swing — Đu quay chữ cái" },
      { id: "yCjJyiqpAuU", title: "Twinkle Twinkle Little Star" },
      { id: "PraN5ZoSjiY", title: "Bye Bye Goodbye — Tạm biệt" }
    ]
  },

  2: {
    theme: "Số đếm",
    emoji: "🔢",
    desc: "Đếm số, làm quen với con số qua trò chơi và bài hát.",
    videos: [
      { id: "1Ziku4FLka4", title: "Good Morning, Mr. Rooster — Chào buổi sáng" },
      { id: "xNw1SSz18Gg", title: "How Many Fingers? — Đếm ngón tay" },
      { id: "L8CuOOabv1w", title: "Five Little Ducks — Năm chú vịt con" },
      { id: "qzVdNBQ6JJI", title: "Five Little Monkeys — Năm chú khỉ" },
      { id: "tIxk5NeiTck", title: "Let's Count To 100 — Đếm tới 100" },
      { id: "UQfvAlmr5g0", title: "See You Later, Alligator — Tạm biệt" }
    ]
  },

  3: {
    theme: "Màu sắc & Hình khối",
    emoji: "🎨",
    desc: "Nhận biết màu sắc và các hình cơ bản (tròn, vuông, tam giác...).",
    videos: [
      { id: "32ysrBC6B6k", title: "Hello! — Chào buổi sáng" },
      { id: "TJhfl5vdxp4", title: "The Shape Song #1 — Học hình khối" },
      { id: "03pyY9C2Pm8", title: "The Shape Song #2 — Ôn hình khối" },
      { id: "AlB6ZNqykXU", title: "I Like To Draw — Vẽ với màu & hình" },
      { id: "BWJA2Pbde3c", title: "Learn The Colors — Học màu (StoryBots)" },
      { id: "PraN5ZoSjiY", title: "Bye Bye Goodbye — Tạm biệt" }
    ]
  },

  4: {
    theme: "Thế giới động vật",
    emoji: "🐮",
    desc: "Nhận biết con vật và tiếng kêu của chúng.",
    videos: [
      { id: "1Ziku4FLka4", title: "Good Morning, Mr. Rooster — Chào buổi sáng" },
      { id: "_6HzoUcx3eo", title: "Old MacDonald Had A Farm — Nông trại vui vẻ" },
      { id: "XqZsoesa55w", title: "Baby Shark Dance — Cá mập con" },
      { id: "L8CuOOabv1w", title: "Five Little Ducks — Năm chú vịt con" },
      { id: "qzVdNBQ6JJI", title: "Five Little Monkeys — Năm chú khỉ" },
      { id: "UQfvAlmr5g0", title: "See You Later, Alligator — Tạm biệt" }
    ]
  },

  5: {
    theme: "Vận động & Cơ thể",
    emoji: "🕺",
    desc: "Vừa nghe vừa cử động, học tên các bộ phận cơ thể.",
    videos: [
      { id: "K53J44ioDxI", title: "Good Morning, Beautiful Day — Chào buổi sáng" },
      { id: "RuqvGiZi0qg", title: "Head Shoulders Knees & Toes — Đầu vai gối chân" },
      { id: "M6LoRZsHMSs", title: "If You're Happy — Nếu con thấy vui" },
      { id: "04KMI21kFnc", title: "If You're Happy (Spin Around) — Xoay vòng" },
      { id: "yWirdnSDsV4", title: "The Wheels On The Bus — Bánh xe buýt" },
      { id: "PraN5ZoSjiY", title: "Bye Bye Goodbye — Tạm biệt" }
    ]
  },

  6: {
    theme: "Khám phá thế giới",
    emoji: "🌦️",
    desc: "Thời tiết, các ngày trong tuần và phương tiện giao thông.",
    videos: [
      { id: "32ysrBC6B6k", title: "Hello! — Chào buổi sáng" },
      { id: "KBL5aXSJTlE", title: "How's The Weather? — Thời tiết hôm nay" },
      { id: "CEFL-4weVsI", title: "Sunny Day — Ngày nắng đẹp" },
      { id: "loINl3Ln6Ck", title: "Days Of The Week — Các ngày trong tuần" },
      { id: "GzrjwOQpAl0", title: "The Wheels On The Bus — Bánh xe buýt" },
      { id: "UQfvAlmr5g0", title: "See You Later, Alligator — Tạm biệt" }
    ]
  },

  0: {
    theme: "Tổng hợp yêu thích",
    emoji: "⭐",
    desc: "Những bài hát được yêu thích nhất trong tuần.",
    videos: [
      { id: "K53J44ioDxI", title: "Good Morning, Beautiful Day — Chào buổi sáng" },
      { id: "XqZsoesa55w", title: "Baby Shark Dance — Cá mập con" },
      { id: "vD98OvvDNEs", title: "The Alphabet Song — Bài hát ABC" },
      { id: "5oYKonYBujg", title: "Old MacDonald Had A Farm — Nông trại vui vẻ" },
      { id: "yCjJyiqpAuU", title: "Twinkle Twinkle Little Star" },
      { id: "PraN5ZoSjiY", title: "Bye Bye Goodbye — Tạm biệt" }
    ]
  }
};

// Tên hiển thị các ngày trong tuần (theo chỉ số 0..6 của JavaScript)
const DAY_NAMES = [
  "Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"
];
