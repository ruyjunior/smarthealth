// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        secondary: "#60A5FA",
        accent: "#93C5FD",
        muted: "#E0F2FE",
        dark: "#1E3A8A",
        light: "#F8FAFC",
        danger: "#EF4444",
        success: "#10B981",
      },
    },
  },
  plugins: [],
};
