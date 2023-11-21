import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { Toaster } from 'react-hot-toast';
import './globals.css'
import dotenv from 'dotenv';

import NavBar from './components/nav/NavBar'
import Footer from './components/footer/Footer'

dotenv.config();

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'] })

export const metadata: Metadata = {
  title: 'B-Commerce',
  description: 'Bamboo Crafts Online Marketplace',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={`${poppins.className} text-slate-700`}>
        <div className='flex flex-col min-h-screen'>
          <Toaster />
          <NavBar />
          <main className='flew-grow'>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
