"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

export default function Payment() {

    const router = useRouter()

    const params = useSearchParams()
    const price = params.get("price")
    const plan = params.get("name")

    const [user, setUser] = useState(null)
    const [cardInfo, setCardInfo] = useState({
        cardNum: "",
        cardName: "",
        cardDate: "",
        cardPass: "",
        saveCard: false
    })
    const [payMethod, setPayMethod] = useState("Credit Card")
    const [errorAlert, setErrorAlert] = useState("")
    const [showAlert, setShowAlert] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currUser) => {
            setUser(currUser)
        })
        return () => unsubscribe()
    }, [])

    const checkCardInfo = () => {
        const cardNumPattern = /^\d{13,19}$/;
        const cardNamePattern = /^[A-Za-z\s]{2,50}$/
        const cardDatePattern = /^(0[1-9]|1[0-2])\/\d{2}$/
        const cardPassPattern = /^\d{3,4}$/

        try{
            if (cardInfo.cardNum === '' || !cardNumPattern.test(cardInfo.cardNum)) {
                setErrorAlert("Please enter a valid card number (13–19 digits).")
                setShowAlert(true)
                return
            }
            if (cardInfo.cardName === '' || !cardNamePattern.test(cardInfo.cardName)) {
                setErrorAlert("Please enter the name as it appears on the card.")
                setShowAlert(true)
                return
            }
            if (cardInfo.cardDate === '' || !cardDatePattern.test(cardInfo.cardDate)) {
                setErrorAlert("Please enter a valid expiry date in MM/YY format.")
                setShowAlert(true)
                return
            }
            if (cardInfo.cardPass === '' || !cardPassPattern.test(cardInfo.cardPass)) {
                setErrorAlert("Please enter a valid CVV (3–4 digits).")
                setShowAlert(true)
                return
            }
            changePlan()
        } catch(err) {
            console.log(`Error Loading Card Info`, err)
        }
    }

    const changePlan = async () => {
        try{
            if (!user) return
            const userDoc = doc(db, "users", user.uid)
            await setDoc(userDoc, {plan}, {merge: true})
            router.push('/success')
        } catch(err) {
            console.log(`Error change plan`, err)
        }
    }

  return (
    <main className='payment-pg pt-36 pb-24 px-6 md:px-24 text-center relative min-h-[100vh] bg-fixed'>
      <div className="card bg-base-100 shadow-2xl lg:w-1/2 mx-auto">
        <fieldset className="fieldset !border-none rounded-box border p-8">
            <h3 className='text-4xl font-bold text-[#2a2a2af2] mb-3'>{price}</h3>
            <div className='text-left flex items-center'>
                <input type="radio" id='fake-card' name="fake-payment" className="accent-[#004aad] w-5 h-5 me-2" defaultChecked 
                    onChange={() => setPayMethod("Credit Card")}/>
                <label htmlFor="fake-card" className='text-sm md:text-base text-[#2a2a2af2] font-bold cursor-pointer'>Credit/Debit Card</label>
                <Image width={100} height={100} src="/assets/visa.webp" alt='Visa Icon' className="ms-auto"/>
            </div>
            <span className="rounded-3xl px-3 py-2 bg-[#004bad17] w-fit text-[#004aad] text-left text-xs">Pay securely with your Bank Account using Visa or Mastercard</span>
            <div className='text-left mt-5 relative'>
                <label className="label font-bold  bg-white absolute -top-3 left-5 z-10 p-1">Card Num.</label>
                <input type="text" className="input block w-full focus:!outline-0 focus-within:!outline-0 focus:border-[#004aad] rounded-3xl" placeholder="XXXX XXXX XXXX XXXX" 
                    onChange={(e) => {
                        setCardInfo({...cardInfo, cardNum: e.target.value})
                        setErrorAlert("")
                        setShowAlert(false)
                    }}/>
            </div>
            <div className='text-left mt-5 relative'>
                <label className="label font-bold  bg-white absolute -top-3 left-5 z-10 p-1">Name on Card</label>
                <input type="text" className="input block w-full focus:!outline-0 focus-within:!outline-0 focus:border-[#004aad] rounded-3xl" placeholder="Name on Card" 
                    onChange={(e) => {
                        setCardInfo({...cardInfo, cardName: e.target.value})
                        setErrorAlert("")
                        setShowAlert(false)
                    }}/>
            </div>
            <div className='flex flex-col md:flex-row items-center justify-between md:gap-6'>
                <div className='text-left mt-5 relative w-full'>
                    <label className="label font-bold  bg-white absolute -top-3 left-5 z-10 p-1">Expire Date</label>
                    <input type="text" className="input block focus:!outline-0 focus-within:!outline-0 focus:border-[#004aad] rounded-3xl" placeholder="M/Y" 
                        onChange={(e) => {
                            setCardInfo({...cardInfo, cardDate: e.target.value})
                            setErrorAlert("")
                            setShowAlert(false)
                        }}/>
                </div>
                <div className='text-left mt-5 relative w-full'>
                    <label className="label font-bold  bg-white absolute -top-3 left-5 z-10 p-1">CVV Code</label>
                    <input type="password" className="input block focus:!outline-0 focus-within:!outline-0 focus:border-[#004aad] rounded-3xl" placeholder="XXX" 
                        onChange={(e) => {
                            setCardInfo({...cardInfo, cardPass: e.target.value})
                            setErrorAlert("")
                            setShowAlert(false)
                        }}/>
                </div>
            </div>
            <div className='mt-3 text-left flex items-center'>
                <input id='save-card' type="checkbox" className="checkbox checkbox-xs checkbox-primary !border-[#004aad] checked:!bg-[#004aad]" 
                    onChange={() => setCardInfo({...cardInfo, saveCard: true})}/>
                <label htmlFor='save-card' className='text-xs ms-1 text-[#2a2a2af2] cursor-pointer'>Save card for future payments</label>
            </div>

            <div className='text-left flex items-center mt-6'>
                <input type="radio" id='fake-paypal' name="fake-payment" className="accent-[#004aad] w-5 h-5 me-2" 
                    onChange={() => setPayMethod("PayPal")}/>
                <label htmlFor='fake-paypal' className='text-base text-[#2a2a2af2] font-bold cursor-pointer'>PayPal</label>
                <Image width={90} height={90} src={"/assets/paypal.webp"} alt='Visa Icon' className="ms-auto"/>
            </div>
            <span className="rounded-3xl py-2 px-3 bg-[#004bad17] w-fit text-[#004aad] text-left mt-1.5">
                You will be redirected to PayPal to complete your paymment securely.
            </span>

            <button type='submit' className="bg-[linear-gradient(135deg,_#001F3F,_#003366,_#004aad)] w-full text-center text-xs md:text-sm font-bold text-[#fdfdfd] rounded-3xl cursor-pointer py-2 px-3 md:px-5 transition-all duration-200 mt-4 mb-1"
                onClick={() => {
                    if(payMethod === "PayPal") {
                        window.open("https://www.paypal.com/eg", "_blank")
                    } else {
                        checkCardInfo()
                    }
                }}>Pay NOW</button>
            {showAlert && (
            <div role="alert" className="alert !p-0 bg-transparent border-none shadow-none text-red-800 text-xs !gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-bold">{errorAlert}</span>
            </div>
            )}
        </fieldset>
      </div>
    </main>
  )
}
