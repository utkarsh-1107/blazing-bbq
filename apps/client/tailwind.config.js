/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E53935',
          50: '#fce8e8',
          100: '#fbd0d0',
          200: '#f8a8a8',
          300: '#f47a7a',
          400: '#ef4c4c',
          500: '#E53935',
          600: '#d32f2f',
          700: '#b71c1c',
          800: '#8e0000',
          900: '#5c0000',
        },
        secondary: '#FFFFFF',
        accent: '#F5F5F5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
