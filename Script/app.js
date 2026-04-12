// ===============================
// IMPORTS
// ===============================
import {
  init,
  renderEmptyDiv,
  renderAds1,
  renderHome,
  renderAdudioHTML,
  setupButtons,
  renderCategoryPage,
  setupCategoryLogic,
  allData,
  renderStoryCategoryPage,
  setupStoryCategoryLogic,
  renderContactPage,
} from "./functions.js";

import { setupContactForm } from "./contact.js";
import { renderHistoryPage } from "./history.js";
import { renderSearchPage } from "./search.js";

// ===============================
// QUERY PARAMS
// ===============================
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    cat: params.get("cat"),
    story: params.get("story")
  };
}

// ===============================
// INIT
// ===============================
window.addEventListener("load", async () => {

  showLoader();
  await init();
  hideLoader();

  const { cat, story } = getQueryParams();

  // 🔥 BASE STATE (home)
  history.replaceState({ page: "home" }, "", "#home");

  // 🔥 FAKE LAYER (important)
  history.pushState({ page: "app" }, "", "#app");

  if (cat !== null && story !== null) {
    render("player", {
      catId: Number(cat),
      storyId: Number(story)
    });
  } else {
    render("home");
  }

});

// ===============================
// RENDER LOCK
// ===============================
let isRendering = false;

// ===============================
// GLOBAL RENDER FUNCTION
// ===============================
async function render(page, data = {}) {

  if (isRendering) return;
  isRendering = true;

  try {

    const section = document.getElementById("historySection");
    const main = document.querySelector("main");
    const profile = document.querySelector("#profileDiv");
    const audioDisplay = document.querySelector("#audioDisplay");
    const player = document.querySelector("#audioPlayer");

    // 🔥 always replace (no stack build)
    history.replaceState({ page, data }, "", `#${page}`);

    // ===============================
    // RESET UI
    // ===============================
    main.classList.add("hidden");
    profile.classList.add("hidden");
    section?.classList.add("hidden");

    // ===============================
    // HOME
    // ===============================
    if (page === "home") {

      main.classList.remove("hidden");
      main.innerHTML = "";

      if (player) {
        audioDisplay.classList.remove("hidden");
        player.classList.add("mini");
      }

      await renderAds1();
      renderEmptyDiv();
      renderHome();
      setupButtons();
    }

    // ===============================
    // PLAYER
    // ===============================
    else if (page === "player") {

      main.classList.remove("hidden");
      main.innerHTML = "";

      audioDisplay.classList.remove("hidden");

      if (player) player.classList.remove("mini");

      audioDisplay.innerHTML = "";
      renderAdudioHTML(data.catId, data.storyId);
    }

    // ===============================
    // SEARCH
    // ===============================
    else if (page === "search") {

      main.classList.remove("hidden");
      main.innerHTML = "";

      renderSearchPage(data.results, data.query);

      if (player) {
        audioDisplay.classList.remove("hidden");
        player.classList.add("mini");
      }
    }

    // ===============================
    // PROFILE
    // ===============================
    else if (page === "profile") {

      profile.classList.remove("hidden");

    }

    // ===============================
    // CATEGORY
    // ===============================
    else if (page === "category") {

      main.classList.remove("hidden");
      main.innerHTML = "";

      if (player) {
        audioDisplay.classList.remove("hidden");
        player.classList.add("mini");
      }

      renderCategoryPage(allData);
      setupCategoryLogic(allData);
    }

    // ===============================
    // CATEGORY STORY
    // ===============================
    else if (page === "categoryStory") {

      main.classList.remove("hidden");
      main.innerHTML = "";

      renderStoryCategoryPage(allData, data.catId);
      setupStoryCategoryLogic(allData, data.catId);
    }

    // ===============================
    // CONTACT
    // ===============================
    else if (page === "contact") {

      main.classList.remove("hidden");
      main.innerHTML = "";

      if (player) {
        audioDisplay.classList.remove("hidden");
        player.classList.add("mini");
      }

      renderContactPage();
      setupContactForm();
    }

    // ===============================
    // HISTORY
    // ===============================
    else if (page === "history") {

      if (player) {
        audioDisplay.classList.remove("hidden");
        player.classList.add("mini");
      }

      main.classList.add("hidden");
      profile.classList.add("hidden");

      section.classList.remove("hidden");

      renderHistoryPage();
    }

  } finally {
    isRendering = false;
  }
}

// ===============================
// GLOBAL ACCESS
// ===============================
window.render = render;

// ===============================
// NAV BUTTONS
// ===============================
document.getElementById("homeBtn").addEventListener("click", () => render("home"));
document.getElementById("profileBtn").addEventListener("click", () => render("profile"));
document.getElementById("categoryBtn").addEventListener("click", () => render("category"));
document.getElementById("contactBtn").addEventListener("click", () => render("contact"));
document.getElementById("historyBtn").addEventListener("click", () => render("history"));

// ===============================
// BACK BUTTON CONTROL
// ===============================
window.addEventListener("popstate", function () {

  // 🔥 force home instead of exit
  render("home");

  // 🔥 recreate fake layer again
  history.pushState({ page: "app" }, "", "#app");

});