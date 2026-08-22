import type { Metadata, Viewport } from 'next';
import { Mali, Prompt, Playfair_Display } from 'next/font/google';
import './globals.css';

const mali = Mali({
  subsets: ['latin', 'thai'],
  weight: ['400', '500', '600'],
  variable: '--font-mali',
  display: 'swap',
});

const prompt = Prompt({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-prompt',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Happy Birthday Charene ♡',
  description: 'A whole page of wishes from everyone who found her on stream. Leave yours — it stays here forever.',
  openGraph: {
    title: 'Happy Birthday Charene ♡',
    description: 'Leave a birthday wish for Charene9.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FFF7FA',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={[mali.variable, prompt.variable, playfair.variable].join(' ')}>
      <body>{children}</body>
    </html>
  );
}
