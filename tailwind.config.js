/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        noto_sans: ['noto_sans'],
        roboto: ['roboto'],
      },
      colors: {
        primary: '#54408C',
        primary50: '#FAF9FD',
        primaryDark: '#5E3EA1',
        secondary: '#F5F5F5',
        text: '#1E1E1E',
        textGray500: '#A6A6A6',
        textTertiary: '#999999',
        textQuaternary: '#CCCCCC',
        textQuinary: '#E5E5E5',
        textSenary: '#F5F5F5',
        textSeptenary: '#FFFFFF',
      },
    },
  },
  plugins: [],
};
