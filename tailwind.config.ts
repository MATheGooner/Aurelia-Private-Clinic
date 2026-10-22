import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--color-canvas)',
        surface: 'var(--color-surface)',
        ink: 'var(--color-ink)',
        muted: 'var(--color-muted)',
        border: 'var(--color-border)',
        accent: 'var(--color-accent)',
        'accent-soft': 'var(--color-accent-soft)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Arial', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      maxWidth: { site: '76rem' },
    },
  },
  plugins: [],
};

export default config;
