/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // ✅ correct for Tailwind v4
    autoprefixer: {},
  },
};

export default config;
