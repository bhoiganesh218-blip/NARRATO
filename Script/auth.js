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


// =============================
// INIT
// =============================
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


// =============================
// DOM READY
// =============================
let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {

  // ELEMENTS
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
  // UI UPDATE
  // =============================
  function updateTabs() {

    if (isSignup) {
      submitBtn.innerText = "Signup";

      signupTab.classList.add("active");
      loginTab.classList.remove("active");

    } else {
      submitBtn.innerText = "Login";

      loginTab.classList.add("active");
      signupTab.classList.remove("active");
    }
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
        await createUserWithEmailAndPassword(auth, email.value, password.value);
      } else {
        await signInWithEmailAndPassword(auth, email.value, password.value);
      }
    } catch (err) {
      showPopup(err.message);
    }

  });


  // Google Login
  googleBtn?.addEventListener("click", async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      showPopup(err.message);
    }
  });


  // Logout
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    showPopup("Logout confirm?", async () => {
      await signOut(auth);
    });
  });



  // forgot Password

const forgotPasswordBtn = document.getElementById("forgotPassword");

forgotPasswordBtn?.addEventListener("click", async () => {

  if (!email.value) {
    showPopup("Please enter your email first");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email.value);
    showPopup("Password reset email sent! Check your inbox.");
  } catch (err) {
    showPopup(err.message);
  }

});

document.getElementById("forgotPassword").addEventListener("click", () => {
  document.getElementById("emailGuide").style.display = "block";
});

  // =============================
  // AUTH STATE
  // =============================
  

  onAuthStateChanged(auth, (user) => {

    if (user) {
      authBox.style.display = "none";
      profileBox.style.display = "block";

      welcomeText.innerText = `Welcome ${user.displayName || "User"} 👋`;
      userEmail.innerText = user.email;

    } else {
      authBox.style.display = "block";
      profileBox.style.display = "none";

      email.value = "";
      password.value = "";
    }
    
    currentUser = user;

  });


  // INIT
  updateTabs();

});

export function getCurrentUser() {
  return currentUser;
}