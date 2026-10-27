import type { Metadata } from 'next'
import { Anton, Manrope } from 'next/font/google'
import Script from 'next/script'
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
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
