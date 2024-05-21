/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: 'rgb(29, 155, 240)'
      },
      fontSize: {
        '14px': '14px',
      },
      fontFamily: {
        live: ["'Jersey 25 Charted'"],

      }
    },
  },
  plugins: [],
};
