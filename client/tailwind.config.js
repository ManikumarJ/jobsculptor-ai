/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            },
            colors: {
                brand: {
                    50: '#f0f4fc',
                    100: '#e3ebfa',
                    200: '#cddaf5',
                    300: '#aabfee',
                    400: '#819ce4',
                    500: '#6179db',
                    600: '#4858ce',
                    700: '#3d48ba',
                    800: '#343e97',
                    900: '#2e3779',
                    950: '#1c2149',
                }
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms')
    ],
}
