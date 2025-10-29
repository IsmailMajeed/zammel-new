/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // legacy tokens (kept for compatibility)
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'primary-color': 'var(--primary-color)',
        'secondary-color': 'var(--secondary-color)',
        'text-muted': 'var(--text-muted)',
        'border-color': 'var(--border-color)',

        // admin dashboard tokens
        bodyBackground: 'var(--body-background)',
        bodyForeground: 'var(--body-foreground)',
        cardBackground: 'var(--card-background)',
        cardForeground: 'var(--card-foreground)',
        popoverBackground: 'var(--popover-background)',
        popoverForeground: 'var(--popover-foreground)',
        primary: 'var(--primary)',
        primaryHover: 'var(--primary-hover)',
        primaryForeground: 'var(--primary-foreground)',
        secondaryBackground: 'var(--secondary-background)',
        secondaryForeground: 'var(--secondary-foreground)',
        mutedBackground: 'var(--muted-background)',
        mutedForeground: 'var(--muted-foreground)',
        accent: 'var(--accent)',
        accentForeground: 'var(--accent-foreground)',
        destructive: 'var(--destructive)',
        destructiveForeground: 'var(--destructive-foreground)',
        borderColor: 'var(--border-color)',
        inputBackground: 'var(--input-background)',
        inputForeground: 'var(--input-foreground)',
        buttonBackground: 'var(--button-background)',
        buttonForeground: 'var(--button-foreground)',
        buttonHover: 'var(--button-hover)',
        ringColor: 'var(--ring-color)'
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        roboto: ['var(--font-roboto)', 'Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-in': 'slideIn 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideIn: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
      },
    },
  },
  plugins: [],
}
