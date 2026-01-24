/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'blob-float': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(12px, -12px) scale(1.03)' },
        },
        'pin-pulse': {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '0.35' },
        },
      },
      animation: {
        'blob-float': 'blob-float 8s ease-in-out infinite',
        'blob-float-slow': 'blob-float 12s ease-in-out infinite',
        'pin-pulse': 'pin-pulse 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}