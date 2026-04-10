import { getAllData } from "./firebase.js";
import { renderPlay }from "./audio-player.js";
import { setupSearch } from "./search.js";
import { navAnimation,initPWANavbar } from "./animation.js";




export let allData = [];


export async function init() {
  try {

    console.log("🚀 APP START");

    allData = await getAllData();

    console.log("DATA LOADED:", allData);

    if (!allData.length) {
      console.warn("⚠️ No Data Found");
      return;
    }


  } catch (e) {
    console.error("❌ APP ERROR:", e);
  }
  // ===  WHOLE UI RRNDER === //
  
  document.getElementById("loader").style.display = "none"; // REMOVE LODING
  
  window.render("home")//RENDER HOME
  
  setTimeout(() => {
  setupSearch(allData);// SETUP SEARCH
  
  navAnimation(); // ANIMATION ON SEARCH
  }, 0);
  
}


// ============= CURENT PLAY =============

let currentCatId = "";
let currentStoryId = "";
let currentAudioId = "";



// ===©©©©©©©©©=== UI ===©©©©©©©=== //
//        MAIN UI START             //
// ===@@@@@@@@=== END ===©©©©©©©=== //



//============= START ==================
// FUNCTION OF RENDER ADS SECTION
import { getAdsData } from "./ads.js";

export async function renderAds1(){

  let adsData = await getAdsData();

  let section = document.createElement("section");
  section.className = "discover";

  let slidesHTML = "";

  adsData.forEach((ad, index) => {
    slidesHTML += `
      <div class="slide ${index === 0 ? "active" : ""}" data-link="${ad.link}">
        <img src="${ad.image}">
      </div>
    `;
  });

  section.innerHTML = `
    <div class="tabs">
      <span class="active" id="discover">Discover</span>
      <span id="foryou">For You</span>
    </div>

    <div class="featured">
      ${slidesHTML}
      <button class="play">▶</button>
    </div>

    <div class="filters">
      <button>Latest</button>
      <button>Hottest</button>
      <button>All</button>
    </div>
  `;

  document.querySelector("main").append(section);

  setupAdsLogic();
  setupButtons(); // 🔥 FIX
}
//================ END =================




//============= START ==================
// ADS SECTION LOGIC
function setupAdsLogic(){

  let slides = document.querySelectorAll(".slide");
  let index = 0;

  setInterval(() => {

    let current = slides[index];

    // next index
    let nextIndex = (index + 1) % slides.length;
    let next = slides[nextIndex];

    // remove old classes
    slides.forEach(s => {
      s.classList.remove("active", "prev");
    });

    // current becomes prev (left move)
    current.classList.add("prev");

    // next becomes active (enter from right)
    next.classList.add("active");

    // update index
    index = nextIndex;

  }, 3000);

  // CLICK REDIRECT
  slides.forEach(slide => {
    slide.addEventListener("click", () => {
      let link = slide.dataset.link;
      if(link){
        window.open(link, "_blank");
      }
    });
  });
}
//================ END =================




//============= START ==================
// FUNCTION OF MAKING CATEGORY SECTION
function createSection(heading, id, catId) {
  let br = document.createElement("br");
  let section = document.createElement("section");
  section.className = "Categories-Section";

  section.innerHTML = `
    <div class="storyhead">
        <h2 class="title">${heading}</h2>
        <div class="mordiv">
            <a class="more" id="${id}">More ></a>
        </div>
    </div>
    <div class="story-row" id="row-${id}"></div>
  `;
  
  section.querySelector(".more").addEventListener("click", () => {
    window.render("categoryStory", { catId: catId });
  });
  
  document.querySelector("main").append(section);
  document.querySelector("main").append(br);
}

//=============== END =================



