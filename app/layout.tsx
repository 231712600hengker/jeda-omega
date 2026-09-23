import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Jeda – EMA Mahasiswa Skripsi',
  description: 'Aplikasi Ecological Momentary Assessment (EMA) untuk pemantauan stres harian dan pencegahan burnout mahasiswa skripsi secara anonim dan privat.',
  openGraph: {
    title: 'Jeda – EMA Mahasiswa Skripsi',
    description: 'Aplikasi Ecological Momentary Assessment (EMA) untuk pemantauan stres harian dan pencegahan burnout mahasiswa skripsi secara anonim dan privat.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jeda – EMA Mahasiswa Skripsi',
    description: 'Aplikasi Ecological Momentary Assessment (EMA) untuk pemantauan stres harian dan pencegahan burnout mahasiswa skripsi secara anonim dan privat.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
