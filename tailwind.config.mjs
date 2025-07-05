/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: "#00291C",
        secondary: "#F0E7C2",
        extra_text1: "#478978",
        extra_text2: "#954130",
        orange: "#EO592A",
        offwhite: "#F0E7C2",
      },
      fontFamily: {
        heroeau: ["HeroeauElegantDemo", "sans-serif"],
        ladyrose: ["ladyrose", "sans-serif"],
        header: ["Helvetica", "sans-serif"],
        body: ["Helvetica", "sans-serif"],
      },
    },
  },
  plugins: [],
};
