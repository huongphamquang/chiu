/* ================================================================
 *  CHƯƠNG TRÌNH SÁNG CỦA BÉ  —  logic điều khiển (3 bé)
 * ================================================================
 *  - Chọn bé -> xem chương trình theo ngày -> bấm 1 nút tự phát hết.
 *  - Video lỗi / không cho nhúng / KẸT không chạy -> tự thử lại 1 lần,
 *    không được thì tự bỏ qua sang bài kế (không đứng máy giữa đường).
 *  - Nếu nhiều bài liên tiếp đều hỏng (mạng yếu...) thì dừng lại và
 *    báo rõ, bấm ▶ để thử lại thay vì "nhảy" hết chương trình.
 *  - Giữ màn hình sáng khi đang phát (tiện để điện thoại trên xe).
 * ================================================================ */

(function () {
  "use strict";

  // ---- Các mốc thời gian (có thể ghi đè bằng window.KID_CONFIG khi kiểm thử) ----
  var CFG = {
    startTimeoutMs: 12000,   // sau khi nạp bài, quá thời gian này chưa chạy -> thử lại / bỏ qua
    stallTimeoutMs: 20000,   // đang chạy mà kẹt buffering quá thời gian này -> thử lại / bỏ qua
    readyTimeoutMs: 15000,   // trình phát YouTube không báo sẵn sàng -> dựng lại
    apiWaitMs: 15000,        // chờ thư viện YouTube tải xong
    maxFails: 4              // số bài hỏng liên tiếp thì dừng hẳn và báo người dùng
  };
  if (window.KID_CONFIG) {
    Object.keys(window.KID_CONFIG).forEach(function (k) { CFG[k] = window.KID_CONFIG[k]; });
  }

  // ---- Trạng thái ----
  var currentProfile = null;               // hồ sơ bé đang chọn
  var selectedDay = new Date().getDay();   // 0..6
  var queue = [];                          // danh sách video của ngày đang chọn
  var current = 0;                         // vị trí bài đang phát
  var player = null;                       // đối tượng YT.Player
  var playerReady = false;                 // trình phát đã báo onReady chưa
  var rebuilt = false;                     // đã dựng lại trình phát 1 lần chưa
  var watchdog = null;                     // đồng hồ canh video kẹt
  var apiPoll = null;                      // vòng chờ thư viện YouTube
  var retried = false;                     // bài hiện tại đã thử lại 1 lần chưa
  var failCount = 0;                       // số bài hỏng liên tiếp
  var gaveUp = false;                      // đã dừng hẳn, chờ người dùng bấm ▶
  var wakeLock = null;                     // giữ màn hình sáng

  function $(id) { return document.getElementById(id); }

  var screens = {
    choose: $("choose"),
    home: $("home"),
    playing: $("playing"),
    done: $("done")
  };

  function show(name) {
    Object.keys(screens).forEach(function (k) {
      screens[k].classList.toggle("hidden", k !== name);
    });
    window.scrollTo({ top: 0 });
  }

  function setStatus(msg) { $("statusMsg").textContent = msg || ""; }

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

  // ================= Đồng hồ canh video kẹt =================
  function clearWatchdog() {
    if (watchdog) { clearTimeout(watchdog); watchdog = null; }
  }

  function armWatchdog(ms) {
    clearWatchdog();
    watchdog = setTimeout(onWatchdog, ms);
  }

  function onWatchdog() {
    watchdog = null;
    if (!playerReady) { rebuildPlayer(); return; }   // trình phát không lên
    if (!retried) {                                   // lần 1: thử nạp lại (giữ vị trí đang xem)
      retried = true;
      setStatus("Video tải chậm, đang thử lại…");
      var t = 0;
      try { t = Math.floor(player.getCurrentTime() || 0); } catch (e) {}
      loadCurrent(t);
      return;
    }
    skipBad("Video tải chậm.");                       // lần 2: bỏ qua
  }

  // ================= Phát video =================
  function ytAvailable() { return !!(window.YT && window.YT.Player); }

  function startPlaying() {
    current = 0;
    failCount = 0;
    retried = false;
    rebuilt = false;
    gaveUp = false;
    show("playing");
    requestWakeLock();
    updatePlayingUI();
    setStatus("");
    begin();
  }

  // Dùng cho cả lúc bắt đầu lẫn lúc bấm ▶ thử lại
  function begin() {
    if (!ytAvailable()) { waitForApi(); return; }
    if (!player) createPlayer();
    else if (playerReady) loadCurrent();
    // nếu player đang dựng dở: onReady sẽ tự nạp bài
  }

  // Chờ thư viện YouTube (không phụ thuộc việc callback có kịp gọi hay không)
  function waitForApi() {
    stopApiPoll();
    setStatus("Đang tải YouTube…");
    var waited = 0;
    apiPoll = setInterval(function () {
      waited += 300;
      if (ytAvailable()) {
        stopApiPoll();
        begin();
      } else if (waited >= CFG.apiWaitMs) {
        stopApiPoll();
        giveUp("Không tải được YouTube. Kiểm tra mạng rồi bấm ▶ để thử lại.");
      }
    }, 300);
  }

  function stopApiPoll() {
    if (apiPoll) { clearInterval(apiPoll); apiPoll = null; }
  }

  function createPlayer() {
    playerReady = false;
    setStatus("Đang kết nối YouTube…");
    try {
      player = new YT.Player("player", {
        playerVars: {
          autoplay: 1,
          playsinline: 1,   // phát ngay trong trang trên iPhone
          rel: 0,
          modestbranding: 1
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onStateChange,
          onError: onError
        }
      });
    } catch (e) {
      giveUp("Không khởi động được trình phát. Bấm ▶ để thử lại.");
      return;
    }
    armWatchdog(CFG.readyTimeoutMs);
  }

  function onPlayerReady() {
    playerReady = true;
    rebuilt = false;
    clearWatchdog();
    loadCurrent();
  }

  function destroyPlayer() {
    try { if (player && player.destroy) player.destroy(); } catch (e) {}
    player = null;
    playerReady = false;
    var wrap = document.querySelector(".player-wrap");
    if (wrap) wrap.innerHTML = '<div id="player"></div>';
  }

  function rebuildPlayer() {
    if (rebuilt) {
      giveUp("Không kết nối được YouTube. Bấm ▶ để thử lại.");
      return;
    }
    rebuilt = true;
    setStatus("Đang kết nối lại…");
    destroyPlayer();
    createPlayer();
  }

  // Nạp bài đang trỏ tới (current) và bật đồng hồ canh kẹt
  function loadCurrent(startSeconds) {
    clearWatchdog();
    updatePlayingUI();
    if (!player || !playerReady) return;   // onReady sẽ gọi lại
    try {
      player.loadVideoById({
        videoId: queue[current].id,
        startSeconds: startSeconds || 0
      });
    } catch (e) {
      skipBad("Không nạp được video.");
      return;
    }
    armWatchdog(CFG.startTimeoutMs);
  }

  function onStateChange(e) {
    var S = YT.PlayerState;
    switch (e.data) {
      case S.ENDED:
        clearWatchdog();
        goNext(false);
        break;
      case S.PLAYING:
        clearWatchdog();
        failCount = 0;
        retried = false;
        setStatus("");
        $("playPauseBtn").textContent = "⏸";
        break;
      case S.PAUSED:
        clearWatchdog();                    // người dùng chủ động tạm dừng
        $("playPauseBtn").textContent = "▶";
        break;
      case S.BUFFERING:
        if (!watchdog) armWatchdog(CFG.stallTimeoutMs);
        break;
    }
  }

  function onError() { skipBad("Video không phát được."); }

  // Bài hỏng -> bỏ qua sang bài kế (hoặc dừng hẳn nếu hỏng liên tiếp quá nhiều)
  function skipBad(reason) {
    clearWatchdog();
    failCount++;
    if (failCount >= Math.min(queue.length, CFG.maxFails)) {
      giveUp("Không phát được lúc này (mạng yếu hoặc video bị chặn). " +
             "Bấm ▶ để thử lại, hoặc ⏭ để bỏ qua.");
      return;
    }
    setStatus(reason + " Chuyển bài tiếp…");
    goNext(false);
  }

  // Dừng hẳn, báo người dùng, chờ bấm ▶
  function giveUp(msg) {
    clearWatchdog();
    stopApiPoll();
    if (player && !playerReady) destroyPlayer();
    gaveUp = true;
    setStatus(msg);
    $("playPauseBtn").textContent = "▶";
  }

  function goNext(manual) {
    clearWatchdog();
    if (manual) { gaveUp = false; failCount = 0; setStatus(""); }
    retried = false;
    if (current >= queue.length - 1) { finish(); return; }
    current++;
    loadCurrent();
  }

  function goPrev() {
    clearWatchdog();
    gaveUp = false;
    failCount = 0;
    retried = false;
    setStatus("");
    if (current <= 0) {
      if (player && playerReady) { try { player.seekTo(0); } catch (e) {} }
      return;
    }
    current--;
    loadCurrent();
  }

  function togglePlayPause() {
    if (gaveUp) {                           // đang dừng vì lỗi -> thử lại từ bài hiện tại
      gaveUp = false;
      failCount = 0;
      retried = false;
      rebuilt = false;
      setStatus("");
      begin();
      return;
    }
    if (!player || !playerReady) return;
    try {
      if (player.getPlayerState() === YT.PlayerState.PLAYING) player.pauseVideo();
      else player.playVideo();
    } catch (e) {}
  }

  function updatePlayingUI() {
    $("progress").textContent = "Video " + (current + 1) + "/" + queue.length;
    $("nowTitle").textContent = queue[current].title;
    renderTracklist($("playTracklist"), true);
  }

  function stopPlayback() {
    clearWatchdog();
    stopApiPoll();
    gaveUp = false;
    setStatus("");
    if (player && playerReady) { try { player.stopVideo(); } catch (e) {} }
    releaseWakeLock();
  }

  function finish() {
    stopPlayback();
    show("done");
  }

  function stopAndHome() {
    stopPlayback();
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
  $("nextBtn").addEventListener("click", function () { goNext(true); });
  $("prevBtn").addEventListener("click", goPrev);
  $("playPauseBtn").addEventListener("click", togglePlayPause);

  // ================= Khởi động =================
  buildProfileCards();
  show("choose");
})();
