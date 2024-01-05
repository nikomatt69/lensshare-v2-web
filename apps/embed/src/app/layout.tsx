import '../styles/index.css'

import {DESCRIPTION, APP_NAME } from '@lensshare/data/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: APP_NAME,
  description: DESCRIPTION,
  robots: 'noindex'
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

export default RootLayout
