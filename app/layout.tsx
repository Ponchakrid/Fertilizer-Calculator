import type { Metadata, Viewport } from 'next'
import { Noto_Sans_Thai, Sarabun, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const notoSansThai = Noto_Sans_Thai({ 
  subsets: ['thai', 'latin'],
  variable: '--font-noto-sans-thai',
  display: 'swap',
})

const sarabun = Sarabun({ 
  subsets: ['thai', 'latin'],
  weight: ['400', '600', '700'],
  variable: '--font-sarabun',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'คำนวณปุ๋ย NPK ออนไลน์ฟรี - สูตรผสมปุ๋ยใช้เอง ลดต้นทุน เพิ่มผลผลิต',
  description: 'เครื่องมือคำนวณสูตรปุ๋ย NPK สำหรับเกษตรกรไทย ช่วยผสมปุ๋ยใช้เองแม่นยำ ลดต้นทุนได้กว่า 30% ครอบคลุม ข้าว ทุเรียน ปาล์มน้ำมัน ข้าวโพด และพืชกว่า 15 ชนิด',
  keywords: [
    'คำนวณปุ๋ย', 
    'สูตรปุ๋ย NPK', 
    'ผสมปุ๋ยใช้เอง', 
    'ลดต้นทุนปุ๋ย', 
    'ตารางใส่ปุ๋ย', 
    'ปุ๋ยข้าว', 
    'ปุ๋ยทุเรียน', 
    'แม่ปุ๋ย 46-0-0', 
    'แม่ปุ๋ย 18-46-0', 
    'แม่ปุ๋ย 0-0-60',
    'เกษตรกรไทย',
    'สมาร์ทฟาร์มเมอร์',
  ],
  authors: [{ name: 'Fertilizer Calculator' }],
  creator: 'Fertilizer Calculator',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    url: 'https://fertilizer-calc.vercel.app',
    title: 'คำนวณปุ๋ย NPK ออนไลน์ฟรี - ผสมปุ๋ยใช้เองแม่นยำ',
    description: 'ลดต้นทุนเพิ่มผลผลิตด้วยระบบคำนวณแม่ปุ๋ยอัจฉริยะ อ้างอิงวิชาการจาก ม.อ. และกรมพัฒนาที่ดิน',
    siteName: 'Fertilizer Calculator',
    images: [
      {
        url: 'https://fertilizer-calc.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ระบบคำนวณปุ๋ย NPK ออนไลน์',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'คำนวณปุ๋ย NPK ออนไลน์ฟรี - ลดต้นทุนเกษตรกรไทย',
    description: 'คำนวณสูตรปุ๋ยแม่นยำ ลดต้นทุนปุ๋ยได้จริง ใช้งานง่ายผ่านมือถือ',
  },
  alternates: {
    canonical: 'https://fertilizer-calc.vercel.app',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2D7A3A' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1A1A' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th" className={`${notoSansThai.variable} ${sarabun.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'คำนวณปุ๋ย NPK ออนไลน์',
              alternateName: 'ระบบคำนวณแม่ปุ๋ยอัจฉริยะ',
              description: 'เครื่องมือคำนวณสูตรปุ๋ย NPK สำหรับเกษตรกรไทย ช่วยผสมปุ๋ยใช้เองแม่นยำ ลดต้นทุนได้จริง อ้างอิงวิชาการจาก ม.อ. และกรมพัฒนาที่ดิน',
              url: 'https://fertilizer-calc.vercel.app',
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'Web',
              abstract: 'คำนวณปริมาณแม่ปุ๋ย 46-0-0, 18-46-0 และ 0-0-60 สำหรับพืชกว่า 15 ชนิด',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'THB',
              },
              audience: {
                '@type': 'Audience',
                audienceType: 'เกษตรกร, นักศึกษาเกษตร, ผู้สนใจเกษตรกรรม',
              },
              featureList: [
                'คำนวณแม่ปุ๋ย 3 ชนิด (46-0-0, 18-46-0, 0-0-60)',
                'รองรับพืชกว่า 15 ชนิด เช่น ข้าว ทุเรียน ปาล์มน้ำมัน ข้าวโพด',
                'คำนวณต้นทุนปุ๋ยต่อไร่',
                'แนะนำตารางการใส่ปุ๋ยตามระยะการเติบโต',
                'รองรับการพิมพ์รายงานสรุปผล',
              ],
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased bg-background">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
