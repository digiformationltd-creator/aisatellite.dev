/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: {
          950: '#03050B', // Cosmic Black
          900: '#080D1B', // Deep Space
          850: '#101A2D', // Orbital Navy
          800: '#17243C',
          700: '#223456',
        },
        cosmic: {
          black: '#03050B',
          deep: '#080D1B',
          navy: '#101A2D',
          white: '#F5FAFF',
          cyan: '#56E5FF', // Orbital Cyan
          blue: '#368BFF', // Atmospheric Blue
          purple: '#9875FF', // Nebula Violet
          violet: '#9875FF',
          teal: '#40E5C3', // Aurora Teal
          emerald: '#40E5C3',
          rose: '#FF4E78',
          amber: '#FFB84E',
        },
        orbital: {
          cyan: '#56E5FF',
          blue: '#368BFF',
          violet: '#9875FF',
          teal: '#40E5C3',
        },
        text: {
          primary: '#F5FAFF', // Ice White
          secondary: '#A5B4CB',
          muted: '#6C7E9C',
        },
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        card: '20px',
        button: '12px',
        modal: '24px',
        glass: '16px',
      },
      boxShadow: {
        'glow-cyan': '0 0 30px -5px rgba(86, 229, 255, 0.35)',
        'glow-blue': '0 0 30px -5px rgba(54, 139, 255, 0.35)',
        'glow-violet': '0 0 30px -5px rgba(152, 117, 255, 0.35)',
        'orbital-glass': 'inset 0 1px 1px 0 rgba(245, 250, 255, 0.15), 0 12px 36px 0 rgba(3, 5, 11, 0.65)',
        'orbital-glass-hover': 'inset 0 1px 2px 0 rgba(245, 250, 255, 0.25), 0 16px 48px -8px rgba(86, 229, 255, 0.25), 0 8px 24px 0 rgba(3, 5, 11, 0.8)',
      },
      backdropBlur: {
        glass: '20px',
        orbital: '24px',
      },
    },
  },
  plugins: [],
};
