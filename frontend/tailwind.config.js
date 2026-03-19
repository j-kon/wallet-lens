/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0c1118',
          soft: '#111824',
          muted: '#182232',
        },
        brand: {
          amber: '#d8a45b',
          sky: '#8eb2c6',
          teal: '#89b7a4',
          rose: '#c9857b',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', '"IBM Plex Sans"', 'ui-sans-serif', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        panel: '0 18px 48px rgba(3, 7, 18, 0.45)',
        halo: '0 0 0 1px rgba(255,255,255,0.06), 0 24px 60px rgba(5, 10, 20, 0.4)',
      },
      backgroundImage: {
        'panel-noise':
          'linear-gradient(180deg, rgba(255,255,255,0.02), transparent), radial-gradient(circle at top, rgba(142,178,198,0.06), transparent 45%)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};
