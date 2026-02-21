/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/test/index.html", "./src/test/**/*.ts"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef9fa",
          100: "#d5f0f3",
          200: "#aee1e7",
          300: "#7accd6",
          400: "#45b3c0",
          500: "#239aaa",
          600: "#1e7d8b",
          700: "#1d6572",
          800: "#1e525e",
          900: "#1c444e",
          950: "#0d2c33",
        },
      },
    },
  },
  plugins: [],
};
