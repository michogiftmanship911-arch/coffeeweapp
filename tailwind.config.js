/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f1f6f2', 100: '#dde9e0', 200: '#bcd3c2', 300: '#8fb49a', 400: '#5f9071',
          500: '#3f7355', 600: '#2d5a42', 700: '#234835', 800: '#1b3a2b', 900: '#12281d', 950: '#0a1a12',
        },
        gold: {
          50: '#fdf9ec', 100: '#faf0cc', 200: '#f4de97', 300: '#ecc85f', 400: '#e2b13a',
          500: '#c9962a', 600: '#a87821', 700: '#865c1e', 800: '#6e4a1f', 900: '#5c3d1d',
        },
        cream: { 50: '#fffdf8', 100: '#fbf7ee', 200: '#f4ecda', 300: '#e9dcbd' },
        earth: { 400: '#a98467', 500: '#8b6a4f', 600: '#6f5240', 700: '#573f31', 800: '#3e2d23', 900: '#2a1e17' },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(6, 20, 12, 0.38), inset 0 1px 0 0 rgba(255, 255, 255, 0.22)',
        'glass-lg': '0 24px 60px -12px rgba(6, 20, 12, 0.55), inset 0 1px 0 0 rgba(255, 255, 255, 0.28)',
        gold: '0 8px 30px rgba(201, 150, 42, 0.35)',
        'gold-lg': '0 14px 40px rgba(201, 150, 42, 0.5)',
      },
    },
  },
  plugins: [],
}
