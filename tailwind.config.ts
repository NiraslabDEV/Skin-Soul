import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          DEFAULT: "#2F5D50",
          deep: "#234539",
          soft: "#3a6e60",
        },
        sage: {
          DEFAULT: "#4C8C6F",
          light: "#6BA388",
        },
        mint: {
          DEFAULT: "#A7D7C5",
          soft: "#D6EAE0",
        },
        ivory: "#F5F1EA",
        sand: "#EBE3D6",
        bone: "#FBF8F3",
        ink: "#1A2A24",
        muted: "#6B7770",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Times New Roman", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
