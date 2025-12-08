/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        hive: '#E31337',
        steem: '#1A5099',
        blurt: '#F05F22',
        dark: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
        }
      }
    },
  },
  plugins: [],
}