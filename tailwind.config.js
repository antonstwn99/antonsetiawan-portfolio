/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          heading: ['"Clash Display"', 'sans-serif'],
          body: ['"Plus Jakarta Sans"', 'sans-serif'],
        },
        colors: {
          primary: '#143DED',
          dark: '#05070D',
          'secondary-dark': '#080D18',
          white: '#FFFFFF',
        },
      },
    },
    plugins: [],
  }