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
        secondary: '#F5F5F5',
        text: '#1E1E1E',
        textSecondary: '#666666',
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
