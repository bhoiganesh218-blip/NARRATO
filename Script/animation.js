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
    let ticking = false; // Performance optimize karne ke liye

    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;

                // Flicker rokne ke liye: 10px se zyada scroll hone par hi action lo
                if (Math.abs(currentScrollY - lastScrollY) > 10) {
                    
                    if (currentScrollY > lastScrollY && currentScrollY > 100) {
                        // NICHE SCROLL -> JS se style apply karo (Hide)
                        navbar.style.transform = "translateY(-100%)";
                    } else {
                        // UPAR SCROLL -> JS se style apply karo (Show)
                        navbar.style.transform = "translateY(0)";
                    }
                    
                    lastScrollY = currentScrollY;
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Function call
document.addEventListener("DOMContentLoaded", initSmartNavbar);
