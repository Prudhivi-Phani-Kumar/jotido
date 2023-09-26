/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "dark-mainBackgroundColor": '#0D1117',
        "dark-columnBackgroundColor": '#161C22',
        "light-mainBackgroundColor": "lightsteelblue",
        "light-columnBackgroundColor": "#e0f0ea"

      }
    },
  },
  plugins: [],
}

