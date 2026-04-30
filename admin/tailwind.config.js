/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: { 300: '#DDB85A', 400: '#CFA033', 500: '#B8862A' },
        ink: { 900: '#0B0B0B', 800: '#171717', 700: '#262626' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
