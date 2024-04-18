import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      width: {
        '112':'28rem',
        '128':'32rem',
        '144':'36rem',
        '160':'40rem'
      },
      height: {
        '80svh': '80svh',
        '70svh': '70svh',
        '60svh': '60svh',
        '10svh': '10svh'
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        'button': 'black 3px 3px',
      },
      translate: {
        '3px': '3px'
      }
    },
  },
  plugins: [],
};
export default config;
