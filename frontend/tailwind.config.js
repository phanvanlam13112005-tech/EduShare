/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // EduShare+ Primary: Deep Blue
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // EduShare+ Secondary: Cyan
        secondary: {
          50:  '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        // EduShare+ AI accent: Purple
        ai: {
          50:  '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: { xs: '2px' },
      animation: {
        'drop-in':    'dropIn 0.25s cubic-bezier(0.16,1,0.3,1)',
        'slide-in':   'slideIn 0.3s cubic-bezier(0.16,1,0.3,1)',
        'fade-up':    'fadeUp 0.5s ease-out both',
        'shimmer':    'shimmer 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        dropIn:  { '0%': { opacity:'0', transform:'scale(0.95) translateY(-8px)' }, '100%': { opacity:'1', transform:'scale(1) translateY(0)' } },
        slideIn: { '0%': { opacity:'0', transform:'translateX(-16px)' },             '100%': { opacity:'1', transform:'translateX(0)' } },
        fadeUp:  { '0%': { opacity:'0', transform:'translateY(20px)' },               '100%': { opacity:'1', transform:'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition:'-200% 0' }, '100%': { backgroundPosition:'200% 0' } },
      },
    },
  },
  plugins: [],
}
