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



export function setupSmartNavbar() {
    const nav = document.querySelector("#navbar") || document.querySelector("#navbarHidden");
    const body = document.body;

    if (!nav) return;

    let lastScrollY = window.scrollY;

    // 2. Scroll Event
    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;

        // Agar niche scroll ho raha hai aur top se 100px door hain
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            if (nav.id !== "navbarHidden") {
                nav.id = "navbarHidden";
            }
        } 
        // Agar upar scroll ho raha hai
        else {
            if (nav.id !== "navbar") {
                nav.id = "navbar";
            }
        }
        lastScrollY = currentScrollY;
    });
}

// Page load hote hi function ko chalao
document.addEventListener("DOMContentLoaded", setupSmartNavbar);
