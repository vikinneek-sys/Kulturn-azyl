import type { Metadata } from 'next'
import { Anton, Manrope } from 'next/font/google'
import React from 'react'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import './globals.css'

const anton = Anton({
  weight: '400',
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
})

const manrope = Manrope({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'Kulturní azyl',
  description: 'Magazín o hudbě, obrazu, literatuře a živé kultuře.',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={`${anton.variable} ${manrope.variable}`}>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
