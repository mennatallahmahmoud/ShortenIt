"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import Image from "next/image"
import { collection, getDocs, orderBy, query, where, deleteDoc, doc, getDoc } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

export default function Dashboard() {

  const router = useRouter()

  const [userLinks, setUserLinks] = useState([])
  const [successCopy, setSuccessCopy] = useState(false)
  const [deleteAlert, setDeleteAlert] = useState(false)
  const [userPlan, setUserPlan] = useState("")

  useEffect(() => {
    window.history.replaceState(null, null, window.location.href);
  }, []);


  useEffect(() => {
      let timer = setTimeout(() => {
          setSuccessCopy(false)
      }, 3000)
      return () => clearTimeout(timer)
  }, [successCopy])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
      if (!user) return

      try {
        const q = query(
          collection(db, "links"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        )

        const querySnapshot = await getDocs(q)
        const linksData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        setUserLinks(linksData)

        const userRef = doc(db, "users", user.uid)
        const userSnap = await getDoc(userRef)
        setUserPlan(userSnap.data().plan)

      } catch(err) {
        console.log(`Error Fetching Links`, err);
      }
    })

    return () => unsubscribe()
  }, [])

  const handleDeleteLink = async (id) => {
    try{
      await deleteDoc(doc(db, "links", id))
      setUserLinks(prev => prev.filter(link => link.id !== id))
    } catch(err) {
      console.log(`Error Deleting`, err);
    }
  }

  return (
    <main className='py-26 lg:py-30 px-6 md:px-24 relative min-h-[100vh]'>
        <div className='text-center'>
          <h2 className='text-[rgba(42,42,42,0.95)] text-2xl md:text-4xl font-bold mb-3'>Manage Your Links</h2>
          <p className='text-[#7c7c7cbd] md:w-[60%] text-sm md:text-base mx-auto'>View, copy, or delete your shortened URLs anytime, all in one place.</p>
        </div>
        <div className='mt-10 md:px-16'>
          <button className='text-base md:text-lg font-bold bg-[#004aad] text-[#fdfdfd] rounded-3xl cursor-pointer py-2 px-4 md:px-7 transition-all duration-200 hover:!bg-[#0160dd]'
            onClick={() => router.push('/#hero')}>New short link +</button>
        </div>
        {userLinks.length !== 0 ? (
        <>
        {userPlan === "Free" && (
        <div className="absolute z-20 inset-0 p-4 text-center bg-gray-800/60 backdrop-blur-sm flex flex-col gap-3 items-center justify-center ">
          <span className="text-lg md:text-xl text-white font-bold">Upgrade your plan to unlock your links</span>
          <Link href='/pricing' className="btn bg-[#004aad] hover:!bg-[#0160dd] text-white rounded-3xl px-5 !border-none !shadow-none">Upgrade Plan</Link>
        </div>
        )}
        <div className="grid grid-cols-3 mt-10 gap-4 md:px-16">
          {userLinks.map((link) => (
          <div className='col-span-3 lg:col-span-1' key={link.id}>
            <div className="card bg-[#f9f9f9] card-sm shadow-sm hover:shadow-lg min-h-32">
              <div className="card-body justify-between overflow-auto">
                <div className='flex justify-center items-center gap-2'>
                  <div className="hidden md:block relative w-full min-w-[20px] max-w-[60px] aspect-[266/233]">
                    <Image src='/assets/favicon.png' fill className='object-cover' alt="ShortenIt Logo"/>
                  </div>
                  <div>
                    <h4 className="card-title text-[#004aad] underline cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(link.shortUrl)
                        setSuccessCopy(true)
                      }}>{link.shortUrl}</h4>
                    <p className='text-[#7c7c7c] text-[10px] break-all line-clamp-2'>{link.longUrl}</p>
                  </div>
                </div>
                <div className="justify-end card-actions !gap-0.5">
                  <button className="btn btn-xs bg-green-700 hover:!bg-green-600 text-white rounded-2xl px-3"
                    onClick={() => {
                      navigator.clipboard.writeText(link.shortUrl)
                      setSuccessCopy(true)
                    }}>Copy</button>
                  <button className="btn btn-xs bg-red-600 hover:!bg-red-500 text-white rounded-2xl px-3"
                    onClick={() => setDeleteAlert(true)}>Delete</button>
                </div>
              </div>
            </div>
            {deleteAlert && (
            <div className="fixed left-1/2 top-1/2 -translate-1/2 bg-[#0000004f] w-full h-full flex justify-center items-center z-40"
              onClick={() => deleteAlert && setDeleteAlert(false)}>
              <div role="alert" className="alert alert-vertical bg-[#f9f9f9] !border-gray-400 gap-1.5 text-[rgba(42,42,42,0.95)]"
                onClick={(e) => e.stopPropagation()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" role="img">
                  <title>Delete</title>
                  <path d="M3 6h18" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 11v6" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 11v6" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Are you sure you want to delete this link?</span>
                <div>
                  <button className="btn btn-sm rounded-2xl px-3 ms-2"
                    onClick={() => deleteAlert && setDeleteAlert(false)}>Cancel</button>
                  <button className="btn btn-sm bg-red-600 hover:!bg-red-500 text-white rounded-2xl px-3 ms-2"
                    onClick={() => {
                      handleDeleteLink(link.id)
                      setDeleteAlert(false)
                    }}>Delete</button>
                </div>
              </div>
            </div>
            )}
          </div>
          ))}
        </div>
        </>
        ) : (
        <div className="text-center mt-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto w-22 h-22 text-[#004aad] opacity-70 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.828 10.172a4 4 0 00-5.656 0L3 15.344a4 4 0 105.657 5.657l1.415-1.415m5.657-9.9a4 4 0 015.657 0 4 4 0 010 5.657l-5.657 5.657a4 4 0 11-5.657-5.657l1.415-1.415"
            />
          </svg>
          <span className="text-xl md:text-2xl font-bold">No links yet!</span>
        </div>
        )}
        {successCopy && (
        <div role="alert" className="alert alert-success fixed top-2.5 right-2.5 text-white font-bold z-30">
          <span>Link copied!</span>
        </div>
        )}
    </main>
  )
}
