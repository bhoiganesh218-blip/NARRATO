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
    const delta = 5; // Kitne pixel scroll ke baad action lena hai (flicker rokne ke liye)

    // Body padding set karein taaki content piche na chhup jaye
    document.body.style.paddingTop = navbar.offsetHeight + "px";

    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;

        // Agar scroll bahut chota hai (delta se kam), toh kuch mat karo
        if (Math.abs(lastScrollY - currentScrollY) <= delta) return;

        // Niche scroll aur page ke top se niche hain
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
            navbar.classList.add("nav-hidden");
        } 
        // Upar scroll
        else {
            navbar.classList.remove("nav-hidden");
        }

        lastScrollY = currentScrollY;
    });
}

document.addEventListener("DOMContentLoaded", initSmartNavbar);
