import { saveHistory, getAllHistory } from "./history.js";

export function renderPlay(allData, currentCatId, currentStoryId) {

  if (currentCatId === "" || currentStoryId === "") return;

  const categoryIndex = Number(currentCatId);
  const storyIndex = Number(currentStoryId);

  const selectedData = allData[categoryIndex].titles[storyIndex];
  const episodes = selectedData.episodes;

  // ===============================
  // DOM
  // ===============================
  const episodeList = document.querySelector(".episode-list");
  const title = document.getElementById("title");
  const text = document.getElementById("description");
  const disc = document.getElementById("disc");
  const audio = document.getElementById("audio");

  const playBtn = document.getElementById("play");
  const replayBtn = document.getElementById("replay");
  const progress = document.getElementById("progress");
  const progressContainer = document.getElementById("progressContainer");

  const current = document.getElementById("current");
  const duration = document.getElementById("duration");

  const forwardBtn = document.getElementById("forward");
  const rewindBtn = document.getElementById("rewind");

  const player = document.querySelector("#audioPlayer");
  const shareBtn = document.getElementById("shareBtn");
  const autoBtn = document.getElementById("autoplayToggle");
  const sleepBtn = document.getElementById("sleepBtn");

  if (!audio || !episodeList) return;

  // ===============================
  // UI SETUP
  // ===============================
  title.innerText = selectedData.title;
  text.innerText = selectedData.description;
  disc.src = selectedData.image;
  episodeList.innerHTML = "";

  // ===============================
  // HISTORY
  // ===============================
  const saved = getAllHistory().find(
    h => h.storyId == storyIndex && h.catId == categoryIndex
  );

  let currentEpisodeIndex = saved?.episodeIndex ?? 0;

  function safeSave(data) {
    const existing = getAllHistory().find(
      h => h.storyId == data.storyId && h.catId == data.catId
    );

    saveHistory({
      catId: data.catId,
      storyId: data.storyId,
      title: existing?.title || data.title,
      image: existing?.image || data.image,
      episodeIndex: data.episodeIndex,
      lastTime: data.lastTime
    });
  }

  // ===============================
  // AUTOPLAY
  // ===============================
  let autoPlayNext = JSON.parse(localStorage.getItem("autoPlayNext")) || false;

  function updateAutoUI() {
    if (!autoBtn) return;
    autoBtn.innerText = autoPlayNext ? "Auto ▶️ ON" : "Auto ▶️ OFF";
  }

  autoBtn?.addEventListener("click", () => {
    autoPlayNext = !autoPlayNext;
    localStorage.setItem("autoPlayNext", JSON.stringify(autoPlayNext));
    updateAutoUI();
  });

  updateAutoUI();

  // ===============================
  // FORMAT TIME
  // ===============================
  const formatTime = (t) => {
    if (isNaN(t)) return "00:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  // ===============================
  // LOAD AUDIO
  // ===============================
  function loadAudio(index, autoPlay = false) {

    const ep = episodes[index];
    if (!ep) return;

    currentEpisodeIndex = index;

    audio.src = ep.audio;
    title.innerText = ep.name;

    audio.onloadedmetadata = () => {
      duration.innerText = formatTime(audio.duration);

      if (saved && saved.episodeIndex === index) {
        audio.currentTime = saved.lastTime || 0;
      }
    };

    if (autoPlay) audio.play();
  }

  // ===============================
  // EPISODE LIST
  // ===============================
  episodes.forEach((ep, index) => {

    const div = document.createElement("div");
    div.className = "episode";
    div.innerText = ep.name;

    if (index === currentEpisodeIndex) div.classList.add("active");

    div.onclick = () => {

      document.querySelectorAll(".episode")
        .forEach(el => el.classList.remove("active"));

      div.classList.add("active");

      loadAudio(index, true);

      safeSave({
        catId: categoryIndex,
        storyId: storyIndex,
        title: selectedData.title,
        image: selectedData.image,
        episodeIndex: index,
        lastTime: 0
      });
    };

    episodeList.appendChild(div);
  });

  loadAudio(currentEpisodeIndex);

  // ===============================
  // CONTROLS
  // ===============================
  playBtn.onclick = () => {
    audio.paused ? audio.play() : audio.pause();
  };

  replayBtn?.addEventListener("click", () => {
    audio.currentTime = 0;
    audio.play();
  });

  audio.onplay = () => playBtn.innerText = "⏸";
  audio.onpause = () => playBtn.innerText = "▶";
  
  audio.onplay = () => {

  playBtn.innerText = "⏸";

  // 🔥 MEDIA SESSION START
  if ('mediaSession' in navigator) {

    navigator.mediaSession.metadata = new MediaMetadata({
      title: title.innerText,
      artist: "NARRATO",
      album: "Audio Player",
      artwork: [
        {
          src: disc.src,
          sizes: "512x512",
          type: "image/png"
        }
      ]
    });

    navigator.mediaSession.setActionHandler("play", () => audio.play());
    navigator.mediaSession.setActionHandler("pause", () => audio.pause());

    navigator.mediaSession.setActionHandler("seekbackward", () => {
      audio.currentTime -= 10;
    });

    navigator.mediaSession.setActionHandler("seekforward", () => {
      audio.currentTime += 10;
    });
  }
};

  // ===============================
  // PROGRESS
  // ===============================
  audio.ontimeupdate = () => {

    if (audio.duration) {
      progress.style.width =
        (audio.currentTime / audio.duration) * 100 + "%";
    }

    current.innerText = formatTime(audio.currentTime);

    safeSave({
      catId: categoryIndex,
      storyId: storyIndex,
      title: selectedData.title,
      image: selectedData.image,
      episodeIndex: currentEpisodeIndex,
      lastTime: audio.currentTime
    });
  };

  // ===============================
  // AUTO NEXT
  // ===============================
  audio.onended = () => {

    if (!autoPlayNext) return;

    const next = currentEpisodeIndex + 1;
    if (next >= episodes.length) return;

    document.querySelectorAll(".episode")
      .forEach(el => el.classList.remove("active"));

    document.querySelectorAll(".episode")[next]
      .classList.add("active");

    loadAudio(next, true);
  };

  // ===============================
  // SEEK
  // ===============================
  progressContainer.onclick = (e) => {
    const width = progressContainer.clientWidth;
    audio.currentTime = (e.offsetX / width) * audio.duration;
  };

  forwardBtn.onclick = () => {
    audio.currentTime = Math.min(audio.currentTime + 5, audio.duration);
  };

  rewindBtn.onclick = () => {
    audio.currentTime = Math.max(audio.currentTime - 5, 0);
  };

  // ===============================
  // SHARE
  // ===============================
  shareBtn?.addEventListener("click", async () => {

  const repoName = "NARRATO"; // 👈 apna GitHub repo name daalo

const link = `${window.location.origin}/${repoName}/?cat=${currentCatId}&story=${currentStoryId}`;

  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(link);
  } catch (e) {}

  // 🔥 Native Share Sheet
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Check this audio",
        text: "Listen to this audio:",
        url: link
      });
    } catch (err) {
      console.log("Share cancelled", err);
    }
  } else {
    // fallback
    window.open(`https://wa.me/?text=${encodeURIComponent(link)}`, "_blank");
  }

});


