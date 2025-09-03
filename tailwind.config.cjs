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
        accent: '#4f5d75',
        neon: '#6eff00',
        electric: '#00ffff',
        plasma: '#ff00ff',
        solar: '#ffaa00',
        surface: '#1e2a3a'
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slower': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'neon-pulse': 'neonPulse 3s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'spin-slow': 'spin 3s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'delay-100': 'fadeInUp 0.6s ease-out 0.1s forwards',
        'delay-200': 'fadeInUp 0.6s ease-out 0.2s forwards',
        'delay-300': 'fadeInUp 0.6s ease-out 0.3s forwards',
        'delay-500': 'fadeInUp 0.6s ease-out 0.5s forwards',
        'delay-1000': 'fadeInUp 0.6s ease-out 1s forwards',
        'delay-1500': 'fadeInUp 0.6s ease-out 1.5s forwards'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        glow: {
          '0%': { textShadow: '0 0 5px #6eff00, 0 0 10px #6eff00, 0 0 15px #6eff00' },
          '100%': { textShadow: '0 0 10px #6eff00, 0 0 20px #6eff00, 0 0 30px #6eff00' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-100% 0' },
          '100%': { backgroundPosition: '100% 0' }
        },
        neonPulse: {
          '0%, 100%': { boxShadow: '0 0 5px #6eff00, 0 0 10px #6eff00, 0 0 15px #6eff00' },
          '50%': { boxShadow: '0 0 10px #6eff00, 0 0 20px #6eff00, 0 0 30px #6eff00, 0 0 40px #6eff00' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(to right, #6eff00, #3dd958)',
        'gradient-secondary': 'linear-gradient(to right, #ffdd00, #ff9500)',
        'gradient-tertiary': 'linear-gradient(to right, #00e1ff, #00a3ff)',
        'gradient-background': 'linear-gradient(to bottom right, #151a27, #171c28, #0f1420)',
        'gradient-neon': 'linear-gradient(45deg, #6eff00, #00ffff, #ff00ff)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(110, 255, 0, 0.4), transparent)'
      },
      boxShadow: {
        'neon': '0 0 5px #6eff00, 0 0 10px #6eff00, 0 0 15px #6eff00',
        'neon-yellow': '0 0 5px #ffdd00, 0 0 10px #ffdd00, 0 0 15px #ffdd00',
        'neon-cyan': '0 0 5px #00e1ff, 0 0 10px #00e1ff, 0 0 15px #00e1ff',
        'glow-sm': '0 0 10px rgba(110, 255, 0, 0.3)',
        'glow': '0 0 20px rgba(110, 255, 0, 0.4)',
        'glow-lg': '0 0 30px rgba(110, 255, 0, 0.5)'
      }
    },
  },
  plugins: [],
}
