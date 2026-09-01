import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ScrollToTop from '@/components/ui/ScrollToTop'
import ChatBot from '@/components/chatbot/ChatBot'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'RRR Housing — Plots, Flats & Villas in Chennai',
  description: 'RRR Housing (Real Rise Resource) — RERA approved, DTCP & CMDA approved plots, flats & villas in Chennai. ISO 27001:2013 certified. Faith | Integrity | Truth.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ScrollToTop />
          <ChatBot />
        </div>
      </body>
    </html>
  )
}
