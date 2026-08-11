/*
 * DANH SÁCH CHƯƠNG TRÌNH SÁNG — CHO 3 BÉ
 * ======================================================================
 * Mỗi bé (profile) có 7 chương trình theo ngày trong tuần, mỗi chương
 * trình ~15 phút gồm nhiều video YouTube nối tiếp tự động.
 *
 * Thứ tự ngày theo JavaScript: 0 = Chủ Nhật, 1 = Thứ Hai ... 6 = Thứ Bảy.
 *
 * MUỐN THÊM / ĐỔI VIDEO?
 *   - "id" là đoạn sau  watch?v=  trong link YouTube.
 *       https://www.youtube.com/watch?v=vD98OvvDNEs  ->  id: "vD98OvvDNEs"
 *   - Thêm/bớt dòng  { id: "MÃ", title: "Tên" }  trong ngày mong muốn.
 *   - Video lỗi / không cho nhúng sẽ TỰ ĐỘNG bị bỏ qua sang bài kế.
 *
 * Nguồn video (đều là kênh thật, uy tín):
 *   Bé 3 tuổi (Tiếng Anh):  Super Simple Songs, Pinkfong, StoryBots
 *   Bé 7 tuổi (Việt–Anh):   SciShow Kids, Storyline Online, Nat Geo Kids,
 *                           THVL Cổ Tích, POKI, thí nghiệm vui
 *   Bé 12 tuổi (Việt–Anh):  TED-Ed, SciShow Space, kiến thức/kỹ năng tiếng Việt
 * ======================================================================
 */

const DAY_NAMES = [
  "Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"
];

