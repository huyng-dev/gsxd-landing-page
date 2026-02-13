// Dynamic import logic for page-specific modules
const initializePage = () => {
    const pageName = document.body.dataset.page;

    if (!pageName) {
        console.warn("No page name specified in data-page attribute");
        return;
    }

    // Dynamic import based on page name
    import(`./pages/${pageName}.js`)
        .then((module) => {
            if (module.init && typeof module.init === "function") {
                module.init();
            }
        })
        .catch((err) => {
            // Silently handle missing page-specific modules
            console.log(`No specific module for ${pageName} page`);
        });
};

// Mobile menu toggle
const initMobileMenu = () => {
    const menuButton = document.getElementById("mobile-menu-button");
    if (menuButton) {
        menuButton.addEventListener("click", () => {
            // Toggle mobile menu
            const nav = menuButton.closest("nav");
            const menu = nav.querySelector(".md\\:flex");
            if (menu) {
                menu.classList.toggle("hidden");
                menu.classList.toggle("flex");
                menu.classList.toggle("flex-col");
                menu.classList.toggle("absolute");
                menu.classList.toggle("top-16");
                menu.classList.toggle("right-0");
                menu.classList.toggle("bg-gray-900");
                menu.classList.toggle("p-4");
                menu.classList.toggle("rounded-lg");
                menu.classList.toggle("shadow-lg");
            }
        });
    }
};

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
    initializePage();
    initMobileMenu();
});

// Export for testing purposes
export { initializePage, initMobileMenu };
