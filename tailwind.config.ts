import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
          card: "var(--bg-card)",
        },
        ink: {
          DEFAULT: "var(--text-primary)",
          soft: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          dark: "var(--accent-dark)",
          soft: "var(--accent-soft)",
        },
        line: "var(--border)",
        success: "var(--success)",
        warning: "var(--warning)",
        trust: "var(--trust-blue)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // Display (Outfit)
        h1: ["26px", { lineHeight: "1.1", fontWeight: "700", letterSpacing: "-0.02em" }],
        h2: ["20px", { lineHeight: "1.2", fontWeight: "700", letterSpacing: "-0.02em" }],
        h3: ["17px", { lineHeight: "1.15", fontWeight: "700", letterSpacing: "-0.01em" }],
        // Body (Plus Jakarta Sans)
        body: ["14px", { lineHeight: "1.55", fontWeight: "400" }],
        bodyLg: ["15px", { lineHeight: "1.5", fontWeight: "400" }],
        caption: ["13px", { lineHeight: "1.45", fontWeight: "500" }],
        label: ["12.5px", { lineHeight: "1.3", fontWeight: "700" }],
        // Meta (JetBrains Mono)
        eyebrow: ["10px", { lineHeight: "1.2", fontWeight: "700", letterSpacing: "0.14em" }],
      },
      borderRadius: {
        card: "16px",
        "card-sm": "14px",
        "card-lg": "18px",
        "card-xl": "20px",
        chip: "999px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(42, 38, 36, 0.04), 0 4px 16px rgba(42, 38, 36, 0.04)",
        cta: "0 10px 24px -10px rgba(42, 38, 36, 0.5)",
        accent: "0 8px 22px -10px rgba(178, 82, 52, 0.4)",
      },
      maxWidth: {
        mobile: "440px",
      },
    },
  },
  plugins: [],
};

export default config;
