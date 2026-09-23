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
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      },
    },
  },
};

export default config;
