/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7ff",
          100: "#d9ecff",
          200: "#bcdfff",
          300: "#8eccff",
          400: "#58afff",
          500: "#2f90ff",
          600: "#1772f5",
          700: "#125ce0",
          800: "#164bb5",
          900: "#18438f",
        },
        success: { 500: "#16a34a", 600: "#15803d" },
        danger: { 500: "#ef4444", 600: "#dc2626" },
        warn: { 500: "#f59e0b", 600: "#d97706" },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(15, 23, 42, 0.20)",
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(0.96)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseSoft: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: ".7" },
        },
      },
      animation: {
        pop: "pop .25s ease-out",
        slideUp: "slideUp .35s ease-out",
        pulseSoft: "pulseSoft 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
