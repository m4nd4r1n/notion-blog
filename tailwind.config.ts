import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#2f3437',
      },
      backgroundColor: {
        'table-cell-dark': '#3b4345',
        'bg-color': 'var(--bg-color)',
      },
      borderColor: {
        'table-border-dark': '#666d73',
      },
      fontFamily: {
        suit: ['"SUIT"', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
  darkMode: 'class',
};
export default config;
