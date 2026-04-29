import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/providers/AuthProvider'

const font = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'WiyataGuru — Sistem Bantu Mengajar',
    template: '%s | WiyataGuru',
  },
  description:
    'Platform all-in-one untuk membantu guru dalam membuat soal, materi pembelajaran, dan penilaian secara efisien.',
  keywords: ['bank soal', 'guru', 'materi pembelajaran', 'penilaian', 'pendidikan', 'SMA', 'SMP'],
  authors: [{ name: 'WiyataGuru Team' }],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    title: 'WiyataGuru — Sistem Bantu Mengajar',
    description: 'Platform all-in-one untuk guru. Bank soal, materi, dan penilaian dalam satu tempat.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={font.variable}>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