//============ START ==================
// FUNCTION OF MAKING STORY CARD 
export function createCard(image, title, ep, catId, storyId) {
  let card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="${image}">
    <p>${title}</p>
    <span>${ep} episodes</span>
  `;
  card.addEventListener("click",()=>{
    currentCatId = catId;
    currentStoryId = storyId;
    
    
  window.render("player", {
  catId: currentCatId,
  storyId: currentStoryId
});
    
  })
  return card;
}
//=============== END =================






//============ START ==================

// === RENDER === //

export function renderHome() {
  // Category
  for (let j = 0; j < allData.length; j++) {

    createSection(allData[j].category, allData[j].id,j);

    let row = document.querySelector(`#row-${allData[j].id}`);

    allData[j].titles.forEach((story, i) => {
      row.append(createCard(story.image, story.title, story.episodes.length,j,i));
    });
  }
}
//=============== END =================




//============= START ==================
// FUNCTION OF RENDER AUDIO PLAYER

export function renderAdudioHTML(catId, storyId) {

  if (document.querySelector("#audioPlayer")) return;

  const div = document.createElement("div");
  div.id = "audioPlayer";

  div.innerHTML = `
  <div class="app">

    <div class="top-player">

      <button id="autoplayToggle">Auto ▶️: OFF</button>
      <button id="expandBtn">🔼</button>
      <button id="miniClose">✖</button>
      <button id="shareBtn" class="share-btn">🔗 Share</button>

      <img src="Jpg-File/story.jpg" class="cover" id="disc">

      <h2 id="title">Loading...</h2>
      <p id="description">Loading...</p>

      <audio id="audio">
        <source src="">
      </audio>

      <div class="progress-container" id="progressContainer">
        <div class="progress" id="progress"></div>
      </div>

      <div class="time">
        <span id="current">0:00</span>
        <span id="duration">0:00</span>
      </div>

      <div class="controls">
        <button id="rewind">⏪</button>
        <button id="play">▶</button>
        <button id="forward">⏩</button>
      </div>

      <div class="controls">
        <button id="replay">Replay</button>
        <button id="loopBtn">Loop</button>
        <button id="speedBtn">1x</button>
        <button id="sleepBtn">⏱ Sleep</button>
        <div class="sleep-status">
  <span id="sleepTimerDisplay"></span>
</div>
      </div>

      <p id="volumeLabel">Volume</p>
      <input type="range" id="volume" min="0" max="1" step="0.01">

    </div>

    <div class="episode-list"></div>

    <!-- SLEEP POPUP -->
    <div id="sleepPopup" class="sleep-popup hidden">
      <div class="sleep-box">
        <h3>⏱ Sleep Timer</h3>
        <p>Enter time in minutes</p>

        <input type="number" id="sleepInput" placeholder="Minutes">
        

        <div class="sleep-actions">
          <button id="sleepCancel">Cancel</button>
          <button id="sleepStart">Start</button>
        </div>
      </div>
    </div>

  </div>
  `;

  document.querySelector("#audioDisplay")?.appendChild(div);

  // IMPORTANT
  renderPlay(allData, catId, storyId);
}
//=============== END =================





//============= START ==================
// FUNCTION OF RENDER RENDOM SUGGESTION
export function renderEmptyDiv() {
  
  let div = document.createElement("div");
  div.setAttribute("id","suggestSection");
  document.querySelector("main").append(div);
}

export function setupButtons() {

  let discoverBtn = document.getElementById("discover");
  let foryouBtn = document.getElementById("foryou");

  if (!discoverBtn || !foryouBtn) return; // 🛡 safety

  discoverBtn.addEventListener("click", () => {

    let container = document.querySelector("#suggestSection");

    discoverBtn.classList.add("active");
    foryouBtn.classList.remove("active");

    if (container) {
      container.style.display = "none"; // ✅ safe
    }

  });

  foryouBtn.addEventListener("click", () => {

    let container = document.querySelector("#suggestSection");

    discoverBtn.classList.remove("active");
    foryouBtn.classList.add("active");

    if (!container) return; // 🛡 important

    let random = allData[Math.floor(Math.random() * allData.length)];

    container.innerHTML = "";

    random.titles.forEach((story, i) => {
      container.append(
        createCard(story.image, story.title, story.episodes.length, 0, i)
      );
    });

    container.style.display = "flex"; // ✅ safe

  });
}
//=============== END =================






