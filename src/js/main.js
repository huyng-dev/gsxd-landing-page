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

// FAQ Accordion Logic
const initFAQ = () => {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
        const button = item.querySelector(".faq-button");
        const content = item.querySelector(".faq-content");
        const icon = item.querySelector(".faq-icon");

        if (button && content && icon) {
            button.addEventListener("click", () => {
                const isOpen = !content.classList.contains("hidden");

                // Close all other items
                faqItems.forEach((otherItem) => {
                    if (otherItem !== item) {
                        const otherContent = otherItem.querySelector(".faq-content");
                        const otherIcon = otherItem.querySelector(".faq-icon");
                        if (otherContent) otherContent.classList.add("hidden");
                        if (otherIcon) {
                            otherIcon.classList.add("rotate-180");
                            otherIcon.classList.replace("bg-textPrimary", "bg-gray-200");
                            otherIcon.classList.replace("text-white", "text-gray-500");
                        }
                    }
                });

                if (isOpen) {
                    content.classList.add("hidden");
                    icon.classList.add("rotate-180");
                    icon.classList.replace("bg-textPrimary", "bg-gray-200");
                    icon.classList.replace("text-white", "text-gray-500");
                } else {
                    content.classList.remove("hidden");
                    icon.classList.remove("rotate-180");
                    icon.classList.replace("bg-gray-200", "bg-textPrimary");
                    icon.classList.replace("text-gray-500", "text-white");
                }
            });
        }
    });
};

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
    initializePage();
    initMobileMenu();
    initFAQ();
});

// Export for testing purposes
export { initializePage, initMobileMenu, initFAQ };
