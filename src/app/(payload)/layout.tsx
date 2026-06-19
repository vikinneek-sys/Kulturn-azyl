import React from 'react'
import config from '@payload-config'
import { RootLayout } from '@payloadcms/next/layouts'
import { importMap } from './admin/importMap.js'
import './custom.scss'

export const metadata = {
  title: 'Kulturní azyl CMS',
  description: 'Redakční systém magazínu Kulturní azyl',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout config={config} importMap={importMap}>
      {children}
    </RootLayout>
  )
}