//============= START ==================
// CATEGORY HTML CREATOR
export function renderCategoryPage(audioData) {

  const main = document.querySelector("main");

  // remove old if exist
  document.querySelector(".cat-page")?.remove();

  let page = document.createElement("div");
  page.className = "cat-page";

  page.innerHTML = `
    <h2 class="cat-title">Browse Categories</h2>
    <div class="cat-container"></div>
  `;

  const container = page.querySelector(".cat-container");

  audioData.forEach((cat, index) => {

    let div = document.createElement("div");
    div.className = "cat-card";

    div.innerHTML = `
      <img src="${cat.image}">
      <p>${cat.category}</p>
    `;

    div.dataset.index = index;

    container.appendChild(div);
  });

  main.appendChild(page);
}
//=============== END =================




//============= START ==================
// CATEGORY LOGIC MAKER
export function setupCategoryLogic(audioData) {

  const cards = document.querySelectorAll(".cat-card");

  cards.forEach(card => {

    card.addEventListener("click", function () {

      const index = this.dataset.index;

      // 🔥 GLOBAL VARIABLE SET
      window.currentCatId = index;

      // 👉 SPA navigation
      window.render("categoryStory", { catId: index });

    });

  });

}
//=============== END =================




//============= START ==================
// CATEGORY UNDER STORY RENDER
export function renderStoryCategoryPage(allData, catId) {

  const main = document.querySelector("main");

  const categoryData = allData[catId];

  if (!categoryData) {
    main.innerHTML = "<h2>No Category Found</h2>";
    return;
  }

  main.innerHTML = `
    <h1 class="category-title">${categoryData.category}</h1>

    <div class="story-list">
      ${categoryData.titles.map((s, i) => `
        <div class="story" data-index="${i}">
          <img src="${s.image}">
          <div class="info">
            <h3>${s.title}</h3>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}
//=============== END =================






//============= START ==================
// CATEGORY UNDER STORY LOGIC
export function setupStoryCategoryLogic(allData, catId) {

  const list = document.querySelector(".story-list");
  if (!list) return;

  const stories = document.querySelectorAll(".story");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  });

  stories.forEach(story => observer.observe(story));

  list.addEventListener("click", function (e) {

    const story = e.target.closest(".story");
    if (!story) return;

    const storyIndex = story.dataset.index;

    setTimeout(() => {
      window.render("player", {
        catId: catId,
        storyId: storyIndex
      });
    }, 300);

  });
}
//=============== END =================






//============= START ==================
// RENDER CONTACT PAGE
export function renderContactPage(){

  const main = document.querySelector("main");
  main.innerHTML = ""; // IMPORTANT (clean screen)

  let div = document.createElement("div");
  div.id = "contactPage";

  div.innerHTML = `
    <section class="contact">

      <div class="contact-container">

        <h1>Contact Us</h1>

        <p class="contact-intro">
          If you have any questions, suggestions, feel free to reach out.
        </p>

        <form class="contact-form">

          <input type="text" placeholder="Your Name" required>

          <input type="email" placeholder="Your Email" required>

          <input type="text" placeholder="Subject">

          <textarea placeholder="Write your message..." rows="6"></textarea>

          <button type="submit">Send Message</button>

        </form>

        <div class="contact-info">
          <h2>Other Ways</h2>
          <p>Email : narrato.contact777@gmail.com</p>
          <p>YouTube : Talking Ganesh</p>
        </div>

      </div>

    </section>
  `;

  main.appendChild(div);
}
//=============== END =================


