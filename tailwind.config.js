export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        sidebar: "var(--color-sidebar-background)",
        backgroundSoft: "var(--color-background-soft)",
        backgroundMute: "var(--color-background-mute)",
        border: "var(--color-border)",
        borderHover: "var(--color-border-hover)",
        heading: "var(--color-heading)",
        text: "var(--color-text)",
        card: "var(--color-card)",
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
      },
    },
  },
  plugins: [],
};
