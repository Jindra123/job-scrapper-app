import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#2563EB",
          light: "#3B82F6",
        },
        secondary: {
          DEFAULT: "#F3F4F6",
          dark: "#E5E7EB",
        },
        accent: {
          DEFAULT: "#10B981",
          light: "#34D399",
        },
        text: {
          DEFAULT: "#1F2937",
          light: "#6B7280",
        },
        destructive: {
          DEFAULT: "#EF4444",
          light: "#F87171",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
