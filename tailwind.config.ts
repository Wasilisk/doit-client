/** @type {import('tailwindcss').Config} */
module.exports = {
    important: true,
    content: [
        './app/components/**/*.{vue,ts}',
        './app/layouts/**/*.{vue,ts}',
        './app/pages/**/*.{vue,ts}',
        './app/app.vue',
        './app/**/*.vue',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}