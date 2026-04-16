const initProductSectionCarousels = () => {
    document.querySelectorAll("[data-product-section]").forEach((section) => {
        if (section.dataset.productCarouselInitialized === "true") {
            return;
        }

        const carousel = section.querySelector("[data-product-carousel]");
        const slides = Array.from(section.querySelectorAll("[data-product-slide]"));
        const dots = Array.from(section.querySelectorAll("[data-product-dot]"));

        if (!carousel || slides.length === 0 || dots.length === 0) {
            return;
        }

        section.dataset.productCarouselInitialized = "true";

        const setActiveDot = (activeIndex) => {
            dots.forEach((dot, dotIndex) => {
                const isActive = dotIndex === activeIndex;
                dot.classList.toggle("bg-secondary", isActive);
                dot.classList.toggle("bg-[#656663]", !isActive);
                dot.setAttribute("aria-current", isActive ? "true" : "false");
            });
        };

        const getSlideWidth = () =>
            carousel.clientWidth || slides[0]?.getBoundingClientRect().width || 0;

        const syncActiveDot = () => {
            const slideWidth = getSlideWidth();
            if (!slideWidth) {
                return;
            }

            const activeIndex = Math.min(
                slides.length - 1,
                Math.max(0, Math.round(carousel.scrollLeft / slideWidth))
            );

            setActiveDot(activeIndex);
        };

        let scrollFrame = null;

        const handleScroll = () => {
            if (scrollFrame !== null) {
                return;
            }

            scrollFrame = window.requestAnimationFrame(() => {
                scrollFrame = null;
                syncActiveDot();
            });
        };

        dots.forEach((dot, dotIndex) => {
            dot.addEventListener("click", () => {
                const slideWidth = getSlideWidth();
                if (!slideWidth) {
                    return;
                }

                carousel.scrollTo({
                    left: slideWidth * dotIndex,
                    behavior: "smooth",
                });
            });
        });

        carousel.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", syncActiveDot);

        syncActiveDot();
    });
};

const initAboutTabs = () => {
    const aboutPage = document.querySelector('[data-page="about"]');

    if (!aboutPage) {
        return;
    }

    const tabs = Array.from(aboutPage.querySelectorAll(".tab-btn"));
    const contents = Array.from(aboutPage.querySelectorAll(".tab-content"));

    if (tabs.length === 0 || contents.length === 0) {
        return;
    }

    const setActiveTab = (activeTab) => {
        tabs.forEach((tab) => {
            const isActive = tab === activeTab;
            tab.classList.toggle("border-secondary", isActive);
            tab.classList.toggle("border-gray-300", !isActive);
            tab.classList.toggle("active", isActive);
        });

        contents.forEach((content) => {
            content.classList.add("hidden");
        });

        const targetId = activeTab.getAttribute("data-tab");
        const targetContent = targetId ? document.getElementById(targetId) : null;

        if (targetContent) {
            targetContent.classList.remove("hidden");

            if (targetId === "tab-introduction") {
                window.requestAnimationFrame(() => {
                    window.dispatchEvent(new Event("awards:refresh"));
                    window.dispatchEvent(new Event("certificates:refresh"));
                });
            }
        }
    };

    tabs.forEach((tab) => {
        tab.addEventListener("click", (event) => {
            event.preventDefault();
            setActiveTab(tab);
        });
    });

    const defaultTab = tabs.find((tab) => tab.classList.contains("active"));

    if (!defaultTab && tabs[0]) {
        setActiveTab(tabs[0]);
    }
};

let certificatesSwiper = null;
let certificatesSwiperMode = null;

const initCertificatesSwiper = () => {
    if (typeof window.Swiper !== "function") {
        return;
    }

    const swiperElement = document.querySelector(".certificates-swiper");

    if (!swiperElement) {
        return;
    }

    const currentMode = window.matchMedia("(max-width: 767px)").matches
        ? "mobile"
        : "desktop";

    if (certificatesSwiper && certificatesSwiperMode === currentMode) {
        if (typeof certificatesSwiper.update === "function") {
            certificatesSwiper.update();
        }

        return;
    }

    if (certificatesSwiper && typeof certificatesSwiper.destroy === "function") {
        certificatesSwiper.destroy(true, true);
        certificatesSwiper = null;
    }

    const section = swiperElement.closest(".relative");
    const nextEl = section ? section.querySelector(".certificates-next") : null;
    const prevEl = section ? section.querySelector(".certificates-prev") : null;

    const swiperOptions = currentMode === "mobile"
        ? {
              slidesPerView: "auto",
              spaceBetween: 15,
              grabCursor: true,
              watchOverflow: true,
              roundLengths: true,
              speed: 600,
          }
        : {
              slidesPerView: 1,
              spaceBetween: 0,
              navigation: {
                  nextEl,
                  prevEl,
              },
              breakpoints: {
                  640: {
                      slidesPerView: 2,
                      spaceBetween: 0,
                  },
                  768: {
                      slidesPerView: 3,
                      spaceBetween: 0,
                  },
              },
          };

    certificatesSwiper = new window.Swiper(swiperElement, swiperOptions);
    certificatesSwiperMode = currentMode;

    if (!window.__certificatesSwiperRefreshBound) {
        window.addEventListener("certificates:refresh", () => {
            if (certificatesSwiper && typeof certificatesSwiper.update === "function") {
                certificatesSwiper.update();
            }
        });

        let certificatesResizeFrame = null;

        window.addEventListener("resize", () => {
            if (certificatesResizeFrame !== null) {
                return;
            }

            certificatesResizeFrame = window.requestAnimationFrame(() => {
                certificatesResizeFrame = null;
                initCertificatesSwiper();
            });
        });

        window.__certificatesSwiperRefreshBound = true;
    }
};

const initSharedScripts = () => {
    initProductSectionCarousels();
    initAboutTabs();
    initCertificatesSwiper();
};

document.addEventListener("DOMContentLoaded", initSharedScripts);

export { initSharedScripts };
