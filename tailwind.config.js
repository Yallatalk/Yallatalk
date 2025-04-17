/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",            // ✅ مهم لملف index.html في الجذر
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
