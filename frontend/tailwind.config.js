/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0B0F19",
        cardBg: "rgba(26, 31, 46, 0.6)",
        pulseRed: "#FF3366",
        healthCyan: "#00F0FF",
        riskWarning: "#FFB800",
        accent: "var(--pulse-accent)",
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'pulse-gradient': 'linear-gradient(135deg, var(--pulse-accent) 0%, #FF6B8B 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        'neon-red': '0 0 15px rgba(255, 51, 102, 0.5)',
        'neon-cyan': '0 0 15px rgba(0, 240, 255, 0.5)',
        'shadow-accent': '0 0 15px var(--pulse-accent-glow)',
      },
      animation: {
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.1)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.1)' },
          '70%': { transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
