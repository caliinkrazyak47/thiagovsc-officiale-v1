import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#050505", // Negro profundo (Studio Linear vibe)
          neon: "#DBFF00", // Amarillo/Verde Neón
          pink: "#FF0055", // Acento rosa neón
          light: "#F4F4F4",
        },
      },
      fontFamily: {
        display: ["var(--font-revoltosa-serif)", "Impact", "sans-serif"],
        sans: ["var(--font-revoltosa-sans)", "Inter", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
