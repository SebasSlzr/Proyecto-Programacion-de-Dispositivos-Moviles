/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        linen: '#EAE4D9',   // fondo principal de las pantallas
        ivory: '#FBF9F5',   // tarjetas y superficies elevadas
        ink: '#2B2621',     // texto principal
        plum: '#5B3350',    // acento principal (botones, tabs activos)
        sage: '#7C8B6F',    // acento secundario (etiquetas, estados)
        taupe: '#D8CFC0',   // bordes y divisores
      },
      fontFamily: {
        // Nombres distintos a los pesos de fuente normales de Tailwind
        // (font-medium, font-bold, etc.) para que no choquen entre sí.
        display: ['Fraunces_600SemiBold'],       // títulos grandes
        'display-light': ['Fraunces_400Regular'],
        body: ['Manrope_400Regular'],             // texto normal
        'body-medium': ['Manrope_500Medium'],
        'body-bold': ['Manrope_700Bold'],
      },
    },
  },
  plugins: [],
}