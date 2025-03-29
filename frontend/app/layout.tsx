import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Cricket Tournament Manager",
  description: "A comprehensive web application for managing cricket tournaments",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2314b8a6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='8' y1='4' x2='8' y2='20'/><line x1='12' y1='4' x2='12' y2='20'/><line x1='16' y1='4' x2='16' y2='20'/><line x1='6' y1='4' x2='18' y2='4'/><line x1='6' y1='6' x2='18' y2='6'/></svg>"
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-beige`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'