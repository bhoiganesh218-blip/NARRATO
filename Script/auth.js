// =============================
// IMPORTS
// =============================
import app from "./firebase.js";

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db } from "./firebase.js";


// =============================
// INIT
// =============================
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

let currentUser = null;


// =============================
// SYNC USER TO FIRESTORE
// =============================
async function syncUser(user) {
  if (!user) return;

  try {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: user.displayName || "Unknown",
      email: user.email || "",
      photoURL: user.photoURL || "",
      lastLogin: serverTimestamp()
    }, { merge: true });

  } catch (err) {
    console.log("User sync error:", err);
  }
}


// =============================
// DOM READY
// =============================
document.addEventListener("DOMContentLoaded", () => {

  const authBox = document.getElementById("authBox");
  const profileBox = document.getElementById("profileBox");

  const email = document.getElementById("email");
  const password = document.getElementById("password");

  const submitBtn = document.getElementById("submitBtn");
  const googleBtn = document.getElementById("googleBtn");

  const signupTab = document.getElementById("signupTab");
  const loginTab = document.getElementById("loginTab");

  const togglePassword = document.getElementById("togglePassword");

  const welcomeText = document.getElementById("welcomeText");
  const userEmail = document.getElementById("userEmail");

  const popup = document.getElementById("popup");
  const popupText = document.getElementById("popupText");

  let isSignup = false;


  // =============================
  // TAB UI
  // =============================
  function updateTabs() {
    submitBtn.innerText = isSignup ? "Signup" : "Login";

    signupTab.classList.toggle("active", isSignup);
    loginTab.classList.toggle("active", !isSignup);
  }


  // =============================
  // POPUP
  // =============================
  function showPopup(msg, onOk = null) {
    popup.style.display = "flex";
    popupText.innerText = msg;

    document.getElementById("popupOk").onclick = () => {
      popup.style.display = "none";
      if (onOk) onOk();
    };

    document.getElementById("popupCancel").onclick = () => {
      popup.style.display = "none";
    };
  }


  // =============================
  // PASSWORD TOGGLE
  // =============================
  togglePassword?.addEventListener("click", () => {
    password.type = password.type === "password" ? "text" : "password";
  });


  // =============================
  // TAB SWITCH
  // =============================
  signupTab?.addEventListener("click", () => {
    isSignup = true;
    updateTabs();
  });

  loginTab?.addEventListener("click", () => {
    isSignup = false;
    updateTabs();
  });


  // =============================
  // AUTH ACTIONS
  // =============================
  submitBtn?.addEventListener("click", async () => {

    if (!email.value || !password.value) {
      showPopup("Email & Password required");
      return;
    }

    try {

      if (isSignup) {
        const cred = await createUserWithEmailAndPassword(auth, email.value, password.value);
        await syncUser(cred.user);
      } 
      else {
        const cred = await signInWithEmailAndPassword(auth, email.value, password.value);
        await syncUser(cred.user);
      }

    } catch (err) {
      showPopup(err.message);
    }

  });


  // =============================
  // GOOGLE LOGIN
  // =============================
  googleBtn?.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      await syncUser(result.user);

    } catch (err) {
      showPopup(err.message);
    }
  });


  // =============================
  // LOGOUT
  // =============================
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    showPopup("Logout confirm?", async () => {
      showLoader();
      await signOut(auth);
      hideLoader();
    });
  });


  // =============================
  // FORGOT PASSWORD
  // =============================
  const forgotPasswordBtn = document.getElementById("forgotPassword");

  forgotPasswordBtn?.addEventListener("click", async () => {

    if (!email.value) {
      showPopup("Please enter your email first");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email.value);
      showPopup("Password reset email sent!");
    } catch (err) {
      showPopup(err.message);
    }
  });


  // =============================
  // AUTH STATE
  // =============================
  onAuthStateChanged(auth, async (user) => {

    currentUser = user;

    if (user) {
      authBox.style.display = "none";
      profileBox.style.display = "block";

      welcomeText.innerText = `Welcome ${user.displayName || "User"} 👋`;
      userEmail.innerText = user.email;

      await syncUser(user);

    } else {
      authBox.style.display = "block";
      profileBox.style.display = "none";

      email.value = "";
      password.value = "";
    }
  });


  updateTabs();
});


// =============================
// EXPORT CURRENT USER
// =============================
export function getCurrentUser() {
  return currentUser;
}