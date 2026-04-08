//======================================//
//  THIS IS THE SEARCH BAR ANIMATION    //
//======================================//

export function navAnimation(){
let searchBar = document.querySelector("#searchBar");
let searchLogo = document.querySelector("#searchLogo");

let searchActive = true;
searchLogo.addEventListener("click",()=>{
  if(searchActive){
    searchBar.classList.remove("active")
    searchActive = false;
  }else{
  searchBar.classList.add("active")
  searchActive = true;
  };
})
};
// === END === //

//======================================//
//  THIS IS THE SEARCH BAR ANIMATION    //
//======================================// 



export function initSmartNavbar() {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;

    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;

        // 1. Flicker rokne ke liye: Agar scroll bahut kam hai to ignore karo
        if (Math.abs(currentScrollY - lastScrollY) < 5) return;

        // 2. Logic: Niche scroll -> Chhupa do | Upar scroll -> Dikha do
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
            // NICHE: Puri tarah chhup jaye
            navbar.style.transform = "translateY(-100%)";
        } else {
            // UPAR: Wapas dikhne lage
            navbar.style.transform = "translateY(0)";
        }

        lastScrollY = currentScrollY;
    });
}

// Activate on Load
document.addEventListener("DOMContentLoaded", initSmartNavbar);
