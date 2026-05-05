/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./main.js"],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {
      fontFamily: {
          sans: ['Inter', 'sans-serif'],     // Primary
          display: ['Poppins', 'sans-serif'] // Secondary
      },
      colors: {
          primary: '#0EA5E9',   // Cyan Blue
          secondary: '#22D3EE', // Light Aqua
          accent: '#38BDF8',    // Glow Accent
          surface: {
              light: '#F8FAFC', // Soft White
              dark: '#0F172A',  // Text contrast / Dark surface
              black: '#020617'  // Dark Mode BG
          }
      },
      fontSize: {
          'hero': ['clamp(56px, 5vw, 64px)', '1.1'],
          'section': ['clamp(28px, 3vw, 36px)', '1.3'],
          'sub': ['clamp(18px, 2vw, 22px)', '1.4'],
          'body': ['clamp(14px, 1.5vw, 16px)', '1.6'],
          'label': ['13px', '1.4'],
      },
      animation: {
          'sweep': 'sweep 1.5s ease-in-out',
          'zoom-in': 'zoomIn 0.5s ease-out forwards',
      },
      keyframes: {
          sweep: {
              '0%': { transform: 'translateX(-150%) skewX(30deg)' },
              '100%': { transform: 'translateX(200%) skewX(30deg)' },
          },
          zoomIn: {
              '0%': { opacity: '0', transform: 'scale(0.9)' },
              '100%': { opacity: '1', transform: 'scale(1)' },
          }
      }
    }
  },
  plugins: [],
}
