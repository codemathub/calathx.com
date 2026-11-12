/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#bdd849', // Main lime green
          hover: '#749b18', // Button hover green
          accent: '#659a41', // Back-to-top border
          green2: '#8dc11e', // Subscribe button, page header overlay
          green3: '#81d742', // Subscribe hover
          dark: '#232323', // Footer bg
          black: '#000000', // Header nav text / footer top bg
        },
      },
      fontFamily: {
        body: ['Open Sans', 'sans-serif'],
        heading: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

