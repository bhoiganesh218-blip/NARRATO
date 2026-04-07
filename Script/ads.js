import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function getAdsData(){

  let snapshot = await getDocs(collection(db, "ads"));

  let ads = [];

  snapshot.forEach(doc => {
    ads.push(doc.data());
  });

  return ads;
}