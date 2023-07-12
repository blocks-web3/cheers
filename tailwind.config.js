/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "footer-texture": "url('/images/background.png')",
      },
    },
    screens: {
      sm: { max: "560px" },
      md: { max: "768px" },
      tb: { max: "960px" },
    },
  },
  plugins: [],
};
