/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'system-ui', 'sans-serif'],
            },
            colors: {
                brand: {
                    50: '#f0f7ff',
                    100: '#e0effe',
                    200: '#bae0fd',
                    300: '#7cc8fc',
                    400: '#36aaf8',
                    500: '#0c8ee9',
                    600: '#0070c7',
                    700: '#0159a1',
                    800: '#064c85',
                    900: '#0b406e',
                    950: '#072849',
                },
                emerald_zone: {
                    light: '#d1fae5',
                    DEFAULT: '#10b981',
                    dark: '#065f46',
                },
                platinum_zone: {
                    light: '#e8e8f0',
                    DEFAULT: '#8b8fa3',
                    dark: '#4a4e69',
                },
                gold_zone: {
                    light: '#fef3c7',
                    DEFAULT: '#f59e0b',
                    dark: '#92400e',
                },
                silver_zone: {
                    light: '#e5e7eb',
                    DEFAULT: '#9ca3af',
                    dark: '#4b5563',
                },
                bronze_zone: {
                    light: '#fde8d8',
                    DEFAULT: '#cd7f32',
                    dark: '#7c4a1e',
                },
                dark: {
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
                    950: '#020617',
                },
                glass: {
                    light: 'rgba(255, 255, 255, 0.1)',
                    medium: 'rgba(255, 255, 255, 0.15)',
                    heavy: 'rgba(255, 255, 255, 0.25)',
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'hero-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 25%, #1e3a5f 50%, #0f172a 100%)',
                'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                'emerald-gradient': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                'platinum-gradient': 'linear-gradient(135deg, #8b8fa3 0%, #6366f1 100%)',
                'gold-gradient': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                'silver-gradient': 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                'bronze-gradient': 'linear-gradient(135deg, #cd7f32 0%, #a0522d 100%)',
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                'glass-sm': '0 4px 16px 0 rgba(31, 38, 135, 0.2)',
                'neon': '0 0 20px rgba(12, 142, 233, 0.3), 0 0 40px rgba(12, 142, 233, 0.1)',
                'neon-emerald': '0 0 20px rgba(16, 185, 129, 0.3)',
                'neon-gold': '0 0 20px rgba(245, 158, 11, 0.3)',
                'glow': '0 0 40px rgba(12, 142, 233, 0.15)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 3s ease-in-out infinite',
                'shimmer': 'shimmer 2s ease-in-out infinite',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'fade-in': 'fadeIn 0.5s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
                'bounce-in': 'bounceIn 0.6s ease-out',
                'glow-pulse': 'glowPulse 2s ease-in-out infinite',
                'spin-slow': 'spin 3s linear infinite',
                'progress': 'progressBar 1.5s ease-out forwards',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                bounceIn: {
                    '0%': { transform: 'scale(0.3)', opacity: '0' },
                    '50%': { transform: 'scale(1.05)' },
                    '70%': { transform: 'scale(0.9)' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                glowPulse: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(12, 142, 233, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(12, 142, 233, 0.6)' },
                },
                progressBar: {
                    '0%': { width: '0%' },
                    '100%': { width: 'var(--progress-width, 100%)' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
