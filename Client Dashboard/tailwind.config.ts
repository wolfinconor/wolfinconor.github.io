import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FBF5EC",
          tint: "#F3E9D9",
        },
        terracotta: {
          DEFAULT: "#C1704F",
          light: "#E4B49B",
          pale: "#F5E2D9",
        },
        sage: {
          DEFAULT: "#8B9A6B",
          dark: "#5F6B45",
          light: "#DCE3CF",
          pale: "#EDF1E6",
        },
        charcoal: "#3E3630",
        "warm-gray": "#7A6F63",
        line: "#E5DACB",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-source-serif)", "Georgia", "serif"],
      },
      borderRadius: {
        card: "14px",
        pill: "9999px",
      },
    },
  },
  plugins: [],
};
export default config;
