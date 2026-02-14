/** @type {import('tailwindcss').Config} */
export default {
    content: ["./*.html", "./**/index.html", "./src/**/*.{html,js}", "./src/partials/**/*.html"],
    theme: {
        extend: {
            colors: {
                primary: '#2E2F2A',
                secondary: '#C76E00',
                neutral: {
                    1: '#EFE4DE',
                    2: '#F5EDE7',
                },
                background: {
                    primary: '#FFF',
                },
            },
            fontFamily: {
                archivo: ['Archivo', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
