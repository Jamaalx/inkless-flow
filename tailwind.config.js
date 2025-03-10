/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#243B55',
        'primary-cyan': '#48CAE4',
        'accent-orange': '#FF7E47',
        'accent-purple': '#9381FF',
        'success': '#4CAF50',
        'gray': '#708090',
        'bg-light': '#F8FAFC',
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'var(--font-lato)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}