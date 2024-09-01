module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],  // Add Inter or Poppins as the default sans font
      },
      maxWidth: {
        '3xl': '64rem',
      },
    },
  },
  plugins: [],
}
