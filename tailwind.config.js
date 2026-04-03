/** @type {import('tailwindcss').Config} */
export default {
    content: ["./*.html", "./**/index.html", "./src/**/*.{html,js}", "./src/partials/**/*.html"],
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
                    secondary: "#F5EDE7",
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
        },
    },
    plugins: [],
};
