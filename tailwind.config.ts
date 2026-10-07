import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        perla: "#FFFFFF",
        porcelana: "#FFF6F9",
        polvo: "#FBE3EC",
        rosa: "#DE4176",
        frambuesa: "#B03366",
        nacar: "rgba(224, 69, 123, 0.14)",
      },
      boxShadow: {
        luxury: "0 24px 48px -24px rgba(176, 51, 102, 0.25)",
      },
      fontFamily: {
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
