/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'bounce-slow': 'bounce 3s infinite',
        'progress': 'progress 4s linear forwards',
        'appear': 'appear 0.3s ease-out forwards',
        'ping-once': 'ping-once 0.8s ease-out forwards',
        'pulse-subtle': 'pulse-subtle 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        appear: {
          'from': { opacity: '0', transform: 'scale(0.8)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        'ping-once': {
          '0%': { transform: 'scale(0.95)', opacity: '1' },
          '70%': { transform: 'scale(1.1)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
        'pulse-subtle': {
          '0%': { boxShadow: '0 0 0 0 rgba(79, 70, 229, 0.4)' },
          '70%': { boxShadow: '0 0 0 6px rgba(79, 70, 229, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(79, 70, 229, 0)' },
        },
        'float': {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
          '100%': { transform: 'translateY(0px)' },
        },
      }
    },
  },
  plugins: [],
};
