import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        dalda: {
          red: "#C8102E",
          "red-dark": "#A00D24",
          "red-mid": "#E8354F",
          "red-light": "#FBEAED",
          green: "#1F6B2E",
          "green-dark": "#165223",
          "green-mid": "#2D8A41",
          "green-light": "#E8F5EB",
          "green-muted": "#C6E0CB",
          gold: "#F5A800",
          "gold-light": "#FEF7E6",
          white: "#FFFFFF",
          "off-white": "#F6F7F5",
          "gray-50": "#F3F4F2",
          "gray-100": "#E6E7E3",
          "gray-300": "#C4C5C0",
          "gray-400": "#9A9B96",
          "gray-600": "#5A5B57",
          "gray-900": "#18190F"
        }
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem"
      },
      boxShadow: {
        card: "0 18px 40px -28px rgba(24, 25, 15, 0.22)"
      }
    }
  },
  plugins: []
};

export default config;
