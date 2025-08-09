
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Couleurs APVJ éclatantes et harmonieuses
				apvj: {
					blue: {
						50: 'hsl(221, 88%, 95%)',
						100: 'hsl(221, 88%, 90%)',
						200: 'hsl(221, 88%, 80%)',
						300: 'hsl(221, 88%, 70%)',
						400: 'hsl(221, 88%, 62%)',
						500: 'hsl(var(--apvj-blue))',
						600: 'hsl(221, 88%, 50%)',
						700: 'hsl(221, 88%, 42%)', 
						800: 'hsl(var(--apvj-blue-dark))',
						900: 'hsl(221, 88%, 25%)'
					},
					yellow: {
						50: 'hsl(45, 98%, 95%)',
						100: 'hsl(var(--apvj-yellow-light))',
						200: 'hsl(45, 98%, 78%)',
						400: 'hsl(45, 98%, 68%)',
						500: 'hsl(var(--apvj-yellow))',
						600: 'hsl(var(--apvj-yellow-dark))',
						700: 'hsl(45, 98%, 35%)'
					},
					green: {
						50: 'hsl(142, 75%, 95%)',
						100: 'hsl(var(--apvj-green-light))',
						200: 'hsl(142, 75%, 78%)',
						400: 'hsl(142, 75%, 58%)',
						500: 'hsl(var(--apvj-green))',
						600: 'hsl(142, 75%, 55%)',
						700: 'hsl(var(--apvj-green-dark))',
						800: 'hsl(142, 75%, 35%)'
					},
					red: {
						400: 'hsl(14, 96%, 68%)',
						500: 'hsl(var(--apvj-red))',
						600: 'hsl(var(--apvj-red-dark))',
						700: 'hsl(14, 96%, 35%)'
					},
					orange: {
						500: 'hsl(var(--apvj-orange))',
						600: 'hsl(25, 95%, 55%)',
						700: 'hsl(25, 95%, 45%)'
					},
					purple: {
						500: 'hsl(var(--apvj-purple))',
						600: 'hsl(260, 85%, 60%)',
						700: 'hsl(260, 85%, 50%)'
					},
					pink: {
						500: 'hsl(var(--apvj-pink))',
						600: 'hsl(320, 85%, 60%)',
						700: 'hsl(320, 85%, 50%)'
					},
					cream: {
						50: 'hsl(var(--apvj-cream))',
						100: 'hsl(45, 35%, 95%)'
					}
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'pulse-slow': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.7'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'slide-up': 'slide-up 0.8s ease-out',
				'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
