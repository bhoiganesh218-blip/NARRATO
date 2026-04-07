const STORAGE_KEY = "narrato_history";


// ===============================
// SAVE OR UPDATE HISTORY
// ===============================
export function saveHistory(data) {

  if (!data || data.storyId == null || data.catId == null) return;

  let history = getAllHistory();

  // remove duplicate (same cat + story)
  history = history.filter(item =>
    !(item.storyId === data.storyId && item.catId === data.catId)
  );

  // add latest on top
  history.unshift({
    ...data,
    lastUpdated: Date.now()
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}


// ===============================
// GET ALL HISTORY
// ===============================
export function getAllHistory() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}


// ===============================
// DELETE SINGLE HISTORY
// ===============================
export function deleteHistory(storyId, catId) {

  let history = getAllHistory();

  history = history.filter(item =>
    !(item.storyId === storyId && item.catId === catId)
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}


// ===============================
// CLEAR ALL HISTORY
// ===============================
export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}


// ===============================
// RENDER HISTORY PAGE
// ===============================
export function renderHistoryPage() {

  const section = document.getElementById("historySection");
  const list = document.getElementById("historyList");

  if (!section || !list) {
    console.error("❌ History elements not found");
    return;
  }

  // show section
  section.classList.remove("hidden");

  // clear old content
  list.innerHTML = "";

  let history = getAllHistory();

  if (!history.length) {
    list.innerHTML = "<h2>📭 No History Found</h2>";
    return;
  }

  // ✅ IMPORTANT: No reverse needed
  history.forEach(item => {

    const div = document.createElement("div");
    div.className = "history-card";

    div.innerHTML = `
  <img src="${item.image || ''}" alt="thumbnail">

  <div class="info">
    <h3>${item.title || "Untitled"}</h3>
    <p>⏱ ${formatTime(item.lastTime || 0)}</p>
  </div>

  <button class="delete-btn">🗑</button>
`;

    div.onclick = () => {
      if (window.render) {
        window.render("player", {
          catId: item.catId,
          storyId: item.storyId
        });
      }
    };
    
    const deleteBtn = div.querySelector(".delete-btn");

deleteBtn.onclick = (e) => {
  e.stopPropagation(); // 🔥 important (play open na ho)

  deleteHistory(item.storyId, item.catId);

  // re-render history
  renderHistoryPage();
};

    list.appendChild(div);
  });


  // ===============================
  // FORMAT TIME
  // ===============================
  function formatTime(time) {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? "0" + s : s}`;
  }
}