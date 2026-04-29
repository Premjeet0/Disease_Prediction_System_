import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';
import './theme.css';
import { ThemeProvider } from '@/app/providers/theme-provider';
import { Navigation } from '@/components/navigation';

const display = Space_Grotesk({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const body = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Disease Prediction AI - ML Health Risk Assessment',
  description: 'Advanced machine learning models for diabetes and heart disease risk prediction',
  keywords: ['disease prediction', 'machine learning', 'healthcare', 'diabetes', 'heart disease'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable} font-body`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            {children}
            <footer className="border-t border-gray-200 bg-gray-50 text-center py-8 text-sm text-gray-600 mt-auto">
              <p>© 2026 Disease Prediction AI. Educational tool - not a substitute for professional medical advice.</p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
