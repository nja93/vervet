import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {},
  plugins: [require("daisyui"), require("@tailwindcss/forms")],
  daisyUi: {
    themes: ["winter", "night"],
  },
  darkMode: ["class", '[data-theme="night"]'],
};
export default config;
