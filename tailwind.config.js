/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // warm, artisanal handicraft palette
        cream: "#faf5ec",
        sand: "#f0e6d6",
        clay: "#c1614a",
        clayDark: "#a44a35",
        terracotta: "#d98363",
        olive: "#5c6a4a",
        ink: "#221b18",
        espresso: "#17110e",
        gold: "#caa24a",
        goldSoft: "#e6cf95",
        muted: "#8a7f74",
        line: "#e6dccb",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -18px rgba(43,35,32,0.35)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        kenburns: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.1)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        marquee: "marquee 28s linear infinite",
        kenburns: "kenburns 12s ease-out forwards",
      },
    },
  },
  plugins: [],
};
