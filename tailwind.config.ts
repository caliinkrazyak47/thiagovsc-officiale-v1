import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        petal: "var(--petal)",
        blush: "var(--blush)",
        rose: "var(--rose)",
        brand: "var(--brand)",
        berry: "var(--berry)",
        champagne: "var(--champagne)",
        line: "var(--line)",
        surface: "var(--surface)",
      },
      boxShadow: {
        luxury: "0 30px 60px -25px rgba(163, 40, 92, 0.35)",
        darkLuxury: "0 30px 60px -25px rgba(0, 0, 0, 0.45)",
      },
      fontFamily: {
        panchang: ["'Panchang'", "var(--font-panchang)", "sans-serif"],
        clash: ["'Clash Display'", "var(--font-clash)", "sans-serif"],
        bodoni: ["'Bodoni Moda'", "serif"],
        jost: ["'Jost'", "sans-serif"],
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
