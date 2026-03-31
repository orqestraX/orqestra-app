import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Orqestra Brand Palette
        orq: {
          bg:        '#070D09',   // Near-black canvas
          surface:   '#0E1A11',   // Card / panel
          elevated:  '#162219',   // Elevated surface
          border:    '#1E3326',   // Subtle borders
          green:     '#22C55E',   // Primary emerald CTA
          'green-dark': '#16A34A',
          'green-dim': '#14532D', // Muted green bg
          gold:      '#F59E0B',   // Amber / premium accent
          'gold-dim': '#78350F',  // Gold muted bg
          text:      '#F0FDF4',   // Near-white primary text
          'text-2':  '#A3B5AA',   // Secondary text
          'text-3':  '#6B8070',   // Muted text
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'dot-grid': 'radial-gradient(circle, #22C55E15 1px, transparent 1px)',
        'hero-glow': 'radial-gradient(ellipse 80% 60% at 50% -10%, #16532D55, transparent)',
        'gold-glow': 'radial-gradient(ellipse 60% 40% at 50% 110%, #F59E0B15, transparent)',
      },
      backgroundSize: {
        'dot-40': '40px 40px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
