"use client"

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {

    const pathname = usePathname()

  return (
    <footer className={`${pathname === '/auth' || pathname === '/forget-password' ? 'hidden' : ''} footer footer-horizontal text-xs lg:text-base footer-center bg-[#011736] text-primary-content p-10 !gap-4`}>
        <aside>
            <Link href='/' className='cursor-pointer relative w-full aspect-[875/262] min-w-[130px] max-w-[220px]'>
                <Image src='/assets/logo-white.png' fill alt="ShortenIt Logo" className="object-cover"/>
            </Link>
        </aside>
        <nav className="grid grid-flow-col gap-4">
            <Link href='/auth' className="link link-hover">Get Started</Link>
            <Link href='/pricing' className="link link-hover">Plans</Link>
            <Link href='/faq' className="link link-hover">FAQ</Link>
        </nav>
        <nav>
            <div className="grid grid-flow-col gap-4">
                <a href='https://www.x.com' target='_blank'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4.293 4.293a1 1 0 011.414 0L12 10.586l6.293-6.293a1 1 0 111.414 1.414L13.414 12l6.293 6.293a1 1 0 01-1.414 1.414L12 13.414l-6.293 6.293a1 1 0 01-1.414-1.414L10.586 12 4.293 5.707a1 1 0 010-1.414z"/>
                    </svg>
                </a>
                <a href='https://www.youtube.com' target='_blank'>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className="fill-current">
                        <path
                        d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                    </svg>
                </a>
                <a href='https://www.facebook.com' target='_blank'>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className="fill-current">
                        <path
                        d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                    </svg>
                </a>
            </div>
        </nav>
        <aside>
            <p>Copyright © {new Date().getFullYear()} - All right reserved by Mennat-Allah<br/>Inspired by Frontend Mentor</p>
        </aside>
    </footer>
  )
}
