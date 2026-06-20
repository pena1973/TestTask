import type { Config } from "tailwindcss";

// Конфигурация Tailwind хранит цвета, шрифты и тени из макета в одном месте.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f6efd9",
        ink: "#17140f",
        muted: "#6d5f4c",
        navy: "#2f406d",
        teal: "#4b8f82",
        terracotta: "#bf6f4f",
        ochre: "#d2a33b",
        sand: "#eadfc1",
        line: "#1f1a14"
      },
      fontFamily: {
        display: ["var(--font-display)", "Arial Narrow", "Impact", "sans-serif"],
        condensed: ["Arial Narrow", "Roboto Condensed", "Arial", "sans-serif"],
        sans: ["var(--font-body)", "Arial", "sans-serif"]
      },
      boxShadow: {
        sketch: "3px 3px 0 rgba(23, 20, 15, 0.35)"
      },
      borderWidth: {
        3: "3px"
      }
    }
  },
  plugins: []
};

export default config;
