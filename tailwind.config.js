/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        noto_sans: ["noto_sans"],
        roboto: ["roboto"],
      },
      colors: {
        textPrimary50: "#FAF9FD",
        textPrimary100: "#E5DEF8",
        textPrimary200: "#CABCEF",
        textPrimary300: "#A28CE0",
        textPrimary400: "#7D64C3",
        textPrimary500: "#54408C",
        textPrimary600: "#352368",
        textPrimary700: "#251554",
        textPrimary800: "#10052F",
        textPrimary900: "#09031B",

        textGray50: "#FAFAFA",
        textGray100: "#F5F5F5",
        textGray200: "#E8E8E8",
        textGray300: "#D6D6D6",
        textGray400: "#B8B8B8",
        textGray500: "#A6A6A6",
        textGray600: "#7A7A7A",
        textGray700: "#454545",
        textGray800: "#292929",
        textGray900: "#121212",

        textWhite: "#FFFFFF",
        textYellow: "#FBAE05",
        textOrange: "#FF8C39",
        textRed: "#EF5A56",
        textBlue: "#3784FB",
        textGreen: "#34A853",
      },
      fontSize: {
        heading1: "40px",
        heading2: "32px",
        heading3: "24px",
        heading4: "20px",
        heading5: "18px",
        heading6: "16px",

        bodyXLarge: "18px",
        bodyLarge: "16px",
        bodyMedium: "14px",
        bodySmall: "12px",
      },
    },
  },
  plugins: [],
};
