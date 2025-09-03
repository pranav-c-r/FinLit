/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  safelist: [
    'from-background-light',
    'to-background',
    'from-primary-light',
    'to-primary',
    'from-secondary-light',
    'to-secondary'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#6eff00', /* Brighter green */
          DEFAULT: '#3dd958',
          dark: '#1a1f2e'
        },
        secondary: {
          light: '#ffdd00', /* Brighter yellow */
          DEFAULT: '#ff9500', /* Orange */
          dark: '#1a1f2e'
        },
        tertiary: {
          light: '#00e1ff', /* Cyan */
          DEFAULT: '#00a3ff', /* Blue */
          dark: '#0066ff'
        },
        background: {
          light: '#1e293b',
          DEFAULT: '#1a1f2e',
          dark: '#111827'
        },
        accent: '#4f5d75'
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slower': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(to right, #58cc02, #2fa946)',
        'gradient-background': 'linear-gradient(to bottom right, #1a1f2e, #1a1f2e, #111827)'
      }
    },
  },
  plugins: [],
}
