/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        heading: ["Roboto", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        mono: ["Roboto Mono", "Consolas", "Monaco", "monospace"],
      },
      fontSize: {
        body: ["16px", { lineHeight: "24px" }],
        "body-relaxed": ["16px", { lineHeight: "26px" }],
        h2: ["21px", { lineHeight: "28px", fontWeight: "600" }],
        h3: ["18px", { lineHeight: "24px", fontWeight: "500" }],
        code: ["14px", { lineHeight: "20px" }],
        nav: ["14px", { lineHeight: "20px" }],
      },
      letterSpacing: {
        body: "0",
        "body-alt": "0.25px",
      },
      lineHeight: {
        body: "24px",
        "body-relaxed": "26px",
        h2: "28px",
        h3: "24px",
        code: "20px",
        nav: "20px",
      },
    },
  },
  plugins: [],
};
