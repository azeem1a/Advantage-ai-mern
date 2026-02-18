/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                display: ['"Sora"', 'system-ui', 'sans-serif'],
                body: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
            },
            colors: {
                brand: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                },
                electric: {
                    50: '#f2f0ff',
                    100: '#e5e0ff',
                    200: '#cbbdff',
                    300: '#b098ff',
                    400: '#946dff',
                    500: '#7a44ff',
                    600: '#6a2eff',
                    700: '#5a20df',
                    800: '#481bb3',
                    900: '#34167f',
                },
            },
            boxShadow: {
                'premium': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1), 0 4px 6px -1px rgb(0 0 0 / 0.05)',
                'premium-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1), 0 20px 25px -5px rgb(0 0 0 / 0.05)',
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
            },
        },
    },
    plugins: [],
}
