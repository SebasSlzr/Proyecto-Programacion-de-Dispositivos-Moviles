/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        linen: '#EAE4D9',
        ivory: '#FBF9F5',
        ink: '#2B2621',
        plum: '#5B3350',
        sage: '#7C8B6F',
        taupe: '#D8CFC0',
      },
      fontFamily: {
        display: ['Fraunces_600SemiBold'],
        'display-light': ['Fraunces_400Regular'],
        body: ['Manrope_400Regular'],
        'body-medium': ['Manrope_500Medium'],
        'body-bold': ['Manrope_700Bold'],
      },
    },
  },
  plugins: [],
}