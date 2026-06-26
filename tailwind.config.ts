import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#020617",
        surface: "#0f172a",
        border: "#1e293b",
        primary: "#22c55e",
        "primary-hover": "#16a34a",
        danger: "#ef4444",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
