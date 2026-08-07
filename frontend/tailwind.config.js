/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#070809',
          900: '#0B0D10',
          800: '#12151B',
          700: '#1B2028',
          600: '#272E3A',
        },
        granite: {
          dark: '#14161A',
          card: '#1C1F26',
          border: '#2D323E',
          light: '#F4F5F7',
          surface: '#EAECEE',
        },
        silver: {
          100: '#F7F8FA',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          glow: 'rgba(224, 224, 224, 0.15)',
        },
        accent: {
          gold: '#C5A059',
          goldGlow: 'rgba(197, 160, 89, 0.3)',
          platinum: '#E0E0E0',
          bronze: '#8C6239',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Cinzel', 'serif'],
        display: ['Outfit', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', filter: 'blur(20px)' },
          '50%': { opacity: '0.8', filter: 'blur(30px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      backdropBlur: {
        xs: '2px',
        ultra: '24px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'granite-dark': 'linear-gradient(135deg, #0B0D10 0%, #161A22 50%, #0B0D10 100%)',
        'silver-metallic': 'linear-gradient(135deg, #FFFFFF 0%, #D1D5DB 50%, #9CA3AF 100%)',
        'gold-metallic': 'linear-gradient(135deg, #F3E5AB 0%, #C5A059 50%, #996515 100%)',
      }
    },
  },
  plugins: [],
};
