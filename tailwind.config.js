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
        // ShopEase palette: deep green + orange + peach on white
        cream: "#ffffff", // page background (white)
        sand: "#f6efe7", // subtle panel
        peach: "#fdeee1", // peach panels (trust strip / deal card)
        clay: "#e8622c", // primary orange CTA
        clayDark: "#cf5322",
        terracotta: "#f2a07f",
        forest: "#21402f", // deep green (hero/newsletter/footer/utility)
        forestDark: "#173121",
        blue: "#21402f", // (legacy alias) → green
        teal: "#21402f",
        olive: "#21402f",
        sage: "#3c5c48",
        ink: "#20201c", // near-black text
        espresso: "#14140f",
        gold: "#e8622c",
        goldSoft: "#f4a06f",
        muted: "#8a8579",
        line: "#ece7df",
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
