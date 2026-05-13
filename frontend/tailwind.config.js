// Tailwind config
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FFC100",
        "primary-light": "#FFD633",
        "primary-dark": "#E6A800",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "24px",
        xl: "32px",
      },
    },
  },
  plugins: [],
};
