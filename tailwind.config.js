/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#0B0C10',
          light: '#1F2833',
          dark: '#050507',
        },
        'cyber-pink': {
          DEFAULT: '#F72585',
          light: '#FF479C',
          dark: '#B5175E',
        },
        'neon-mint': {
          DEFAULT: '#00F5D4',
          light: '#33F7D0',
          dark: '#00B39B',
        },
        'electric-indigo': {
          DEFAULT: '#4361EE',
          light: '#6B83FF',
        },
        glass: {
          white: 'rgba(255,255,255,0.07)',
          border: 'rgba(255,255,255,0.1)',
          highlight: 'rgba(255,255,255,0.3)',
          hover: 'rgba(255,255,255,0.12)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '40px',
      },
      backdropBlur: {
        glass: '24px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0,0,0,0.5)',
        glow: '0 0 30px rgba(247,37,133,0.4)',
        'glow-mint': '0 0 30px rgba(0,245,212,0.4)',
      },
      animation: {
        'aurora': 'aurora 15s ease infinite alternate',
      },
      keyframes: {
        aurora: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
};
