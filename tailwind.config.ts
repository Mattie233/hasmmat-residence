import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          950: '#0b0909',
          900: '#161212',
          800: '#1e1a18',
          700: '#2a2320',
          600: '#3d3532',
          500: '#6f5f56',
          400: '#b39d8d',
          300: '#d8c7b6',
          200: '#e9dfd5',
          100: '#f6f1ee'
        }
      },
      boxShadow: {
        soft: '0 30px 80px rgba(0,0,0,0.18)',
        glow: '0 0 40px rgba(255, 241, 218, 0.1)'
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top, rgba(255, 255, 255, 0.08), transparent 55%)'
      }
    }
  },
  plugins: []
};

export default config;
