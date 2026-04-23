/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./*.html",
        "./about/**/*.html",
        "./contact/**/*.html",
        "./dich-vu-khach-hang/**/*.html",
        "./factory/**/*.html",
        "./faq/**/*.html",
        "./news/**/*.html",
        "./products/**/*.html",
        "./projects/**/*.html",
        "./showroom/**/*.html",
        "./assets/js/**/*.js",
        "./components/**/*.html",
        "./home/partials/**/*.html",
        "./news/partials/**/*.html",
        "./factory/partials/**/*.html",
        "./projects/partials/**/*.html",
        "./dich-vu-khach-hang/partials/**/*.html",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#2E2F2A",
                secondary: "#C76E00",
                textPrimary: "#2E2F2A",
                neutral: {
                    1: "#EFE4DE",
                    2: "#F5EDE7",
                },
                background: {
                    primary: "#FFF",
                    secondary: "#EFE4DE",
                },
            },
            fontFamily: {
                archivo: ['"Archivo"', "sans-serif"],
                italianno: ['"Italianno"', "cursive"],
                arima: ['"Arima"', "system-ui"],
                arbutus: ['"Arbutus Slab"', "serif"],
                charm: ['"Charm"', "cursive"],
                lavishly: ['"Lavishly Yours"', "cursive"],
                ephesis: ['"Ephesis"', "cursive"],
                carattere: ['"Carattere"', "cursive"],
                advent: ['"Advent Pro"', "sans-serif"],
            },
            keyframes: {
                marquee: {
                    "0%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(-50%)" },
                },
            },
            animation: {
                marquee: "marquee 15s linear infinite",
            },
            order: {
                13: "13",
                14: "14",
                15: "15",
                16: "16",
                17: "17",
                18: "18",
                19: "19",
                20: "20",
            },
        },
    },
    plugins: [],
};
