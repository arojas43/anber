import type { Config } from 'tailwindcss'

export default {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: '#E5E5E5',
        input: '#E5E5E5',
        ring: '#FF85A1',
        background: '#FFFFFF',
        foreground: '#2D2D2D',
        primary: {
          50: '#FFF5F7',
          100: '#FFE5EC',
          200: '#FFCCD9',
          300: '#FFB5C5',
          400: '#FF9EB2',
          500: '#FF85A1',
          600: '#FF6B8E',
          700: '#E85076',
          800: '#C93D5F',
          900: '#A02E4A',
          DEFAULT: '#FF85A1',
          foreground: '#FFFFFF',
        },
        secondary: {
          50: '#FFF9FB',
          100: '#FFF0F5',
          200: '#FFE5EE',
          300: '#FFDEE9',
          400: '#FFD4E2',
          500: '#FFC8DD',
          600: '#FFB3CF',
          700: '#FF9EC2',
          800: '#FF85B5',
          900: '#E5699A',
          DEFAULT: '#FFC8DD',
          foreground: '#2D2D2D',
        },
        accent: {
          50: '#FFF7F9',
          100: '#FFECF1',
          200: '#FFD9E5',
          300: '#FFC5D9',
          400: '#FFB5CD',
          500: '#FFA6C1',
          600: '#FF92B5',
          700: '#FF7AA2',
          800: '#E5618A',
          900: '#C94F73',
          DEFAULT: '#FFA6C1',
          foreground: '#2D2D2D',
        },
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#666666',
          700: '#525252',
          800: '#404040',
          900: '#2D2D2D',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F5F5F5',
          foreground: '#737373',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#2D2D2D',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#2D2D2D',
        },
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        float: 'float 3s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} satisfies Config