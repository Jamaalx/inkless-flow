import { Montserrat, Lato } from 'next/font/google';
import { SessionProvider } from '@/providers/session-provider';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '700'],
});

const lato = Lato({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lato',
  weight: ['400', '700'],
});

export const metadata = {
  title: 'Inkless Flow | Sign smarter. Sign free.',
  description: 'Digital document signing without the cost. No subscriptions, no hidden fees—just simple, legally binding electronic signatures for everyone.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${lato.variable}`}>
      <body className="min-h-screen bg-bg-light font-sans text-primary-blue">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}