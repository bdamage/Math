/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ocean: "#5CC8FF",
        coral: "#FF7B7B",
        mint: "#6EE7B7",
        sunshine: "#FCD34D",
        night: "#0F172A"
      },
      fontFamily: {
        display: ['"Baloo 2"', "system-ui", "sans-serif"],
        body: ["\"Nunito\"", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
