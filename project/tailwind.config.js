/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Neutral sophisticated color scheme
        background: 'hsl(0 0% 100%)', // #FFFFFF
        foreground: 'hsl(222.2 84% 4.9%)', // #020817
        muted: 'hsl(215.4 16.3% 46.9%)', // #64748B
        accent: 'hsl(221.2 83.2% 53.3%)', // #2563EB
        border: 'hsl(214.3 31.8% 91.4%)', // #E2E8F0
        
        // Neutral gray scale for sophisticated feel
        gray: {
          50: 'hsl(210 40% 98%)', // #F8FAFC
          100: 'hsl(210 40% 96%)', // #F1F5F9
          200: 'hsl(214.3 31.8% 91.4%)', // #E2E8F0
          300: 'hsl(212.7 26.8% 83.9%)', // #CBD5E1
          400: 'hsl(215.4 16.3% 46.9%)', // #64748B
          500: 'hsl(215.4 16.3% 46.9%)', // #64748B
          600: 'hsl(215 20.2% 65.1%)', // #A1A1AA
          700: 'hsl(215.3 25% 26.7%)', // #334155
          800: 'hsl(217.2 32.6% 17.5%)', // #27272A
          900: 'hsl(222.2 84% 4.9%)', // #020817
          950: 'hsl(222.2 84% 4.9%)', // #020817
        },
        
        // Blue accent colors for sophistication
        blue: {
          50: 'hsl(214 100% 97%)', // #EFF6FF
          100: 'hsl(214 95% 93%)', // #DBEAFE
          200: 'hsl(213 97% 87%)', // #BFDBFE
          300: 'hsl(212 96% 78%)', // #93C5FD
          400: 'hsl(213 94% 68%)', // #60A5FA
          500: 'hsl(217.2 91.2% 59.8%)', // #3B82F6
          600: 'hsl(221.2 83.2% 53.3%)', // #2563EB
          700: 'hsl(224.3 76.3% 48%)', // #1D4ED8
          800: 'hsl(225.9 70.7% 40.2%)', // #1E40AF
          900: 'hsl(224.4 64.3% 32.9%)', // #1E3A8A
        },
      },
      fontFamily: {
        sans: ['Noto Sans JP', '游ゴシック', 'Yu Gothic', 'ヒラギノ角ゴ ProN', 'Hiragino Kaku Gothic ProN', 'メイリオ', 'Meiryo', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      typography: {
        DEFAULT: {
          css: {
            lineHeight: '1.75',
            fontSize: '1.125rem',
          },
        },
      },
    },
  },
  plugins: [],
}