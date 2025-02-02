import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { TooltipProvider } from '@radix-ui/react-tooltip'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mehul\'s Playground',
  description: 'Some fun stuff I have done',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  )
}
