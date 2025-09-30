/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#A45EE5',
          DEFAULT: '#6A0DAD',
          dark: '#4B097A',
        },
        secondary: {
          light: '#E96B75',
          DEFAULT: '#E63946',
          dark: '#C11F2B',
        },
        accent: {
          light: '#FF7A93',
          DEFAULT: '#FF4D6D',
          dark: '#E82A50',
        },
        'background-dark': '#2B0A3D',
        'background-light': '#F3E8FF',
        'text-main': '#1E1E1E',
        'text-secondary': '#4A4A4A',
      },
    },
  },
  plugins: [],
}
