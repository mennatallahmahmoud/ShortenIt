import Link from 'next/link'

export default function CTA() {
  return (
    <main>
      <div className="cta-sec px-6 py-10 md:px-20 md:py-20 text-center">
        <h3 className="text-xl md:text-3xl text-white font-bold mb-5">Ready to Simplify Your Links?</h3>
        <Link href='/pricing' className="text-lg md:text-xl font-bold bg-[#67a7e7] text-[#fdfdfd] rounded-4xl cursor-pointer py-2.5 px-6 transition-all duration-200 hover:!bg-[#87b8e9]">Get Started</Link>
      </div>
    </main>
  )
}
