"use client"

import data from "../../data/plans.json";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { setDoc, getDoc, serverTimestamp, doc } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth";


export default function Pricing() {

  const router = useRouter()

  const [user, setUser] = useState(null)
  const [currPlan, setCurrPlan] = useState("Free")
  const [newPlan, setNewPlan] = useState("")
  const [planName, setPlanName] = useState("")

  useEffect(() => {
      window.scrollTo(0,0)
      const unsubscribe = onAuthStateChanged(auth, (currUser) => {
        setUser(currUser)
      })
      return () => unsubscribe()
  }, [])

  useEffect(() => {

    const chckUserDoc = async () => {
      if (!user) return;

      try{
        const userDoc = doc(db, "users", user.uid)
        const userSnap = await getDoc(userDoc)

        if(!userSnap.exists()) {
          await setDoc(userDoc, {
            name: user.displayName || "",
            email: user.email,
            plan: "Free",
            linksCounter: 0,
            createdAt: serverTimestamp()
          }, {merge: true})
        } else {
          const data = userSnap.data()
          setCurrPlan(data.plan || "Free")
        }

      } catch(err) {
        console.log(`Error Check User Doc!`, err);
      }
    }

    chckUserDoc()

  }, [user])

  const handleBtn = async (plan) => {
    try {
      if (!user) return 
      const userDoc = doc(db, "users", user.uid)
      await setDoc(userDoc, {plan}, {merge: true})
      setCurrPlan(plan)
    } catch (err) {
      console.log(`Error Subscribing`, err);
    }
  }


  return (
    <main className='pricing-pg pt-36 pb-24 px-6 md:px-24 text-center text-white bg-fixed relative'>
      <div>
        <h2 className='text-2xl md:text-4xl font-bold mb-3'>Pick Your Perfect Plan</h2>
        <p className='md:w-[60%] text-sm md:text-base mx-auto text-[#f2f2f2bd] mb-10'>Find the right plan for your needs. Whether you’re just getting started or need more control, we’ve got you covered.</p>
      </div>
      <div className='grid grid-cols-3 text-[#2a2a2af2] gap-5 text-center'>
        {data && (
          data.plans.map((plan) => (
          <div key={plan.name} className='col-span-3 lg:col-span-1 w-full mx-auto'>
            <div className="card bg-[#f9f9f9] shadow-sm">
              <div className="card-body text-left">
                  {plan.badge && (<span className="badge badge-xs badge-warning">Most Popular</span>)}
                  <div className="flex justify-between">
                    <h2 className="text-3xl font-bold">{plan.name}</h2>
                    <span className="text-xl">{plan.price}</span>
                  </div>
                  <ul className="mt-6 flex flex-col gap-2 text-xs">
                    {plan.details.map((d, i) => (
                    <li key={i} className={`${!d.available ? 'opacity-50' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        <span className={`${!d.available ? 'line-through' : ''}`}>{d.text}</span>
                    </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    {currPlan === plan.name && user ? (
                    <button className="text-base w-full font-bold bg-[#4b97fd] text-[#fdfdfd] rounded-4xl py-2.5 px-6 hover:!bg-[#4b97fd] cursor-no-drop" disabled>
                      Current Plan</button>
                    ) : (
                    <button className="text-base w-full font-bold bg-[#004aad] text-[#fdfdfd] rounded-4xl cursor-pointer py-2.5 px-6 transition-all duration-200 hover:!bg-[#0160dd]"
                      onClick={() => {
                        if (!user) router.push('/auth')
                        setNewPlan(plan.name)
                        setPlanName(plan.name)
                      }}>Subscribe</button>
                    )}
                  </div>
              </div>
            </div>
          </div>
          ))
        )}
        {newPlan !== "" && user && (
        <div className="fixed left-1/2 top-1/2 -translate-1/2 bg-[#0000004f] w-full h-full flex justify-center items-center z-40"
          onClick={() => newPlan !== "" && setNewPlan("")}>
          <div role="alert" className="alert alert-vertical sm:alert-horizontal bg-[#f9f9f9] !border-gray-400 gap-1.5 text-[rgba(42,42,42,0.95)] mx-3"
            onClick={(e) => e.stopPropagation()}>
            <span>Are you sure you want to switch to {newPlan} plan?</span>
            <div>
              <button className="btn btn-sm rounded-2xl px-3 ms-2"
                onClick={() => newPlan !== "" && setNewPlan("")}>Cancel</button>
              <button className="btn btn-sm bg-[#004aad] hover:!bg-[#0160dd] text-white rounded-2xl px-4 ms-2"
                onClick={() => {
                  if (newPlan === "Free") handleBtn(newPlan)
                  if (newPlan !== "Free") router.push(`/payment/${encodeURIComponent(planName)}`)
                  setTimeout(() => {
                    setNewPlan("")
                  }, 500);
                }}>Yes</button>
            </div>
          </div>
        </div>
        )}
      </div>
    </main>
  )
}