// ===============================
//    VOLUME SLIDER
// ===============================
const volumeSlider = document.getElementById("volume");

if (volumeSlider) {

  audio.volume = volumeSlider.value || 0.5;

  volumeSlider.addEventListener("input", (e) => {
    audio.volume = e.target.value;
  });
}

// ===============================
// SPEED CONTROL
// ===============================

const speedBtn = document.getElementById("speedBtn");

let speedIndex = 0;
const speeds = [1, 1.25, 1.5, 2];

speedBtn?.addEventListener("click", () => {

  speedIndex = (speedIndex + 1) % speeds.length;

  audio.playbackRate = speeds[speedIndex];

  speedBtn.innerText = speeds[speedIndex] + "x";
});


// ===============================
// LOOP CONTROL
// ===============================

const loopBtn = document.getElementById("loopBtn");

let isLoop = false;

loopBtn?.addEventListener("click", () => {

  isLoop = !isLoop;

  audio.loop = isLoop;

  loopBtn.style.color = isLoop ? "#22D3EE" : "";

});



// ===============================
// SLEEP TIMER (CLEAN REWRITE)
// ===============================

let sleepTimeout = null;
let countdownInterval = null;

function getSleepElements() {
  return {
    popup: document.getElementById("sleepPopup"),
    input: document.getElementById("sleepInput"),
    display: document.getElementById("sleepTimerDisplay"),
    startBtn: document.getElementById("sleepStart"),
    cancelBtn: document.getElementById("sleepCancel"),
    sleepBtn: document.getElementById("sleepBtn")
  };
}

