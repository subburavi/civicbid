/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#F5B800',
          light: '#FFD740',
          dark: '#D4A000',
        },
        dark: '#1A1A1A',
        surface: '#F8F9FD',
        muted: '#6B7280',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
        float: '0 8px 32px rgba(0,0,0,0.12)',
        glow: '0 0 0 3px rgba(245,184,0,0.2)',
      },
    },
  },
  plugins: [],
}

