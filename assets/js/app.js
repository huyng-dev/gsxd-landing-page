const initProductSectionCarousels = () => {
    document.querySelectorAll("[data-product-section]").forEach((section) => {
        if (section.dataset.productCarouselInitialized === "true") {
            return;
        }

        const swiperElement = section.querySelector("[data-product-carousel-swiper]");
        const carousel = section.querySelector("[data-product-carousel]");
        const slides = Array.from(section.querySelectorAll("[data-product-slide]"));
        const dots = Array.from(section.querySelectorAll("[data-product-dot]"));

        if (swiperElement) {
            const paginationElement = section.querySelector(
                "[data-product-swiper-pagination]"
            );

            if (
                typeof window.Swiper !== "function" ||
                slides.length === 0 ||
                !paginationElement
            ) {
                return;
            }

            section.dataset.productCarouselInitialized = "true";

            const syncSwiperDots = (swiperInstance) => {
                const paginationDots = Array.from(
                    paginationElement.querySelectorAll(".product-section-dot")
                );

                paginationDots.forEach((dot, dotIndex) => {
                    const isActive = dotIndex === swiperInstance.realIndex;
                    dot.classList.toggle("bg-[#C76E00]", isActive);
                    dot.classList.toggle("bg-[#C76E00]/30", !isActive);
                    dot.setAttribute("aria-current", isActive ? "true" : "false");
                });
            };

            new window.Swiper(swiperElement, {
                slidesPerView: 1,
                spaceBetween: 0,
                speed: 600,
                autoHeight: true,
                watchOverflow: true,
                pagination: {
                    el: paginationElement,
                    clickable: true,
                    renderBullet: (index, className) =>
                        `<button class="product-section-dot h-2 w-2 rounded-full bg-[#C76E00]/30 mx-[3.5px] ${className}" type="button" aria-label="Slide ${index + 1}" aria-current="false"></button>`,
                },
                on: {
                    init() {
                        syncSwiperDots(this);
                    },
                    slideChange() {
                        syncSwiperDots(this);
                    },
                },
            });

            return;
        }

        if (!carousel || slides.length === 0 || dots.length === 0) {
            return;
        }

        section.dataset.productCarouselInitialized = "true";

        const setActiveDot = (activeIndex) => {
            dots.forEach((dot, dotIndex) => {
                const isActive = dotIndex === activeIndex;
                dot.classList.toggle("bg-secondary", isActive);
                dot.classList.toggle("bg-[#C76E00]/30", !isActive);
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
let mobileFloatingActionsInitialized = false;

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

const initMobileFloatingActions = () => {
    if (mobileFloatingActionsInitialized) {
        return;
    }

    const backToTopButton = document.querySelector("[data-back-to-top]");

    if (!backToTopButton) {
        return;
    }

    mobileFloatingActionsInitialized = true;

    const toggleBackToTop = () => {
        const isMobile = window.matchMedia("(max-width: 767px)").matches;
        const shouldShow = isMobile && window.scrollY > 260;

        backToTopButton.classList.toggle("opacity-0", !shouldShow);
        backToTopButton.classList.toggle("translate-y-2", !shouldShow);
        backToTopButton.classList.toggle("pointer-events-none", !shouldShow);
    };

    backToTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", toggleBackToTop, { passive: true });
    window.addEventListener("resize", toggleBackToTop);

    toggleBackToTop();
};

const initMobileScrollIndicators = () => {
    document.querySelectorAll(".mobile-scroll-visible").forEach((scroller) => {
        if (scroller.dataset.scrollIndicatorInit === "true") {
            return;
        }
        scroller.dataset.scrollIndicatorInit = "true";

        const track = document.createElement("div");
        track.className = "scroll-indicator-track";
        const thumb = document.createElement("div");
        thumb.className = "scroll-indicator-thumb";
        track.appendChild(thumb);
        scroller.parentNode.insertBefore(track, scroller.nextSibling);

        const updateThumb = () => {
            const scrollWidth = scroller.scrollWidth;
            const clientWidth = scroller.clientWidth;
            if (scrollWidth <= clientWidth) {
                track.style.display = "none";
                return;
            }
            track.style.display = "";
            const trackWidth = track.clientWidth;
            const thumbWidth = Math.max(30, (clientWidth / scrollWidth) * trackWidth);
            const maxScrollLeft = scrollWidth - clientWidth;
            const scrollRatio = scroller.scrollLeft / maxScrollLeft;
            const thumbLeft = scrollRatio * (trackWidth - thumbWidth);
            
            thumb.style.width = thumbWidth + "px";
            if (!thumb.classList.contains("is-dragging")) {
                thumb.style.left = thumbLeft + "px";
            }
        };

        let scrollFrame = null;
        scroller.addEventListener("scroll", () => {
            if (scrollFrame !== null) return;
            scrollFrame = requestAnimationFrame(() => {
                scrollFrame = null;
                updateThumb();
            });
        }, { passive: true });

        window.addEventListener("resize", updateThumb);
        // Initial update after layout settles
        requestAnimationFrame(updateThumb);

        // Dragging logic
        let isDragging = false;
        let startX;
        let startScrollLeft;

        const onMouseMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            const trackWidth = track.clientWidth;
            const thumbWidth = thumb.clientWidth;
            const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
            
            const deltaX = e.pageX - startX;
            const scrollRatio = deltaX / (trackWidth - thumbWidth);
            
            scroller.scrollLeft = startScrollLeft + (scrollRatio * maxScrollLeft);
            
            // Immediately update thumb position for smooth dragging
            const newThumbLeft = (scroller.scrollLeft / maxScrollLeft) * (trackWidth - thumbWidth);
            thumb.style.left = newThumbLeft + "px";
        };

        const onMouseUp = () => {
            if (!isDragging) return;
            isDragging = false;
            thumb.style.transition = ""; 
            thumb.classList.remove("is-dragging");
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };

        thumb.addEventListener("mousedown", (e) => {
            e.preventDefault(); 
            isDragging = true;
            startX = e.pageX;
            startScrollLeft = scroller.scrollLeft;
            
            thumb.style.transition = "none"; 
            thumb.classList.add("is-dragging");
            
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
        });

        // Click track to jump
        track.addEventListener("click", (e) => {
            if (e.target === thumb) return;
            
            const trackRect = track.getBoundingClientRect();
            const clickX = e.clientX - trackRect.left;
            const trackWidth = track.clientWidth;
            const thumbWidth = thumb.clientWidth;
            
            const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
            const scrollRatio = (clickX - thumbWidth / 2) / (trackWidth - thumbWidth);
            
            scroller.scrollTo({
                left: Math.max(0, Math.min(scrollRatio * maxScrollLeft, maxScrollLeft)),
                behavior: "smooth"
            });
        });
    });
};

const initSharedScripts = () => {
    initProductSectionCarousels();
    initAboutTabs();
    initCertificatesSwiper();
    initMobileFloatingActions();
    initMobileScrollIndicators();
};

document.addEventListener("DOMContentLoaded", initSharedScripts);

export { initSharedScripts };
