/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ember: "rgb(var(--c-ember) / <alpha-value>)",
        grove: "rgb(var(--c-grove) / <alpha-value>)",
        midnight: "rgb(var(--c-midnight) / <alpha-value>)",
        gold: "rgb(var(--c-gold) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        "surface-deep": "rgb(var(--c-surface-deep) / <alpha-value>)",
      },
      boxShadow: {
        glass: "0 24px 80px rgba(7, 18, 32, 0.24)",
        glow: "0 18px 60px -12px rgb(var(--c-gold) / 0.45)",
        "glow-ember": "0 18px 60px -12px rgb(var(--c-ember) / 0.45)",
      },
      backgroundImage: {
        "community-care":
          "linear-gradient(135deg, rgba(10, 20, 34, 0.82), rgba(22, 121, 111, 0.42)), url('https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=2400&q=85')",
        "learning-light":
          "linear-gradient(135deg, rgba(17, 24, 39, 0.9), rgba(244, 96, 54, 0.36)), url('https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=2200&q=85')",
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        "slow-pulse": "slowPulse 5s ease-in-out infinite",
        "glow-drift": "glowDrift 16s ease-in-out infinite",
        "glow-drift-slow": "glowDrift 22s ease-in-out infinite",
        "reveal-up": "revealUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
        sheen: "sheen 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        slowPulse: {
          "0%, 100%": { opacity: 0.7 },
          "50%": { opacity: 1 },
        },
        glowDrift: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)", opacity: 0.55 },
          "33%": { transform: "translate(6%, -8%) scale(1.15)", opacity: 0.8 },
          "66%": { transform: "translate(-5%, 6%) scale(0.92)", opacity: 0.6 },
        },
        revealUp: {
          "0%": { opacity: 0, transform: "translateY(28px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        sheen: {
          "0%": { transform: "translateX(-120%) skewX(-12deg)" },
          "55%, 100%": { transform: "translateX(220%) skewX(-12deg)" },
        },
      },
    },
  },
  plugins: [],
};