const PROFILES = [

  /* ================= BÉ 3 TUỔI — Tiếng Anh ================= */
  {
    id: "boy3",
    name: "Bé 3 tuổi",
    emoji: "🧒",
    subtitle: "Tiếng Anh · hát & học",
    color: "#ff8c42",
    programs: {
      1: { theme: "ABC & Chữ cái", emoji: "🔤", desc: "Làm quen bảng chữ cái tiếng Anh qua bài hát vui nhộn.", videos: [
        { id: "32ysrBC6B6k", title: "Hello! — Chào buổi sáng" },
        { id: "vD98OvvDNEs", title: "The Alphabet Song — Bài hát ABC" },
        { id: "I_3mbra4dHU", title: "ABC Quack — Học chữ cùng vịt con" },
        { id: "x7q5JVdPTng", title: "The Alphabet Swing — Đu quay chữ cái" },
        { id: "yCjJyiqpAuU", title: "Twinkle Twinkle Little Star" },
        { id: "PraN5ZoSjiY", title: "Bye Bye Goodbye — Tạm biệt" }
      ]},
      2: { theme: "Số đếm", emoji: "🔢", desc: "Đếm số, làm quen với con số qua trò chơi và bài hát.", videos: [
        { id: "1Ziku4FLka4", title: "Good Morning, Mr. Rooster — Chào buổi sáng" },
        { id: "xNw1SSz18Gg", title: "How Many Fingers? — Đếm ngón tay" },
        { id: "L8CuOOabv1w", title: "Five Little Ducks — Năm chú vịt con" },
        { id: "qzVdNBQ6JJI", title: "Five Little Monkeys — Năm chú khỉ" },
        { id: "tIxk5NeiTck", title: "Let's Count To 100 — Đếm tới 100" },
        { id: "UQfvAlmr5g0", title: "See You Later, Alligator — Tạm biệt" }
      ]},
      3: { theme: "Màu sắc & Hình khối", emoji: "🎨", desc: "Nhận biết màu sắc và các hình cơ bản.", videos: [
        { id: "32ysrBC6B6k", title: "Hello! — Chào buổi sáng" },
        { id: "TJhfl5vdxp4", title: "The Shape Song #1 — Học hình khối" },
        { id: "03pyY9C2Pm8", title: "The Shape Song #2 — Ôn hình khối" },
        { id: "AlB6ZNqykXU", title: "I Like To Draw — Vẽ với màu & hình" },
        { id: "BWJA2Pbde3c", title: "Learn The Colors — Học màu (StoryBots)" },
        { id: "PraN5ZoSjiY", title: "Bye Bye Goodbye — Tạm biệt" }
      ]},
      4: { theme: "Thế giới động vật", emoji: "🐮", desc: "Nhận biết con vật và tiếng kêu của chúng.", videos: [
        { id: "1Ziku4FLka4", title: "Good Morning, Mr. Rooster — Chào buổi sáng" },
        { id: "_6HzoUcx3eo", title: "Old MacDonald Had A Farm — Nông trại vui vẻ" },
        { id: "XqZsoesa55w", title: "Baby Shark Dance — Cá mập con" },
        { id: "L8CuOOabv1w", title: "Five Little Ducks — Năm chú vịt con" },
        { id: "qzVdNBQ6JJI", title: "Five Little Monkeys — Năm chú khỉ" },
        { id: "UQfvAlmr5g0", title: "See You Later, Alligator — Tạm biệt" }
      ]},
      5: { theme: "Vận động & Cơ thể", emoji: "🕺", desc: "Vừa nghe vừa cử động, học tên các bộ phận cơ thể.", videos: [
        { id: "K53J44ioDxI", title: "Good Morning, Beautiful Day — Chào buổi sáng" },
        { id: "RuqvGiZi0qg", title: "Head Shoulders Knees & Toes — Đầu vai gối chân" },
        { id: "M6LoRZsHMSs", title: "If You're Happy — Nếu con thấy vui" },
        { id: "04KMI21kFnc", title: "If You're Happy (Spin Around) — Xoay vòng" },
        { id: "yWirdnSDsV4", title: "The Wheels On The Bus — Bánh xe buýt" },
        { id: "PraN5ZoSjiY", title: "Bye Bye Goodbye — Tạm biệt" }
      ]},
      6: { theme: "Khám phá thế giới", emoji: "🌦️", desc: "Thời tiết, các ngày trong tuần và phương tiện.", videos: [
        { id: "32ysrBC6B6k", title: "Hello! — Chào buổi sáng" },
        { id: "KBL5aXSJTlE", title: "How's The Weather? — Thời tiết hôm nay" },
        { id: "CEFL-4weVsI", title: "Sunny Day — Ngày nắng đẹp" },
        { id: "loINl3Ln6Ck", title: "Days Of The Week — Các ngày trong tuần" },
        { id: "GzrjwOQpAl0", title: "The Wheels On The Bus — Bánh xe buýt" },
        { id: "UQfvAlmr5g0", title: "See You Later, Alligator — Tạm biệt" }
      ]},
      0: { theme: "Tổng hợp yêu thích", emoji: "⭐", desc: "Những bài hát được yêu thích nhất trong tuần.", videos: [
        { id: "K53J44ioDxI", title: "Good Morning, Beautiful Day — Chào buổi sáng" },
        { id: "XqZsoesa55w", title: "Baby Shark Dance — Cá mập con" },
        { id: "vD98OvvDNEs", title: "The Alphabet Song — Bài hát ABC" },
        { id: "5oYKonYBujg", title: "Old MacDonald Had A Farm — Nông trại vui vẻ" },
        { id: "yCjJyiqpAuU", title: "Twinkle Twinkle Little Star" },
        { id: "PraN5ZoSjiY", title: "Bye Bye Goodbye — Tạm biệt" }
      ]}
    }
  },

  /* ================= BÉ 7 TUỔI — Song ngữ Việt–Anh ================= */
  {
    id: "girl7",
    name: "Bé 7 tuổi",
    emoji: "👧",
    subtitle: "Song ngữ · khoa học & kể chuyện",
    color: "#e5679e",
    programs: {
      1: { theme: "Khoa học vui", emoji: "🔬", desc: "Thí nghiệm nhỏ kích thích tò mò (Anh + Việt).", videos: [
        { id: "0Qmgdz9E47s", title: "The Power of Sunlight — Sức mạnh ánh nắng (SciShow Kids)" },
        { id: "9Ro-N0vRkm8", title: "Top 5 thí nghiệm thú vị cho bé (Tiếng Việt)" },
        { id: "wfnsRi8Jgdw", title: "Elephant Toothpaste — Thí nghiệm bọt khổng lồ (SciShow Kids)" }
      ]},
      2: { theme: "Giờ đọc sách", emoji: "📖", desc: "Nghe đọc truyện tranh, nuôi dưỡng ngôn ngữ & cảm xúc.", videos: [
        { id: "P2PvXbVvqCc", title: "The Mess That We Made — Đọc sách (Storyline Online)" },
        { id: "kqjMlnLjEKs", title: "Cậu Bé Bánh Gừng — Cổ tích (Tiếng Việt)" }
      ]},
      3: { theme: "Động vật kỳ thú", emoji: "🐾", desc: "Sự thật thú vị về các loài vật khắp thế giới.", videos: [
        { id: "XdCaBF8NJ00", title: "Polar Bear — Gấu Bắc Cực (Nat Geo Kids)" },
        { id: "8OmRW4em_vA", title: "Tiger — Hổ (Nat Geo Kids)" },
        { id: "rHhSCO5-3Pg", title: "Gorilla — Khỉ đột (Nat Geo Kids)" },
        { id: "dH4pZgnphB0", title: "Cô Gà Mái Đỏ — Cổ tích (Tiếng Việt)" }
      ]},
      4: { theme: "Cổ tích & Đọc sách", emoji: "🧚", desc: "Một truyện cổ tích Việt và một truyện tiếng Anh.", videos: [
        { id: "DPFM71NAE4w", title: "Cô Bé Lọ Lem — Cổ tích (Tiếng Việt)" },
        { id: "Os7ZORX6_gE", title: "The Rainbow Fish — Đọc sách (Tiếng Anh)" }
      ]},
      5: { theme: "Khám phá & Thí nghiệm", emoji: "🧪", desc: "Vừa xem thí nghiệm vừa nghe truyện cổ tích.", videos: [
        { id: "a-SPYPAedCA", title: "Unpoppable Bubbles — Bong bóng không vỡ (SciShow Kids)" },
        { id: "UqCQsKxq4mY", title: "Soda Fountain — Đài phun nước ngọt (SciShow Kids)" },
        { id: "6hqrRcglD60", title: "Đôi Giày Đỏ + Rapunzel — Cổ tích (Tiếng Việt)" }
      ]},
      6: { theme: "Bài học hay & Khoa học", emoji: "🌟", desc: "Bài học kỹ năng sống và một chút khoa học vui.", videos: [
        { id: "EbC1LzuLCu8", title: "POKI — Bài học về chịu trách nhiệm (Tiếng Việt)" },
        { id: "hHQpiCrZSIc", title: "The Science of Balloons — Khoa học về bóng bay (SciShow Kids)" }
      ]},
      0: { theme: "Tổng hợp yêu thích", emoji: "⭐", desc: "Truyện hay và kiến thức được yêu thích.", videos: [
        { id: "NHJAVkwPKIo", title: "Velma Gratch & the Butterfly — Đọc sách (Storyline Online)" },
        { id: "DPFM71NAE4w", title: "Cô Bé Lọ Lem — Cổ tích (Tiếng Việt)" }
      ]}
    }
  },

  /* ================= BÉ 12 TUỔI — Song ngữ Việt–Anh ================= */
  {
    id: "girl12",
    name: "Bé 12 tuổi",
    emoji: "👩",
    subtitle: "Song ngữ · tư duy & kiến thức",
    color: "#4d8bf0",
    programs: {
      1: { theme: "Câu đố tư duy", emoji: "🧩", desc: "Giải đố logic của TED-Ed + tư duy tích cực.", videos: [
        { id: "7yDmGnA8Hw0", title: "The Bridge Riddle — Câu đố qua cầu (TED-Ed)" },
        { id: "ADR7dUoVh_c", title: "The River Crossing Riddle — Câu đố qua sông (TED-Ed)" },
        { id: "Ivkk3mQM_E8", title: "Suy Nghĩ Tích Cực Mỗi Ngày — Kỹ năng sống (Tiếng Việt)" }
      ]},
      2: { theme: "Vũ trụ & Thiên văn", emoji: "🚀", desc: "Khám phá hệ Mặt Trời và lịch sử vũ trụ.", videos: [
        { id: "r9divlhYjr0", title: "The Solar System Explained — Hệ Mặt Trời (SciShow)" },
        { id: "mEEJNG4uAPM", title: "Hiểu Toàn Bộ Lịch Sử Vũ Trụ Trong 8 Phút (Tiếng Việt)" }
      ]},
      3: { theme: "Cơ thể & Khoa học", emoji: "🧠", desc: "Cơ thể người hoạt động thế nào + khởi nguồn vũ trụ.", videos: [
        { id: "Og5xAdC8EUI", title: "How Your Digestive System Works — Hệ tiêu hóa (TED-Ed)" },
        { id: "OxPlCkTKhzY", title: "The Science of Skin — Khoa học về làn da (TED-Ed)" },
        { id: "ohwHJ2KRuwQ", title: "Sự Thật Thú Vị Về Vụ Nổ Big Bang (Tiếng Việt)" }
      ]},
      4: { theme: "Câu đố hại não", emoji: "🕵️", desc: "Thử thách logic khó hơn của TED-Ed.", videos: [
        { id: "LKvjIsyYng8", title: "The Three Gods Riddle — Câu đố ba vị thần (TED-Ed)" },
        { id: "7Vd1dTBVbFg", title: "The Passcode Riddle — Câu đố mật mã (TED-Ed)" },
        { id: "aXzomRzI_BU", title: "100+ Sự Thật Về Vũ Trụ (Tiếng Việt)" }
      ]},
      5: { theme: "Tiến hóa & Con người", emoji: "🌍", desc: "Bí ẩn tiến hóa và góc nhìn về lịch sử loài người.", videos: [
        { id: "lz0lQ58QMzQ", title: "Evolution's Great Mystery — Bí ẩn tiến hóa (TED-Ed)" },
        { id: "bFIVYRfyb3E", title: "If You Experienced Every Human Life In History (TED-Ed)" },
        { id: "yu3etZ_GtrQ", title: "Vũ Trụ Mang Sự Sống Đến Trái Đất (Tiếng Việt)" }
      ]},
      6: { theme: "Bí ẩn vũ trụ", emoji: "🕳️", desc: "Hố đen, Big Bang và những khoảng không kỳ lạ.", videos: [
        { id: "0BYftKyWFcc", title: "Planet 9 Could Be a Black Hole?! — Hố đen (SciShow)" },
        { id: "SEDabz-hyKo", title: "The Big Bang Riddle — Câu đố Big Bang (TED-Ed)" },
        { id: "yMMIoiORyzM", title: "Khoảng Trống Rỗng 2 Tỷ Năm Ánh Sáng (Tiếng Việt)" }
      ]},
      0: { theme: "Tổng hợp yêu thích", emoji: "⭐", desc: "Những câu đố và kiến thức hay nhất.", videos: [
        { id: "9uZ-jeZS8d0", title: "The Jail Break Riddle — Câu đố vượt ngục (TED-Ed)" },
        { id: "ukUPojrPFPA", title: "The Time Travel Riddle — Câu đố du hành thời gian (TED-Ed)" },
        { id: "mEEJNG4uAPM", title: "Hiểu Toàn Bộ Lịch Sử Vũ Trụ Trong 8 Phút (Tiếng Việt)" }
      ]}
    }
  }

];
