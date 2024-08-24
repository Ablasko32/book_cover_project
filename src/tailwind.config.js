/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {
      backgroundImage: {
        "pink-bg": "url('images/book-bg.jpg')",
      },
    },
  },
  plugins: [],
};
