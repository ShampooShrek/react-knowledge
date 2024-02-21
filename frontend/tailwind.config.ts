import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        red: "#ed8796",
        green: "#a6da95",
        blue: "#8aadf4",
        surface: "#313244",
        surface2: "#585b70",
        bgColor: "#1e1e2e",
        mantle: "#181825",
        crust: "#11111b",
        menuLeft: "#232526",
        menuRight: "#414345",
      },
    },
  },
  plugins: [],
};
export default config;
