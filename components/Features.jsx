
export default function Features() {
  return (
    <main id="features" className='py-10 lg:py-15 text-center'>
        <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#2a2a2af2] mb-3">Simplify Your Links</h2>
            <p className="text-[#7c7c7cbd] text-xs md:text-sm md:w-[70%] lg:w-[50%] mx-auto">Manage your links effortlessly with smart tools that make shortening, tracking, and organizing URLs easier than ever.</p>
        </div>
        <div className="py-15 px-5 md:px-40">
            <div className="grid grid-cols-3 gap-3 lg:gap-6">
                <div className="col-span-3 lg:col-span-1 shadow-lg bg-white p-5 text-left relative rounded-sm">
                    <span className="bg-[#004aad] absolute -top-5 left-1/2 -translate-x-1/2 lg:left-6 lg:translate-x-0 p-3 rounded-[50%]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#7ebcf4" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                        </svg>
                    </span>
                    <h3 className="text-[#2a2a2af2] font-bold mt-7 mb-2">Quick Link Shortening</h3>
                    <p className="text-[#7c7c7cbd] text-xs md:text-sm">Instantly convert long, messy URLs into clean and shareable links with just one click.</p>
                </div>
                <div className="col-span-3 lg:col-span-1 shadow-lg bg-white p-5 text-left relative top-5 rounded-sm before:absolute before:w-1.5 before:h-8 lg:before:w-6 lg:before:h-1.5 before:bg-[#004aad] before:-top-8 lg:before:top-12 before:left-1/2 before:-translate-x-1/2 lg:before:translate-x-0 lg:before:-left-6 after:absolute after:w-1.5 lg:after:w-6 after:h-8 lg:after:h-1.5 after:bg-[#004aad] after:-bottom-8 lg:after:top-12  after:right-1/2 after:translate-x-1/2 lg:after:translate-x-0 lg:after:-right-6 ">
                    <span className="bg-[#004aad] absolute -top-5 left-1/2 -translate-x-1/2 lg:left-6 lg:translate-x-0 p-3 rounded-[50%]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#7ebcf4" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
                        </svg>
                    </span>
                    <h3 className="text-[#2a2a2af2] font-bold mt-7 mb-2">Link History & Management</h3>
                    <p className="text-[#7c7c7cbd] text-xs md:text-sm">Create an account to save, organize, and access all your shortened links anytime.</p>
                </div>
                <div className="col-span-3 lg:col-span-1 shadow-lg bg-white p-5 text-left relative top-10 rounded-sm">
                    <span className="bg-[#004aad] absolute -top-5 left-1/2 -translate-x-1/2 lg:left-6 lg:translate-x-0 p-3 rounded-[50%]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#7ebcf4" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                    </span>
                    <h3 className="text-[#2a2a2af2] font-bold mt-7 mb-2">Detailed Insights</h3>
                    <p className="text-[#7c7c7cbd] text-xs md:text-sm">Track the performance of your links with real-time click statistics and engagement data.</p>
                </div>
            </div>
        </div>
    </main>
  )
}
