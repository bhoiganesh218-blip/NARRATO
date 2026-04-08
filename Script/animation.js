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



export function initPWANavbar() {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;

    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;

    window.addEventListener("scroll", () => {
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

        // 1. PWA Bounce/Overscroll Protection
        // Agar scroll page ke top se upar chala jaye (bounce), toh kuch mat karo
        if (currentScrollY < 0) return;

        // 2. Threshold (10px gap) taaki glitch na ho
        if (Math.abs(currentScrollY - lastScrollY) < 10) return;

        // 3. Logic: Niche scroll (Hide) | Upar scroll (Show)
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
            // Niche ja rahe ho -> Hide (Upar ki taraf slide out)
            navbar.style.transform = "translateY(-105%)";
        } else {
            // Upar ja rahe ho -> Show (Wapas screen par)
            navbar.style.transform = "translateY(0)";
        }

        lastScrollY = currentScrollY;
    }, { passive: true }); // Performance ke liye passive true rakhein
}

// Load hone par trigger karein
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPWANavbar);
} else {
    initPWANavbar();
}
