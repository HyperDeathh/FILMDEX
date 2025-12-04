/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./constants/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#001400",
        secondary: "#ffed4a",
        danger: "#e3342f",
        dark: {
          100: "#1a1a2e",
          200: "#221f3d",
          300: "#2d2a4a",
        },
        light: {
          100: "#E0E0E0",
          200: "#A0A0A0",
        },
        accent: "#ab8bff",
      },
    },
  },
  plugins: [],
};
