"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import Loader from '@/components/Loader'
import Image from 'next/image'

export default function Auth() {

  const router = useRouter()

  const [activeForm, setActiveForm] = useState('login')
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  })

  const [emailAlert, setEmailAlert] = useState(false)
  const [passwordAlert, setPasswordAlert] = useState(false)
  const [passwordMatchAlert, setPasswordMatchAlert] = useState(false)
  const [formAlert, setformAlert] = useState(false)
  const [existedEmailAlert, setExistedEmailAlert] = useState(false)
  const [nonVerifiedEmailAlert, setNonVerifiedEmailAlert] = useState(false)
  const [loginErr, setLoginErr] = useState("")
  const [loading, setLoading] = useState(false)


  const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;

  const handleSignup = async (e) => {
    e.preventDefault()

    if(signupData.name === "" || signupData.email === "" || signupData.password === "" || signupData.confirmPassword === "") {
      setformAlert(true)
      return;
    }
    if(!emailPattern.test(signupData.email)) {
      setEmailAlert(true)
      return;
    }
    if(signupData.password.length < 6) {
      setPasswordAlert(true)
      return;
    }
    if(signupData.password !== signupData.confirmPassword) {
      setPasswordMatchAlert(true)
      return;
    }

    try {
      setLoading(true)

      const userCredential = await createUserWithEmailAndPassword(auth, signupData.email, signupData.password)
      await updateProfile(userCredential.user, {
        displayName: signupData.name
      })
      const user = userCredential.user
      await sendEmailVerification(user)
      router.push('/verify-email')
    } catch (err) {
      if(err.code === "auth/email-already-in-use") {
        setExistedEmailAlert(true)
      }
      console.error("Signup error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    if(loginData.email === "" || loginData.password === "" ) {
      setformAlert(true)
      return;
    }
    if(!emailPattern.test(loginData.email)) {
      setEmailAlert(true)
      return;
    }
    if(loginData.password.length < 6) {
      setPasswordAlert(true)
      return;
    }

    try{
      setLoading(true)

      const userCredential = await signInWithEmailAndPassword(auth, loginData.email, loginData.password)
      const user = userCredential.user
      
      if(!user.emailVerified) {
        setNonVerifiedEmailAlert(true)
        return;
      }
      
      const token = await user.getIdToken()
      document.cookie = `authToken=${token}; path=/; max-age=86400;`;

      router.push('/pricing')
    } catch(err) {
        switch (err.code) {
          case "auth/invalid-credential":
            setLoginErr("Invalid email or password.")
            break
          default:
            setLoginErr("Something went wrong. Please try again.")
        }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='auth-pg py-36 px-6 md:px-24 min-h-[100vh]'>
      <div className='flex justify-between items-center flex-col lg:flex-row gap-3'>
        <div className='lg:flex-1/2 w-full'>
          <div className='bg-white lg:w-4/5 p-6 rounded-xl overflow-hidden'>
            {activeForm === "login" ? (
              <h3 className='text-center text-2xl font-bold text-[#2a2a2af2]'>Login Form</h3>
            ) : (
              <h3 className='text-center text-2xl font-bold text-[#2a2a2af2]'>Signup Form</h3>
            )}
            <div className='flex items-center justify-center m-4 border-[1px] border-[#2a2a2a38] rounded-3xl'>
                <button className={`${activeForm === 'login' ? 'auth-btns text-[#fdfdfd]' : 'bg-[#fdfdfd] !text-[#2a2a2af2]'} w-full text-center text-xs md:text-sm font-bold text-[#fdfdfd] rounded-3xl cursor-pointer py-2 px-3 md:px-5 transition-all duration-200`}
                  onClick={() => setActiveForm("login")}
                >Login</button>
                <button className={`${activeForm === 'signup' ? 'auth-btns text-[#fdfdfd]' : 'bg-[#fdfdfd] !text-[#2a2a2af2]'} w-full text-center text-xs md:text-sm font-bold text-[#fdfdfd] rounded-3xl cursor-pointer py-2 px-3 md:px-5 transition-all duration-200`}
                  onClick={() => setActiveForm("signup")}
                >Signup</button>
            </div>
            {activeForm === "login" ? (
            <div>
              <fieldset className="fieldset text-center rounded-box p-4">
                <label className="label">Email</label>
                <input type="email" value={loginData.email} className="input w-full focus:!outline-0 focus-within:!outline-0 focus:border-[#004aad] rounded-3xl" placeholder="Email" 
                  onChange={(e) => {
                    formAlert && setformAlert(false)
                    emailAlert && setEmailAlert(false)
                    setLoginErr("")
                    setLoginData({...loginData, email: e.target.value})
                  }}
                />
                {emailAlert && (
                <div role="alert" className="alert !p-0 bg-transparent border-none shadow-none text-red-800 text-xs !gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="font-bold">Please enter a valid email address.</span>
                </div>
                )}
                {nonVerifiedEmailAlert && (
                <div role="alert" className="alert !p-0 bg-transparent border-none shadow-none text-red-800 text-xs !gap-1">
                    <span className="font-bold">Please verify your email before logging in.</span>
                </div>
                )}

                <label className="label">Password</label>
                <input type="password" value={loginData.password} className="input w-full focus:!outline-0 focus-within:!outline-0 focus:border-[#004aad] rounded-3xl" placeholder="Password" 
                  onChange={(e) => {
                    formAlert && setformAlert(false)
                    passwordAlert && setPasswordAlert(false)
                    setLoginErr("")
                    setLoginData({...loginData, password: e.target.value})
                  }}
                />
                <Link href='/forget-password' className="link link-primary me-auto">Forget Password?</Link>
                {passwordAlert && (
                  <div role="alert" className="alert !p-0 bg-transparent border-none shadow-none text-red-800 text-xs !gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="font-bold">Write a correct password.</span>
                  </div>
                )}

                {loading ? (
                  <button className="bg-[linear-gradient(135deg,_#001F3F,_#003366,_#004aad)] w-full text-center text-xs md:text-sm font-bold text-[#fdfdfd] rounded-3xl py-1 px-3 md:px-5 transition-all duration-200 mt-4 mb-1" disabled>
                  <Loader/></button>
                ) : (
                  <button type='submit' className="bg-[linear-gradient(135deg,_#001F3F,_#003366,_#004aad)] w-full text-center text-xs md:text-sm font-bold text-[#fdfdfd] rounded-3xl cursor-pointer py-2 px-3 md:px-5 transition-all duration-200 mt-4 mb-1"
                  onClick={handleLogin}>Login</button>
                )}

                <span>Not a member? <button className="link-primary cursor-pointer"
                  onClick={() => setActiveForm("signup")}>Signup now</button></span>

                {formAlert && (
                <div role="alert" className="alert !p-0 bg-transparent border-none shadow-none text-red-800 text-base !gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="font-bold">Warning: Please fill all fields!</span>
                </div>
                )}
                
                <div role="alert" className="alert !p-0 bg-transparent border-none shadow-none text-red-800 text-base !gap-1">
                    <span className="font-bold">{loginErr}</span>
                </div>
              </fieldset>
            </div>

            ) : (

            <div>
              <fieldset className="fieldset text-center rounded-box p-4">
                <label className="label">Full Name</label>
                <input type="text" value={signupData.name} className="input w-full focus:!outline-0 focus-within:!outline-0 focus:border-[#004aad] rounded-3xl" placeholder="Full Name" 
                  onChange={(e) => {
                    formAlert && setformAlert(false)
                    setSignupData({...signupData, name: e.target.value})
                  }}/>
                
                <label className="label">Email</label>
                <input type="email" value={signupData.email} className="input w-full focus:!outline-0 focus-within:!outline-0 focus:border-[#004aad] rounded-3xl" placeholder="Email" 
                  onChange={(e) => {
                    emailAlert && setEmailAlert(false)
                    existedEmailAlert && setExistedEmailAlert(false)
                    formAlert && setformAlert(false)
                    setSignupData({...signupData, email: e.target.value})
                  }}/>
                {emailAlert && (
                <div role="alert" className="alert !p-0 bg-transparent border-none shadow-none text-red-800 text-xs !gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="font-bold">Please enter a valid email address.</span>
                </div>
                )}
                {existedEmailAlert && (
                <div role="alert" className="alert !p-0 items-start bg-transparent border-none shadow-none text-red-800 text-xs !gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="font-bold">Warning: This email is already registered. Please login instead.</span>
                </div>
                )}

                <label className="label">Password</label>
                <input type="password" value={signupData.password} className="input w-full focus:!outline-0 focus-within:!outline-0 focus:border-[#004aad] rounded-3xl" placeholder="Password" 
                  onChange={(e) => {
                    passwordAlert && setPasswordAlert(false)
                    formAlert && setformAlert(false)
                    setSignupData({...signupData, password: e.target.value})
                  }}/>
                {passwordAlert && (
                  <div role="alert" className="alert !p-0 bg-transparent border-none shadow-none text-red-800 text-xs !gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="font-bold">Password should be at least 6 characters.</span>
                  </div>
                )}

                <label className="label">Confirm Password</label>
                <input type="password" value={signupData.confirmPassword} className="input w-full focus:!outline-0 focus-within:!outline-0 focus:border-[#004aad] rounded-3xl" placeholder="Confirm Password"
                  onChange={(e) => {
                    passwordMatchAlert && setPasswordMatchAlert(false)
                    formAlert && setformAlert(false)
                    setSignupData({...signupData, confirmPassword: e.target.value})
                  }}/>
                {passwordMatchAlert && (
                  <div role="alert" className="alert !p-0 bg-transparent border-none shadow-none text-red-800 text-xs !gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="font-bold">Warning: Passwords do not match!</span>
                  </div>
                )}

                {loading ? (
                  <button className="bg-[linear-gradient(135deg,_#001F3F,_#003366,_#004aad)] w-full text-center text-xs md:text-sm font-bold text-[#fdfdfd] rounded-3xl py-1 px-3 md:px-5 transition-all duration-200 mt-4 mb-1" disabled>
                  <Loader/></button>
                ) : (
                  <button type='submit' className="bg-[linear-gradient(135deg,_#001F3F,_#003366,_#004aad)] w-full text-center text-xs md:text-sm font-bold text-[#fdfdfd] rounded-3xl cursor-pointer py-2 px-3 md:px-5 transition-all duration-200 mt-4 mb-1"
                  onClick={handleSignup}>Signup</button>
                )}
                
                {formAlert && (
                <div role="alert" className="alert !p-0 bg-transparent border-none shadow-none text-red-800 text-base !gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="font-bold">Warning: Please fill all fields!</span>
                </div>
                )}
              </fieldset>
            </div>
            )}
          </div>
        </div>
        <div className='lg:flex-1/2 relative w-full aspect-[1672/1320] min-w-[300px] max-w-[800px]'>
          <Image src='/assets/auth-pg.webp' fill alt='Authentication Page Image' className='object-cover'/>
        </div>
      </div>
    </main>
  )
}
