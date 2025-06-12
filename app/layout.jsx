import { Playfair_Display, Lato } from "next/font/google"
import "./globals.css"
import "../styles/ui/marquee-shared.css" // Corrected relative path
import { ThemeProvider } from "../components/theme-provider" // Corrected relative path

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair",
})

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
})

export const metadata = {
  title: "Tonle Sab - The Heart of Cambodia",
  description: "Discover the beauty and life of Tonle Sab, Southeast Asia's largest freshwater lake.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${lato.variable} font-lato bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
