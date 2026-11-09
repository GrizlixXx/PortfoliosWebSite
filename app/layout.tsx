import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Illya Sumar — FullStack Developer',
  description: 'Portfolio of Illya Sumar, a FullStack Developer building thoughtful digital experiences.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
