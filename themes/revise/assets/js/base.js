let lastScrollY = window.scrollY;
let timer;
const navbar = document.getElementById("navbar");
const darkModeToggle = document.getElementById("darkModeToggle");

// Check for saved dark mode preference
if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-theme");
    darkModeToggle.querySelector("i").classList.replace("fa-moon", "fa-sun");
}

// Navbar scroll hiding functionality
window.addEventListener("scroll", () => {
    if (window.scrollY === 0) {
        navbar.classList.remove("hidden");
        clearTimeout(timer);
    } else if (window.scrollY > lastScrollY) {
        navbar.classList.add("hidden");
    } else {
        navbar.classList.remove("hidden");

        if (window.scrollY > 60) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                navbar.classList.add("hidden");
            }, 3000);
        }
    }
    lastScrollY = window.scrollY;
});

// Dark mode toggle functionality
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    const icon = darkModeToggle.querySelector("i");

    if (document.body.classList.contains("dark-theme")) {
        icon.classList.replace("fa-moon", "fa-sun");
        localStorage.setItem("darkMode", "enabled");
    } else {
        icon.classList.replace("fa-sun", "fa-moon");
        localStorage.setItem("darkMode", "disabled");
    }
});
