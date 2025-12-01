"use client"

import { useEffect } from 'react';
import Image from 'next/image';
import data from '../../data/faq.json';

export default function FAQ() {

    useEffect(() => {
        window.scrollTo(0,0)
    }, [])
  
  return (
    <main className='py-26 lg:py-30 px-6 md:px-24'>
        <div className='text-center'>
            <h2 className='text-[#2a2a2af2] text-2xl md:text-4xl font-bold mb-3'>Frequently Asked Questions</h2>
            <p className='text-[#7c7c7cbd] md:w-[60%] text-sm md:text-base mx-auto mb-10'>Find quick answers to common questions about our link shortening service, accounts, and pricing.</p>
        </div>
        <div className='flex justify-between items-center flex-col lg:flex-row-reverse gap-3'>
            <div className='faq-img relative flex-1/2 mb-7 md:mb-0 w-full aspect-[6642/5751]'>
                <Image src='/assets/faq-pg.webp' fill alt='FAQ Page Image' className='mx-auto'/>
            </div>
            <div className='flex-1/2'>
               {data && data.faq.map((q) => (
                    <div key={q.id} className="collapse collapse-arrow bg-base-100 border border-base-300">
                        <input type="radio" name="my-accordion-2" defaultChecked={(q.id === 1 === true)} />
                        <div className="collapse-title text-[#2a2a2af2] text-lg font-bold">{q.ques}</div>
                        <div className="collapse-content text-[#2a2a2af2] text-base">{q.ans}</div>
                    </div>
               ))}
            </div>
        </div>
    </main>
  )
}
