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
        night: "#0F172A",
      },
      fontFamily: {
        display: ['"Baloo 2"', "system-ui", "sans-serif"],
        body: ['"Nunito"', "system-ui", "sans-serif"],
      },
      keyframes: {
        confetti: {
          "0%": {transform: "translateY(0) rotate(0deg)", opacity: "1"},
          "100%": {transform: "translateY(100vh) rotate(720deg)", opacity: "0"},
        },
        bounce: {
          "0%, 100%": {transform: "scale(0)"},
          "50%": {transform: "scale(1.2)"},
        },
      },
      animation: {
        confetti: "confetti 2s ease-out forwards",
        bounce: "bounce 0.5s ease-in-out",
      },
    },
  },
  plugins: [],
};
