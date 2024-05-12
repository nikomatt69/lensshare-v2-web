/** @type { import('@storybook/react').Preview } */
/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
import '@lensshare/ui/tailwind.config.js';
import '@lensshare/ui/styles.css' // replace with the name of your tailwind css file
const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};


module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          '50': '#eff6ff',
          '100': '#dbeafe',
          '200': '#bfdbfe',
          '300': '#93c5fd',
          '400': '#60a5fa',
          '500': '#3b82f6',
          '600': '#2563eb',
          '700': '#1d4ed8',
          '800': '#1e40af',
          '900': '#1e3a8a',
          '950': '#172554'
        },
        gray: colors.zinc,
        green: colors.emerald
      }
    }
  },
  variants: { extend: {} }
};



export default preview;
