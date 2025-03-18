import type { Config } from "tailwindcss"
const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "neon-green": {
          DEFAULT: "rgb(77, 255, 77)",
          50: "rgba(77, 255, 77, 0.05)",
          100: "rgba(77, 255, 77, 0.1)",
          200: "rgba(77, 255, 77, 0.2)",
          300: "rgba(77, 255, 77, 0.3)",
          400: "rgba(77, 255, 77, 0.4)",
          500: "rgba(77, 255, 77, 0.5)",
          600: "rgba(77, 255, 77, 0.6)",
          700: "rgba(77, 255, 77, 0.7)",
          800: "rgba(77, 255, 77, 0.8)",
          900: "rgba(77, 255, 77, 0.9)",
        },
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
      },
      fontFamily: {
        mono: ["var(--font-vt323)", "monospace"],
        display: ["var(--font-major-mono)", "monospace"],
      },
      animation: {
        glitch: "glitch 0.2s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config

