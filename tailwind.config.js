/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Paleta INDEX — preencher com as cores oficiais (ver _vault/CORES)
      colors: {
        brand: {
          DEFAULT: '#208AEF',
        },
      },
    },
  },
  plugins: [],
};
