/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./components/**/*.{html,js}",
    "./sections/**/*.html",
    "./utils/**/*.js",
    "./src/**/*.js",
    "./styles/**/*.css"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#FFF041',
          blue: '#72AEE6',
          black: '#000000',
          gray: '#1A1A1A'
        }
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
