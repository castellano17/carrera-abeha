/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: "#1a2e1a",
        "forest-light": "#2d5a2d",
      },
    },
  },
  plugins: [],
};
