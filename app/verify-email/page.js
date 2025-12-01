"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function VerifyYourEmail () {

    const router = useRouter()

    const [userEmail, setUserEmail] = useState("")
    const [checkingEmailAlert, setCheckingEmailAlert] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    
    const handleVerification = useCallback(async() => {
        const user = auth.currentUser;
        if (!user) return;
        setUserEmail(user.email)
        try {
            await user.reload()
            if(user.emailVerified) {
                router.push('/auth')
            } else setCheckingEmailAlert(true)
        } catch(err) {
            console.log(`Reload Failed`, err);
        }
    }, [router])

    useEffect(() => {
        let interval;
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) return
            interval = setInterval(handleVerification, 2000)
        })
        return () => {
            clearInterval(interval)
            unsubscribe()
        }
    }, [handleVerification, router])


    return (
        <main className="verify-pg absolute z-50 w-full min-h-[100vh] flex justify-center items-center px-7">
            <div className="text-center">
                <div className="relative aspect-[1968/2346] w-full min-w-[200px] max-w-[220px] mx-auto">
                    <Image src='/assets/verify-email-pg.webp' fill alt="Verify Email Page Image" className="object-cover"/>
                </div>
                <div className="mt-7 text-[#fdfdfd]">
                    <h3 className="font-bold text-2xl md:text-3xl mb-5">Thanks for signing up!</h3>
                    <p className="text-lg font-semibold">We’ve sent a verification link to: <span className="font-bold underline">{userEmail}</span>
                        , Click the link in the email to complete your registration.
                        <br/>If you didn’t receive the email, check your spam folder.
                    </p>
                </div>
                <button className="bg-[#f0f1f6] text-center text-xs md:text-sm font-bold text-[#004aad] hover:text-[#f0f1f6] rounded-3xl cursor-pointer py-2 px-3 md:px-5 transition-all duration-200 mt-4 mb-1"
                    onClick={() => {
                        handleVerification()
                        setCheckingEmailAlert && setShowAlert(true)
                    }}>
                    I’ve Verified My Email
                </button>
                {showAlert && (
                <div role="alert" className="alert !p-0 bg-transparent border-none shadow-none text-red-600 text-base !gap-1 w-fit mx-auto my-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="hidden md:block h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="font-bold">Your email is not verified yet. Please check your inbox and spam folder for the verification link.</span>
                </div>
                )}
            </div>
        </main>
    )
}