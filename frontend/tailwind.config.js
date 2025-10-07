/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#003F66',
          DEFAULT: '#002A45',
          dark: '#001B2D',
        },
        accent: {
          light: '#FFD358',
          DEFAULT: '#FFB915',
          dark: '#E6A800',
        },
        'background-dark': '#002A45',
        'background-light': '#E6F0FA',
        'text-main': '#1E1E1E',
        'text-secondary': '#4A4A4A',
      },
    },
  },
  plugins: [],
}
