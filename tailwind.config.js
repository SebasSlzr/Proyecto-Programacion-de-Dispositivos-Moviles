/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Base clara (fondo y tarjetas)
        linen: '#EAE4D9',
        ivory: '#FBF9F5',
        ink: '#2B2621',
        plum: '#5B3350',
        sage: '#7C8B6F',
        taupe: '#D8CFC0',
        // Madera y metal (diseño Real-Wood Skeuomorphism)
        'walnut-dark': '#2E1B10',
        walnut: '#4A2F1E',
        'walnut-light': '#6B4530',
        oak: '#B98B5E',
        'oak-light': '#D2A978',
        'metal-light': '#E4DFD6',
        metal: '#B8B2A7',
        'metal-dark': '#8C867B',
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
};