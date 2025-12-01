import Link from 'next/link'

export default function Success() {
  return (
    <main className='success-pg pt-36 pb-24 px-6 md:px-24 text-center relative min-h-[100vh] bg-fixed'>
      <div className='flex flex-col items-center justify-center'>
        <div className='bg-white rounded-full p-3 shadow-2xl'>
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <h3 className='text-2xl md:text-4xl font-bold text-white my-5'>Payment Successful</h3>
        <p className='text-white md:text-lg lg:w-3/4 font-semibold mb-5'>
          Your payment has been successfully processed. Now you can go to the Home Page & start shorten your links.
        </p>
        <Link href="/" className="bg-[linear-gradient(135deg,_#001F3F,_#003366,_#004aad)] w-2/5 text-center text-xs md:text-sm font-bold text-[#fdfdfd] rounded-3xl cursor-pointer py-2 px-3 md:px-5 transition-all duration-200 mt-4 mb-1">Back To Home</Link>
      </div>
    </main>
  )
}
