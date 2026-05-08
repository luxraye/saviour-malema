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
        ember: "#F46036",
        grove: "#16796F",
        midnight: "#111827",
        gold: "#2563EB",
      },
      boxShadow: {
        glass: "0 24px 80px rgba(7, 18, 32, 0.24)",
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
      },
    },
  },
  plugins: [],
};
