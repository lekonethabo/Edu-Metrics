import "@/globals.css";
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import AuthGuard from './auth-guard';
import { AppStateProvider } from '@/hooks/use-app-state';
import { ThemeProvider } from '@/components/theme-provider';

// 1. REBRAND TO EDU-METRICS
export const metadata: Metadata = {
  title: 'Edu-Metrics',
  description: 'A modern School Management and Analytics Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Space+Grotesk:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased h-full" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppStateProvider>
            {/* 2. REMOVED FIREBASECLIENTPROVIDER WRAPPER FOR CLEAN STACK RUNS */}
            <AuthGuard>{children}</AuthGuard>
            <Toaster />
          </AppStateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}