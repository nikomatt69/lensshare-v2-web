import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { APP_NAME, DESCRIPTION } from '@lensshare/data/constants';
import React from 'react';
import defaultMetadata from 'defaultMetadata';



export const metadata: Metadata = defaultMetadata;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