// SAFE INIT (IMPORTANT)
setTimeout(() => {

  const {
    popup,
    startBtn,
    cancelBtn,
    sleepBtn
  } = getSleepElements();

  sleepBtn?.addEventListener("click", () => {
    popup?.classList.remove("hidden");
  });

  startBtn?.addEventListener("click", startSleepTimer);
  cancelBtn?.addEventListener("click", cancelSleepTimer);

}, 0);

function startSleepTimer() {

  const { input, display, popup } = getSleepElements();

  const min = Number(input?.value);

  if (!min || min <= 0) {
    alert("Enter valid time");
    return;
  }

  // clear old
  clearTimeout(sleepTimeout);
  clearInterval(countdownInterval);

  let timeLeft = min * 60;

  // countdown UI
  countdownInterval = setInterval(() => {

    timeLeft--;

    if (display) {
      const m = Math.floor(timeLeft / 60);
      const s = timeLeft % 60;
      display.innerText = `⏳ ${m}:${s < 10 ? "0" + s : s}`;
    }

    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
    }

  }, 1000);

  // main timer
  sleepTimeout = setTimeout(() => {
    if (audio) audio.pause();
    clearInterval(countdownInterval);
  }, min * 60000);

  popup?.classList.add("hidden");
}

function cancelSleepTimer() {

  const { popup, display } = getSleepElements();

  clearTimeout(sleepTimeout);
  clearInterval(countdownInterval);

  sleepTimeout = null;
  countdownInterval = null;

  if (display) display.innerText = "";

  popup?.classList.add("hidden");
}
  // ===============================
  // MINI PLAYER
  // ===============================
  const closeBtn = document.getElementById("miniClose");
  const expandBtn = document.getElementById("expandBtn");

  closeBtn?.addEventListener("click", () => {
    audio.pause();
    player?.remove();
  });

  expandBtn?.addEventListener("click", () => {
    player?.classList.remove("mini");
    player.style.left = "";
    player.style.top = "";
  });

  // ===============================
  // DRAG (ONLY MINI)
  // ===============================
  if (player && !player.dataset.dragReady) {
    makeDraggable(player);
    player.dataset.dragReady = "true";
  }
}


// ===============================
// DRAG SYSTEM (CLEAN)
// ===============================
export function makeDraggable(el) {

  let dragging = false, offsetX = 0, offsetY = 0;

  el.addEventListener("mousedown", start);
  el.addEventListener("touchstart", start, { passive: false });

  function start(e) {

    if (!el.classList.contains("mini")) return;

    dragging = true;

    const touch = e.touches?.[0];
    const x = touch ? touch.clientX : e.clientX;
    const y = touch ? touch.clientY : e.clientY;

    const rect = el.getBoundingClientRect();

    offsetX = x - rect.left;
    offsetY = y - rect.top;

    document.addEventListener("mousemove", move);
    document.addEventListener("touchmove", move, { passive: false });
    document.addEventListener("mouseup", stop);
    document.addEventListener("touchend", stop);
  }

  function move(e) {
    if (!dragging) return;

    if (e.cancelable) e.preventDefault();

    const touch = e.touches?.[0];
    const x = touch ? touch.clientX : e.clientX;
    const y = touch ? touch.clientY : e.clientY;

    el.style.left = (x - offsetX) + "px";
    el.style.top = (y - offsetY) + "px";
  }

  function stop() {
    dragging = false;

    document.removeEventListener("mousemove", move);
    document.removeEventListener("touchmove", move);
    document.removeEventListener("mouseup", stop);
    document.removeEventListener("touchend", stop);
  }
}