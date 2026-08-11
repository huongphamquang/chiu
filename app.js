/* ================================================================
 *  CHƯƠNG TRÌNH SÁNG CỦA BÉ  —  logic điều khiển
 * ================================================================
 *  - Chọn chương trình theo ngày trong tuần (có thể đổi ngày khác).
 *  - Bấm 1 nút -> tự phát nối tiếp hết danh sách rồi dừng.
 *  - Video nào lỗi / không cho nhúng -> tự động bỏ qua sang bài kế.
 *  - Giữ màn hình sáng khi đang phát (hữu ích lúc để điện thoại trên xe).
 * ================================================================ */

(function () {
  "use strict";

  // ---- Trạng thái ----
  var selectedDay = new Date().getDay();   // 0..6
  var queue = [];                          // danh sách video của ngày đang chọn
  var current = 0;                         // vị trí bài đang phát
  var player = null;                       // đối tượng YT.Player
  var apiReady = false;                    // API YouTube đã sẵn sàng chưa
  var pendingStart = false;                // người dùng bấm phát khi API chưa sẵn sàng
  var wakeLock = null;                     // giữ màn hình sáng

  // ---- Lấy phần tử ----
  function $(id) { return document.getElementById(id); }

  var screens = {
    home: $("home"),
    playing: $("playing"),
    done: $("done")
  };

  // ================= API YouTube =================
  // Hàm này được thư viện iframe_api tự gọi khi tải xong.
  window.onYouTubeIframeAPIReady = function () {
    apiReady = true;
    if (pendingStart) {
      pendingStart = false;
      createPlayer();
    }
  };

  // ================= Điều hướng màn hình =================
  function show(name) {
    Object.keys(screens).forEach(function (k) {
      screens[k].classList.toggle("hidden", k !== name);
    });
  }

  // ================= Trang chính =================
  function loadDay(day) {
    selectedDay = day;
    var prog = PROGRAMS[day];
    queue = prog.videos.slice();
    current = 0;

    $("today-emoji").textContent = prog.emoji;
    $("today-theme").textContent = prog.theme;
    $("today-day").textContent = DAY_NAMES[day] + " · " + prog.videos.length + " bài";
    $("today-desc").textContent = prog.desc;

    renderTracklist($("homeTracklist"), false);
    highlightDayButton();
  }

  function renderTracklist(ol, playing) {
    ol.innerHTML = "";
    queue.forEach(function (v, i) {
      var li = document.createElement("li");
      li.textContent = v.title;
      if (playing) {
        if (i < current) li.classList.add("played");
        if (i === current) li.classList.add("current");
      }
      ol.appendChild(li);
    });
  }

  function buildDayButtons() {
    var box = $("dayButtons");
    box.innerHTML = "";
    // Hiển thị theo thứ tự Thứ Hai -> Chủ Nhật cho dễ nhìn
    var order = [1, 2, 3, 4, 5, 6, 0];
    order.forEach(function (day) {
      var prog = PROGRAMS[day];
      var btn = document.createElement("button");
      btn.dataset.day = day;
      btn.innerHTML = prog.emoji + " " + DAY_NAMES[day] +
        "<small>" + prog.theme + "</small>";
      btn.addEventListener("click", function () {
        loadDay(day);
        // Cuộn lên đầu để thấy chương trình vừa chọn
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      box.appendChild(btn);
    });
  }

  function highlightDayButton() {
    var btns = $("dayButtons").querySelectorAll("button");
    btns.forEach(function (b) {
      b.classList.toggle("active", Number(b.dataset.day) === selectedDay);
    });
  }

  // ================= Phát nhạc =================
  function startPlaying() {
    current = 0;
    show("playing");
    requestWakeLock();
    if (!apiReady) {
      // API chưa tải xong -> đánh dấu để tạo player ngay khi sẵn sàng
      pendingStart = true;
      $("nowTitle").textContent = "Đang tải…";
      return;
    }
    createPlayer();
  }

  function createPlayer() {
    updatePlayingUI();
    if (player) {
      // Đã có player -> chỉ cần nạp bài đầu
      player.loadVideoById(queue[current].id);
      return;
    }
    player = new YT.Player("player", {
      videoId: queue[current].id,
      playerVars: {
        autoplay: 1,
        playsinline: 1,   // phát ngay trong trang trên iPhone, không mở toàn màn hình
        rel: 0,
        modestbranding: 1
      },
      events: {
        onReady: function (e) { e.target.playVideo(); },
        onStateChange: onStateChange,
        onError: onError
      }
    });
  }

  function onStateChange(e) {
    // 0 = ENDED  -> chuyển bài kế
    if (e.data === YT.PlayerState.ENDED) {
      goNext();
    }
    // 1 = PLAYING, 2 = PAUSED -> cập nhật nút tạm dừng/phát
    if (e.data === YT.PlayerState.PLAYING) {
      $("playPauseBtn").textContent = "⏸";
    }
    if (e.data === YT.PlayerState.PAUSED) {
      $("playPauseBtn").textContent = "▶";
    }
  }

  function onError() {
    // Video lỗi hoặc không cho nhúng -> bỏ qua sang bài kế
    goNext();
  }

  function goNext() {
    if (current >= queue.length - 1) {
      finish();
      return;
    }
    current++;
    player.loadVideoById(queue[current].id);
    updatePlayingUI();
  }

  function goPrev() {
    if (current <= 0) {
      player.seekTo(0);
      return;
    }
    current--;
    player.loadVideoById(queue[current].id);
    updatePlayingUI();
  }

  function togglePlayPause() {
    if (!player || !player.getPlayerState) return;
    var s = player.getPlayerState();
    if (s === YT.PlayerState.PLAYING) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }

  function updatePlayingUI() {
    $("progress").textContent = "Bài " + (current + 1) + "/" + queue.length;
    $("nowTitle").textContent = queue[current].title;
    renderTracklist($("playTracklist"), true);
  }

  function finish() {
    show("done");
    releaseWakeLock();
    if (player && player.stopVideo) player.stopVideo();
  }

  function stopAndHome() {
    if (player && player.stopVideo) player.stopVideo();
    releaseWakeLock();
    loadDay(selectedDay);
    show("home");
  }

  // ================= Giữ màn hình sáng =================
  function requestWakeLock() {
    if (!("wakeLock" in navigator)) return;
    navigator.wakeLock.request("screen").then(function (lock) {
      wakeLock = lock;
    }).catch(function () { /* bỏ qua nếu trình duyệt không cho */ });
  }
  function releaseWakeLock() {
    if (wakeLock) { wakeLock.release().catch(function () {}); wakeLock = null; }
  }
  // Khi quay lại tab mà đang phát thì xin lại wake lock
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" &&
        !screens.playing.classList.contains("hidden")) {
      requestWakeLock();
    }
  });

  // ================= Gắn sự kiện =================
  $("startBtn").addEventListener("click", startPlaying);
  $("replayBtn").addEventListener("click", startPlaying);
  $("homeBtn").addEventListener("click", stopAndHome);
  $("stopBtn").addEventListener("click", stopAndHome);
  $("nextBtn").addEventListener("click", goNext);
  $("prevBtn").addEventListener("click", goPrev);
  $("playPauseBtn").addEventListener("click", togglePlayPause);

  // ================= Khởi động =================
  buildDayButtons();
  loadDay(selectedDay);
})();
