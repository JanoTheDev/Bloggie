/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "pl-100": "#e0aaff",
        "pl-200": "#c77dff",
        "pl-300": "#9d4edd",
        "pl-400": "#7b2cbf",
        "pl-500": "#5a189a",
        "pl-600": "#3c096c",
        "pl-700": "#240046",
        "pl-800": "#10002b",
      },
      spacing: {
        114: "30rem",
        128: "32rem",
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};
