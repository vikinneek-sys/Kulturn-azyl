import type { Metadata } from 'next'
import React from 'react'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kulturní azyl',
  description: 'Magazín o hudbě, obrazu, literatuře a živé kultuře.',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
