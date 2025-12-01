"use client"

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ForgetPassword() {

  const [userEmail, setUserEmail] = useState("")
  const [sendSuccess, setSendSuccess] = useState(false)
  const [emailAlert, setEmailAlert] = useState(false)
  const [resetErr, setResetErr] = useState(false)

  const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!emailPattern.test(userEmail) || userEmail === '') {
      setEmailAlert(true)
      return
    }

    try {
      await sendPasswordResetEmail(auth, userEmail)
      setSendSuccess(true)
    } catch(err) {
      setResetErr(true)
    }
  }

  return (
    <main className="forget-password-pg py-36 px-6 md:px-24 h-[100vh]">
      <div className="text-center text-[#fdfdfd]">
        <h2 className="text-2xl font-bold mb-4">Forget Password?</h2>
        <p className="md:text-lg font-semibold mb-10">Enter your email and we’ll send you a link to reset your password.</p>
        <div className="mb-3">
            <input type="email" className="input lg:w-1/2 focus:!outline-0 focus-within:!outline-0 focus:border-[#004aad] rounded-3xl text-[#2a2a2af2]" placeholder="Enter your email here.." 
              onChange={(e) => {
                emailAlert && setEmailAlert(false)
                sendSuccess && setSendSuccess(false)
                resetErr && setResetErr(false)
                setUserEmail(e.target.value)
              }}/>
            {emailAlert && (
              <div role="alert" className="alert !p-0 bg-transparent border-none shadow-none text-red-600 text-base !gap-1 w-fit mx-auto my-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-bold">Please enter a valid email address.</span>
            </div>
            )}
            <button type='submit' className="bg-[linear-gradient(135deg,_#001F3F,_#003366,_#004aad)] w-1/2 block lg:w-1/3 mx-auto text-center text-sm md:text-base font-bold text-[#fdfdfd] rounded-3xl cursor-pointer py-2 px-3 md:px-5 transition-all duration-200 mt-4 mb-1"
              onClick={handleResetPassword}>Send</button>
        </div>
        {sendSuccess && (
          <span className="block font-bold text-[#fdfdfd] my-4 mx-2">
            If this email is registered, a password reset link has been sent. Please check your email!
          </span>
        )}
        <Link href='/auth' className="link mx-auto text-[#fdfdfd]">Remember your password?</Link>
        {resetErr && (
          <div role="alert" className="alert !p-0 bg-transparent border-none shadow-none text-red-600 text-base !gap-1 w-fit mx-auto my-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-bold">Something went wrong. Please try again.</span>
          </div>
        )}
      </div>
    </main>
  )
}
