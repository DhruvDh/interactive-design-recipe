/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      fontFamily: {
        // primary UI fonts
        sans: ["IBM Plex Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["IBM Plex Serif", "ui-serif", "Georgia", "serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
