// =============================
// Firebase Core
// =============================
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// =============================
// CONFIG
// =============================
const firebaseConfig = {
  apiKey: "AIzaSyBz1KxK5uOj2gjPAj6Jl8hCMR1VjH5Jb_M",
  authDomain: "narrato-879ef.firebaseapp.com",
  projectId: "narrato-879ef",
  storageBucket: "narrato-879ef.appspot.com",
  messagingSenderId: "26226992816",
  appId: "1:26226992816:web:6e5ec3f74775c50ce43d75"
};


// =============================
// INIT
// =============================
const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const db = getFirestore(app);


// =============================
// EXPORTS
// =============================
export default app;
export { db, collection, getDocs };


// =============================
// MAIN FUNCTION
// =============================
export async function getAllData() {
  try {

    // 🔥 Parallel fetch
    const [catSnap, storySnap, epSnap] = await Promise.all([
      getDocs(collection(db, "categories")),
      getDocs(collection(db, "stories")),
      getDocs(collection(db, "episodes"))
    ]);

    // 🔥 Convert snapshots → arrays
    const categories = catSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const stories = storySnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const episodes = epSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));


    // =============================
    // 🔥 BUILD FINAL STRUCTURE
    // =============================
    return categories.map(cat => {

      // 👉 Filter stories by category
      const filteredStories = stories.filter(story => {
        if (!story.Category) return false;

        const cats = Array.isArray(story.Category)
          ? story.Category
          : [story.Category];

        return cats.includes(cat.id) || cats.includes(cat.name);
      });

      return {
        id: cat.id,
        category: cat.name || "No Name",
        image: cat.image || "",

        titles: filteredStories.map(story => {

          // 👉 Filter + SORT episodes (🔥 MAIN FIX)
          const filteredEpisodes = episodes
            .filter(ep =>
              (ep.storyId && ep.storyId === story.id) ||
              (ep["story name"] && ep["story name"] === story.name)
            )
            .sort((a, b) => (a.episodeNumber || 0) - (b.episodeNumber || 0));

          return {
            id: story.id,
            title: story.name || "No Title",
            image: story.image || "",
            description: story.description || "",

            episodes: filteredEpisodes.map(ep => ({
              name: ep.name || "Episode",
              audio: ep.audio || ""
            }))
          };
        })
      };
    });

  } catch (error) {
    console.error("🔥 FIREBASE ERROR:", error);
    return [];
  }
}