import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'B2B Tender Platform',
  description: 'Professional B2B tender management platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
