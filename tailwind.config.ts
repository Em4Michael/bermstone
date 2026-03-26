import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans:    ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0B1F3A 0%, #1E5FBE 50%, #3B9EE0 100%)',
      },
      boxShadow: {
        card:      '0 4px 24px rgba(11,31,58,0.10)',
        'card-lg': '0 8px 40px rgba(11,31,58,0.16)',
      },
      keyframes: {
        fadeUp:  { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        shimmer:   'shimmer 2s infinite',
      },
    },
  },
  plugins: [],
};

export default config;
