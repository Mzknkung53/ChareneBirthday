import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#FFF7FA',
          100: '#FFECF4',
          200: '#FFD9E8',
          300: '#FFBFD8',
          400: '#FF9FC3',
        },
        rose: {
          500: '#F2739F',
          600: '#DB5589',
          700: '#C2426E',
        },
        sky: {
          100: '#F3F8FE',
          200: '#CFE9FB',
          300: '#A8D8F4',
        },
        cyan: { 400: '#7FD1E6' },
        lavender: { 200: '#E2D9F8', 400: '#C9BCEF' },
        gold: { 500: '#DFB964' },
        cream: '#FFF9F0',
        pinkwhite: '#FFFBFD',
        ink: {
          900: '#4A3B47',
          700: '#5C4B57',
          500: '#6C5C68',
          300: '#96858F',
        },
        wish: {
          1: '#FFFBFD',
          2: '#FFF6FA',
          3: '#FBF7FF',
          4: '#F5FAFF',
          5: '#FFFCF7',
        },
      },
      fontFamily: {
        display: ['var(--font-mali)', 'cursive'],
        ui: ['var(--font-prompt)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      borderRadius: { card: '20px', feature: '24px', field: '16px', special: '32px' },
      boxShadow: {
        soft: '0 6px 18px rgba(197,138,168,.12)',
        card: '0 10px 30px rgba(197,138,168,.14)',
        lift: '0 18px 44px rgba(180,126,158,.22)',
        glow: '0 8px 24px rgba(242,115,159,.34)',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(.22,.61,.36,1)',
        glide: 'cubic-bezier(.16,.84,.44,1)',
      },
      maxWidth: { container: '1160px', reading: '680px' },
    },
  },
  plugins: [],
};

export default config;
