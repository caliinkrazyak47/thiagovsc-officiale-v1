import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pink: {
          DEFAULT: "var(--pink)",
          solid: "#DE4176",
        },
        white: {
          DEFAULT: "#FFFFFF",
        },
        blush: {
          DEFAULT: "#FFF4F7",
        },
        ink: {
          DEFAULT: "#3B0D22",
        },
      },
      boxShadow: {
        editorial: "0 30px 60px -20px rgba(59, 13, 34, 0.18)",
      },
      fontFamily: {
        display: ["'Archivo Black'", "sans-serif"],
        serif: ["'Instrument Serif'", "serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        sans: ["'Inter'", "sans-serif"],
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
