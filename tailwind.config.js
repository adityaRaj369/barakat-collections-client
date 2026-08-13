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
        // Marketplace palette: indigo brand + orange CTA + white/gray
        cream: "#f4f6fb", // light gray page background
        sand: "#eaeef7", // subtle panels
        peach: "#eef2fb", // light blue tint
        clay: "#ef6c2e", // primary orange CTA
        clayDark: "#d4571c",
        terracotta: "#f59a72",
        forest: "#26408b", // indigo brand (header/footer/hero)
        forestDark: "#1c3068",
        blue: "#2f6fed", // link / secondary
        teal: "#0a9d6e", // "Get Best Price" green
        olive: "#0a9d6e",
        sage: "#5b8f76",
        ink: "#232733", // slate text
        espresso: "#161a26",
        gold: "#f4b400",
        goldSoft: "#ffd66b",
        muted: "#6b7280",
        line: "#e2e7f1",
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
