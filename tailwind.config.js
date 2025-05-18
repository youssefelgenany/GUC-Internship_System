/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'guc-blue': '#234B73',
          'guc-orange': '#F08F36',
          'guc-gray': '#C0CEDB',
          'guc-dark-gray': '#8C8C8C',
        },
      },
    },
    plugins: [],
  }