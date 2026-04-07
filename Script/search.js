// ===============================
// IMPORTS
// ===============================

import { createCard } from "./functions.js";


// ===============================
// SETUP SEARCH (INIT FUNCTION)
// ===============================

export function setupSearch(allData) {

  // 🔹 Input select
  const input = document.getElementById("searchBar");


  // ===============================
  // SEARCH LOGIC
  // ===============================
  function search(q) {

    q = q.toLowerCase();
    let results = [];

    // 🔹 Loop through all data
    allData.forEach((cat, ci) => {

      cat.titles.forEach((story, si) => {

        // 🔹 Match conditions
        if (
          story.title.toLowerCase().includes(q) ||
          story.description.toLowerCase().includes(q) ||
          cat.category.toLowerCase().includes(q)
        ) {
          results.push({
            ...story,
            ci,   // category index
            si    // story index
          });
        }

      });

    });

    return results;
  }


  // ===============================
  // HANDLE SEARCH EVENT
  // ===============================
  function handleSearch() {

    let q = input.value.trim();

    // 🔹 Empty search → home page
    if (!q) {
      window.render("home");
      return;
    }

    // 🔹 Get results
    let results = search(q);

    // 🔹 Render search page
    window.render("search", {
      results: results,
      query: q
    });
  }


  // ===============================
  // EVENT LISTENERS
  // ===============================

  // 🔹 Enter press
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  });

}


// ===============================
// RENDER SEARCH PAGE UI
// ===============================

export function renderSearchPage(list, q) {

  let main = document.querySelector("main");

  // 🧹 Clear previous UI
  main.innerHTML = "";

  // 🔹 Section create (same structure)
  let section = document.createElement("section");
  section.className = "Categories-Section";

  section.innerHTML = `
    <div class="storyhead">
      <h2 class="title">Search Results : ${q}</h2>
    </div>
    <div class="story-row" id="searchResults"></div>
  `;

  main.append(section);

  let container = document.getElementById("searchResults");

  // 🔹 No result case
  if (!list.length) {
    container.innerHTML = "<p>No results found</p>";
    return;
  }

  // 🔹 Render cards
  list.forEach(item => {
    container.append(
      createCard(
        item.image,
        item.title,
        item.episodes.length,
        item.ci,
        item.si
      )
    );
  });

}