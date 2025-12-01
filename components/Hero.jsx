"use client"

import Loader from "./Loader"
import { useEffect, useState } from "react"
import Image from "next/image"
import { collection, serverTimestamp, addDoc, doc, getDoc, updateDoc } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"

export default function Hero() {

    const [longUrl, setLongUrl] = useState("")
    const [shortUrl, setShortUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [successCopy, setSuccessCopy] = useState(false)
    const [alert, setAlert] = useState(false)
    const [linksLimitAlert, setLinksLimitAlert] = useState(false)
    const [guestLimitAlert, setGuestLimitAlert] = useState(false)

    useEffect(() => {
        let timer = setTimeout(() => {
            setSuccessCopy(false)
        }, 3000)
        return () => clearTimeout(timer)
    }, [successCopy])

    const shortenUrl = async () => {
        const res = await fetch("/api/shorten", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: longUrl.trim() })
        });

        const data = await res.json();

        if (data?.data?.tiny_url) {
            return data.data.tiny_url;
        } else {
            console.log("err", data);
        }
    }

    const saveGuestLinksToLS = () => {
        const today = new Date().toLocaleDateString()
        const data = JSON.parse(localStorage.getItem("guestLinks")) || {date: today, counter: 0}

        if(data.date !== today) {
            data.date = today
            data.counter = 0
        }

        if (data.counter < 5) {
            data.counter = data.counter + 1
            localStorage.setItem("guestLinks", JSON.stringify(data))
            return true
        } else {
            setGuestLimitAlert(true)
            return false
        }
    }

    const handleShorten = async () => {
        const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/

        if (!longUrl.trim() || !urlPattern.test(longUrl.trim())) {
            setAlert(true)
            return;
        };

        try {
            const user = auth.currentUser

            if(!user) {
                if(saveGuestLinksToLS()) {
                    setLoading(true)
                    const newShortUrl = await shortenUrl()
                    if(newShortUrl) setShortUrl(newShortUrl)
                }
            }
        
            const userRef = doc(db, "users", user.uid)
            const userSnap = await getDoc(userRef)

            if(!userSnap.exists()) return;

            const {plan, linksCounter} = userSnap.data()
            let limit;

            if(plan === "Free") {
                limit = 50
            } else if(plan === "Basic") {
                limit = 200
            } else if(plan === "Pro") {
                limit = Infinity
            }

            if(linksCounter >= limit) {
                setLinksLimitAlert(true)
                return;
            }

            setLoading(true)
            const newShortUrl = await shortenUrl()
            if(!newShortUrl) return;
            setShortUrl(newShortUrl)

            await updateDoc(userRef, {
                linksCounter: linksCounter + 1
            })

            await addDoc(collection(db, "links"), {
                longUrl,
                shortUrl: newShortUrl,
                createdAt: serverTimestamp(),
                userId: user.uid
            })
          
        } catch (err) {
            console.log("Error in handleShorten:", err);
        } finally {
            setLoading(false)
        }
    };

  return (
    <main id="hero" className='pt-16 lg:pt-30'>
      <div className='flex flex-col lg:flex-row items-center justify-center px-5 lg:px-16 py-16 lg:py-12 text-center lg:text-left'>
        <div className='flex-[55%] mb-5 md:mb-0'>
            <h1 className='text-[#2a2a2af2] text-3xl md:text-5xl font-bold mb-4'>Shorten, Organize, and Save Your Links</h1>
            <p className='text-[#7c7c7cbd] text-sm md:text-base font-semibold w-[90%] mx-auto lg:mx-0 mb-12 lg:mb-7'>Shorten your links for free in seconds. Create an account to save, organize, and manage them anytime, anywhere.</p>
            <div className='input-fie p-5 rounded-lg md:w-[90%] mx-auto lg:mx-0'>
                {shortUrl ? (
                <div className='relative flex flex-col md:flex-row justify-around items-center gap-3'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="size-6 cursor-pointer absolute -top-3 -right-3"
                        onClick={() => {
                            setLongUrl("")
                            setShortUrl("")
                            setLoading(false)
                        }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                    <p className='text-white underline text-lg cursor-pointer' 
                        onClick={() => {
                            navigator.clipboard.writeText(shortUrl)
                            setSuccessCopy(true)
                        }}>{shortUrl}</p>
                    <button className="btn rounded-lg border-none shadow-none text-white transition duration-200 bg-[#004aad] hover:bg-[#0160dd] font-bold"
                        onClick={() => {
                            navigator.clipboard.writeText(shortUrl)
                            setSuccessCopy(true)                            
                        }}>Copy
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6" />
                        </svg>
                    </button>
                </div>
                ) : (
                loading ? 
                (<Loader />) : 
                (<div className='flex flex-col md:flex-row justify-between items-center gap-3 relative'>
                    <input id="shorten-input" type="text" placeholder="Shorten the link here..." className="input w-full caret-[#004aad] rounded-lg bg-[#f9f9f9] outline-none focus-within:border-none focus:border-none focus:outline-none" 
                        onChange={(e) => {
                            setLongUrl(e.target.value)
                            if (alert) setAlert(false)
                        }} />
                    <button className="btn rounded-lg border-none shadow-none text-white transition duration-200 bg-[#004aad] hover:bg-[#0160dd] font-bold" 
                        onClick={handleShorten}>Shorten It!</button>
                                
                {alert && (
                    <div role="alert" className="alert bg-transparent border-none shadow-none text-red-800 text-xs absolute -bottom-[30px] !gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="font-bold">Warning: Please enter a valid URL!</span>
                    </div>
                )}
                {linksLimitAlert && (
                    <div role="alert" className="alert bg-transparent !px-0 border-none shadow-none text-red-800 text-[10px] md:text-xs absolute -bottom-[30px] !gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="font-bold">You’ve reached the limit of your plan.</span>
                    </div>
                )}
                {guestLimitAlert && (
                    <div role="alert" className="alert bg-transparent !px-0 border-none shadow-none text-red-800 text-[10px] md:text-xs absolute -bottom-[30px] !gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="font-bold">Daily limit reached. Please sign up to continue.</span>
                    </div>
                )}
                </div>)
                
                )}
            </div>
        </div>
        <div className='img-cont flex-[45%] mt-12 lg:mt-0'>
            <div className="relative w-full aspect-[4808/3270] min-w-[300px]">
                <Image src='/assets/hero.webp' fill className="object-cover" alt='Hero Image'/>
            </div>
        </div>
      </div>
        {successCopy && (
        <div role="alert" className="alert alert-success fixed top-2.5 right-20 text-white font-bold z-30">
            <span>Link copied!</span>
        </div>
        )}
    </main>
  )
}
