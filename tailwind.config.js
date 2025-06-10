/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff8f1',
          100: '#ffe9d7',
          200: '#ffd3ad',
          300: '#ffb678',
          400: '#ff9143',
          500: '#ff7e1d',
          600: '#ff6200',
          700: '#cc4e00',
          800: '#a13e00',
          900: '#823400',
          950: '#461a00',
        },
        secondary: {
          50: '#f3faf4',
          100: '#e3f5e6',
          200: '#c8e9ce',
          300: '#9fd6a8',
          400: '#77bf85',
          500: '#4CAF50',
          600: '#3d8c40',
          700: '#327035',
          800: '#2c592f',
          900: '#254a28',
          950: '#0f2711',
        },
        accent: {
          50: '#e7f9fb',
          100: '#d0f4f6',
          200: '#a6e9ef',
          300: '#70d7e2',
          400: '#2cbcce',
          500: '#00BCD4',
          600: '#0d8fa3',
          700: '#0f7284',
          800: '#135d6c',
          900: '#144d5a',
          950: '#07333e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      },
    },
  },
  plugins: [],
};