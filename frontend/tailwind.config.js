/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FBF6E9',
          100: '#F5EAC8',
          200: '#EBD494',
          300: '#DDB85A',
          400: '#CFA033',
          500: '#B8862A',
          600: '#9A6E22',
          700: '#75541B',
          800: '#523B14',
          900: '#33240C',
        },
        cream: {
          50: '#FBF8F1',
          100: '#F5EFE0',
          200: '#EFE6CE',
        },
        ink: {
          900: '#0B0B0B',
          800: '#171717',
          700: '#262626',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.25em',
      },
    },
  },
  plugins: [],
};
