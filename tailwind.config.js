/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "p1": "#0A4D68",
        "p2": "#088395",
        "p3": "#05BFDB",
        "p4": "#00FFCA",
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}