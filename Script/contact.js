import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export function setupContactForm(){

  const form = document.querySelector(".contact-form");

  if(!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputs = form.querySelectorAll("input");
    const textarea = form.querySelector("textarea");

    const name = inputs[0].value;
    const email = inputs[1].value;
    const subject = inputs[2].value;
    const message = textarea.value;

    try{
      await addDoc(collection(db, "contacts"), {
        name,
        email,
        subject,
        message,
        time: new Date()
      });

      alert("Message sent ✅");

      form.reset();

    }catch(err){
      console.error(err);
      alert("Error ❌");
    }

  });

}