/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
 content: [
  "./pages/**/*.{js,jsx,ts,tsx}",
  "./components/**/*.{js,jsx,ts,tsx}",
  "./app/**/*.{js,jsx,ts,tsx}",
  "./src/**/*.{js,jsx,ts,tsx}",
  "*.{js,jsx,ts,tsx,mdx}",
],

  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Enterprise AI Career Platform Colors
        "deep-navy": "hsl(var(--deep-navy))",
        "graphite-gray": "hsl(var(--graphite-gray))",
        "neon-coral": "hsl(var(--neon-coral))",
        "electric-orange": "hsl(var(--electric-orange))",
        "aqua-blue": "hsl(var(--aqua-blue))",
        "pure-white": "hsl(var(--pure-white))",
        "light-gray": "hsl(var(--light-gray))",
        "soft-gray": "hsl(var(--soft-gray))",
        "text-gray": "hsl(var(--text-gray))",
        // Semantic Colors
        "surface-primary": "hsl(var(--surface-primary))",
        "surface-secondary": "hsl(var(--surface-secondary))",
        "surface-tertiary": "hsl(var(--surface-tertiary))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "IBM Plex Sans", "Satoshi", "system-ui", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "ai-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        "data-flow": {
          "0%": { transform: "translateX(-100%) translateY(0)", opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { transform: "translateX(100%) translateY(-10px)", opacity: "0" },
        },
        "neural-network": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "momentum-slide": {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "ai-pulse": "ai-pulse 2s ease-in-out infinite",
        "data-flow": "data-flow 3s ease-in-out infinite",
        "neural-network": "neural-network 3s ease-in-out infinite",
        "momentum-slide": "momentum-slide 0.6s ease-out",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "momentum-gradient":
          "linear-gradient(135deg, hsl(var(--deep-navy)) 0%, hsl(var(--graphite-gray)) 50%, hsl(var(--deep-navy)) 100%)",
        "action-gradient":
          "linear-gradient(135deg, hsl(var(--neon-coral)) 0%, hsl(var(--electric-orange)) 100%)",
        "info-gradient":
          "linear-gradient(135deg, hsl(var(--aqua-blue)) 0%, hsl(var(--aqua-blue) / 0.8) 100%)",
        "ai-circuit":
          "linear-gradient(90deg, hsl(var(--aqua-blue) / 0.1) 1px, transparent 1px), linear-gradient(hsl(var(--aqua-blue) / 0.1) 1px, transparent 1px)",
      },
      backgroundSize: {
        "ai-circuit": "24px 24px",
      },
      boxShadow: {
        enterprise:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "enterprise-lg":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "ai-glow": "0 0 20px hsl(var(--aqua-blue) / 0.3)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
