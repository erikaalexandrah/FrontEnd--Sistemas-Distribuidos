/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fondo y superficies
        background: "#0e0e10", // gris carbón casi negro
        surface: "#1a1a22", // contenedores o tarjetas
        border: "#252530", // separadores sutiles

        // Neones
        neon: {
          pink: "#ff2a6d",
          cyan: "#00e0ff",
          yellow: "#ffb300",
        },

        // Texto
        text: {
          base: "#d0d0d0",
          muted: "#7a7a85",
        },
      },

      fontFamily: {
        title: ["Orbitron", "sans-serif"],
        body: ["Rajdhani", "sans-serif"],
      },

      boxShadow: {
        neon: "0 0 8px rgba(255, 42, 109, 0.8)",
        "neon-cyan": "0 0 8px rgba(0, 224, 255, 0.8)",
        "inner-glow": "inset 0 0 20px rgba(255, 42, 109, 0.2)",
      },

      backgroundImage: {
        "cyber-gradient":
          "linear-gradient(90deg, #ff2a6d 0%, #00e0ff 100%)",
        "noise-texture":
          "url('/textures/noise.png')",
      },

      animation: {
        neonPulse: "neonPulse 2s infinite ease-in-out",
        glitch: "glitch 1.5s infinite",
        flicker: "flicker 3s infinite",
      },

      keyframes: {
        neonPulse: {
          "0%, 100%": { textShadow: "0 0 8px #ff2a6d" },
          "50%": { textShadow: "0 0 20px #00e0ff" },
        },
        glitch: {
          "0%": { transform: "skew(0deg)" },
          "20%": { transform: "skew(3deg)" },
          "40%": { transform: "skew(-3deg)" },
          "60%": { transform: "skew(2deg)" },
          "80%": { transform: "skew(-2deg)" },
          "100%": { transform: "skew(0deg)" },
        },
        flicker: {
          "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": {
            opacity: "1",
          },
          "20%, 24%, 55%": { opacity: "0.3" },
        },
      },

      borderRadius: {
        "2xl": "1rem",
      },

      spacing: {
        128: "32rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
};
