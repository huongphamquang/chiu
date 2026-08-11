/* ================================================================
 *  CHƯƠNG TRÌNH SÁNG CỦA BÉ  —  logic điều khiển (3 bé)
 * ================================================================
 *  - Chọn bé -> xem chương trình theo ngày -> bấm 1 nút tự phát hết.
 *  - Video nào lỗi / không cho nhúng -> tự động bỏ qua sang bài kế.
 *  - Giữ màn hình sáng khi đang phát (tiện để điện thoại trên xe).
 * ================================================================ */

(function () {
  "use strict";

  // ---- Trạng thái ----
  var currentProfile = null;               // hồ sơ bé đang chọn
  var selectedDay = new Date().getDay();   // 0..6
  var queue = [];                          // danh sách video của ngày đang chọn
  var current = 0;                         // vị trí bài đang phát
  var player = null;                       // đối tượng YT.Player
  var apiReady = false;                    // API YouTube đã sẵn sàng chưa
  var pendingStart = false;                // người dùng bấm phát khi API chưa sẵn sàng
  var wakeLock = null;                     // giữ màn hình sáng

  function $(id) { return document.getElementById(id); }

  var screens = {
    choose: $("choose"),
    home: $("home"),
    playing: $("playing"),
    done: $("done")
  };

  // ================= API YouTube =================
  window.onYouTubeIframeAPIReady = function () {
    apiReady = true;
    if (pendingStart) { pendingStart = false; createPlayer(); }
  };

  function show(name) {
    Object.keys(screens).forEach(function (k) {
      screens[k].classList.toggle("hidden", k !== name);
    });
    window.scrollTo({ top: 0 });
  }

  // ================= Màn hình chọn bé =================
  function buildProfileCards() {
    var box = $("profileCards");
    box.innerHTML = "";
    PROFILES.forEach(function (p) {
      var btn = document.createElement("button");
      btn.className = "profile-card";
      btn.style.setProperty("--pc", p.color);
      btn.innerHTML =
        '<span class="pc-emoji">' + p.emoji + '</span>' +
        '<span class="pc-name">' + p.name + '</span>' +
        '<span class="pc-sub">' + p.subtitle + '</span>';
      btn.addEventListener("click", function () { selectProfile(p); });
      box.appendChild(btn);
    });
  }

  function selectProfile(p) {
    currentProfile = p;
    document.documentElement.style.setProperty("--accent", p.color);
    $("profileTag").textContent = p.emoji + " " + p.name + " · " + p.subtitle;
    buildDayButtons();
    loadDay(new Date().getDay());
    show("home");
  }

  // ================= Trang chính của một bé =================
  function loadDay(day) {
    selectedDay = day;
    var prog = currentProfile.programs[day];
    queue = prog.videos.slice();
    current = 0;

    $("today-emoji").textContent = prog.emoji;
    $("today-theme").textContent = prog.theme;
    $("today-day").textContent = DAY_NAMES[day] + " · " + prog.videos.length + " video";
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
    var order = [1, 2, 3, 4, 5, 6, 0]; // Thứ Hai -> Chủ Nhật
    order.forEach(function (day) {
      var prog = currentProfile.programs[day];
      var btn = document.createElement("button");
      btn.dataset.day = day;
      btn.innerHTML = prog.emoji + " " + DAY_NAMES[day] +
        "<small>" + prog.theme + "</small>";
      btn.addEventListener("click", function () {
        loadDay(day);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      box.appendChild(btn);
    });
  }

  function highlightDayButton() {
    $("dayButtons").querySelectorAll("button").forEach(function (b) {
      b.classList.toggle("active", Number(b.dataset.day) === selectedDay);
    });
  }

  // ================= Phát video =================
  function startPlaying() {
    current = 0;
    show("playing");
    requestWakeLock();
    if (!apiReady) {
      pendingStart = true;
      $("nowTitle").textContent = "Đang tải…";
      return;
    }
    createPlayer();
  }

  function createPlayer() {
    updatePlayingUI();
    if (player) { player.loadVideoById(queue[current].id); return; }
    player = new YT.Player("player", {
      videoId: queue[current].id,
      playerVars: {
        autoplay: 1,
        playsinline: 1,   // phát ngay trong trang trên iPhone
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
    if (e.data === YT.PlayerState.ENDED) goNext();
    if (e.data === YT.PlayerState.PLAYING) $("playPauseBtn").textContent = "⏸";
    if (e.data === YT.PlayerState.PAUSED) $("playPauseBtn").textContent = "▶";
  }

  function onError() { goNext(); }  // video lỗi -> bỏ qua

  function goNext() {
    if (current >= queue.length - 1) { finish(); return; }
    current++;
    player.loadVideoById(queue[current].id);
    updatePlayingUI();
  }

  function goPrev() {
    if (current <= 0) { player.seekTo(0); return; }
    current--;
    player.loadVideoById(queue[current].id);
    updatePlayingUI();
  }

  function togglePlayPause() {
    if (!player || !player.getPlayerState) return;
    if (player.getPlayerState() === YT.PlayerState.PLAYING) player.pauseVideo();
    else player.playVideo();
  }

  function updatePlayingUI() {
    $("progress").textContent = "Video " + (current + 1) + "/" + queue.length;
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
    }).catch(function () {});
  }
  function releaseWakeLock() {
    if (wakeLock) { wakeLock.release().catch(function () {}); wakeLock = null; }
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" &&
        !screens.playing.classList.contains("hidden")) {
      requestWakeLock();
    }
  });

  // ================= Gắn sự kiện =================
  $("changeProfileBtn").addEventListener("click", function () { show("choose"); });
  $("startBtn").addEventListener("click", startPlaying);
  $("replayBtn").addEventListener("click", startPlaying);
  $("homeBtn").addEventListener("click", stopAndHome);
  $("stopBtn").addEventListener("click", stopAndHome);
  $("nextBtn").addEventListener("click", goNext);
  $("prevBtn").addEventListener("click", goPrev);
  $("playPauseBtn").addEventListener("click", togglePlayPause);

  // ================= Khởi động =================
  buildProfileCards();
  show("choose");
})();
