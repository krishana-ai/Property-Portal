import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4f46e5", // indigo-600
          50: "#eef2ff",
          100: "#e0e7ff",
          600: "#4f46e5",
          700: "#4338ca",
        },
        success: {
          DEFAULT: "#059669", // emerald-600
          50: "#ecfdf5",
          600: "#059669",
        },
        warning: {
          DEFAULT: "#d97706", // amber-600
          50: "#fffbeb",
          600: "#d97706",
        },
        danger: {
          DEFAULT: "#dc2626", // red-600
          50: "#fef2f2",
          600: "#dc2626",
        },
        info: {
          DEFAULT: "#0284c7", // sky-600
          50: "#f0f9ff",
          600: "#0284c7",
        },
        // Public site palette — deep ink surfaces with a restrained brass accent.
        ink: {
          DEFAULT: "#0B1120",
          950: "#070B16",
          900: "#0B1120",
          800: "#131B2E",
          700: "#1F2A44",
          600: "#34405C",
        },
        brass: {
          DEFAULT: "#C8A15E",
          100: "#F5ECDB",
          200: "#EAD8B4",
          300: "#DDBF86",
          400: "#D2AE6F",
          500: "#C8A15E",
          600: "#A9823F",
          700: "#86652F",
        },
        sand: {
          DEFAULT: "#F7F4EE",
          50: "#FCFBF8",
          100: "#F7F4EE",
          200: "#EDE7DB",
          300: "#DDD4C3",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      },
    },
  },
};

export default config;
