/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0047FF',
          50: '#E5EDFF',
          100: '#CCE0FF', 
          200: '#99C0FF',
          300: '#66A1FF',
          400: '#3381FF',
          500: '#0047FF',
          600: '#0039CC',
          700: '#002B99',
          800: '#001C66',
          900: '#000E33',
          950: '#00071A',
        },
        secondary: {
          DEFAULT: '#00CFFD',
          50: '#E5F9FF',
          100: '#CCF4FF',
          200: '#99E9FF', 
          300: '#66DEFF',
          400: '#33D3FE',
          500: '#00CFFD',
          600: '#00A5CA',
          700: '#007C98',
          800: '#005265',
          900: '#002933',
          950: '#00141A',
        },
        accent: {
          DEFAULT: '#7000FF',
          50: '#F2E5FF',
          100: '#E5CCFF',
          200: '#CB99FF',
          300: '#B166FF', 
          400: '#9633FF',
          500: '#7000FF',
          600: '#5A00CC',
          700: '#440099',
          800: '#2D0066',
          900: '#170033',
          950: '#0B001A',
        },
        success: '#00C875',
        warning: '#FFCB47',
        error: '#FF5151',
        background: {
          light: '#FFFFFF',
          DEFAULT: '#091d3d',  // Deep navy blue - MAIN THEME COLOR
          dark: '#091d3d',
        },
        surface: {
          light: '#F0F4FF',   // Very light blue tint
          DEFAULT: '#111827', // Dark gray for cards/sections
          dark: '#111827',
        },
        foreground: {
          light: '#0A101F',   // Nearly black for light backgrounds
          DEFAULT: '#F4F7FF', // Off-white for dark backgrounds
          dark: '#F4F7FF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
        signature: ['Dancing Script', 'cursive'],
        mono: ['JetBrains Mono', 'monospace'],
        garet: ['Garet', 'sans-serif'],
        bitter: ['Bitter', 'serif'],
        neue: ['Neue Einstellung', 'sans-serif'],
        noticia: ['Noticia Text', 'serif'],
        ubuntu: ['Ubuntu', 'sans-serif'],
      },
      fontWeight: {
        ultralight: '100',
        thin: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
      fontSize: {
        'hero': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '1.1' }],
        'section': ['clamp(2rem, 5vw, 4rem)', { lineHeight: '1.2' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 71, 255, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(0, 207, 253, 0.5)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
