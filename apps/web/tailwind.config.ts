import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./stores/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#070b14",
        foreground: "#f2f5ff",
        card: "#101827",
        border: "rgba(148,163,184,.18)",
        cyan: "#67e8f9",
        violet: "#8b5cf6",
        emerald: "#34d399",
        danger: "#fb7185"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(103,232,249,.18), 0 12px 48px rgba(6,182,212,.16)"
      },
      backgroundImage: {
        mesh:
          "radial-gradient(circle at 20% 20%, rgba(103,232,249,.13), transparent 26%), radial-gradient(circle at 80% 0%, rgba(139,92,246,.18), transparent 30%), radial-gradient(circle at 50% 90%, rgba(52,211,153,.12), transparent 24%)"
      },
      animation: {
        float: "float 12s ease-in-out infinite",
        pulsegrid: "pulsegrid 8s linear infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        pulsegrid: {
          "0%": { opacity: "0.16" },
          "50%": { opacity: "0.28" },
          "100%": { opacity: "0.16" }
        }
      }
    }
  },
  plugins: []
};

export default config;
