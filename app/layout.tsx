import { DashboardShell } from '@/components/DashboardShell';
import { QueryProvider } from '@/hooks/QueryProvider';
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from '@mantine/core';
import '@mantine/core/styles.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  description: 'Creative Cash Draw Solutions – change calculator for cashiers',
  title: 'Cash Register | Dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <MantineProvider defaultColorScheme="dark">
          <QueryProvider>
            <DashboardShell>{children}</DashboardShell>
          </QueryProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
