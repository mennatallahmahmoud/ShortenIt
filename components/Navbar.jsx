"use client"

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { deleteUser, onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore'

export default function Navbar() {

    const pathname = usePathname()
    const router = useRouter()

    const mainDropdownRef = useRef(null)
    const userDropdownRef = useRef(null)

    const [openMainDropdown, setOpenMainDropdown] = useState(false)
    const [openUserDropdown, setOpenUserDropdown] = useState(false)
    const [user, setUser] = useState(null)
    const [userName, setUserName] = useState("")
    const [logoutAlert, setLogoutAlert] = useState(false)
    const [deleteAccountAlert, setDeleteAccountAlert] = useState(false)
    const [logoutBeforeDeleteAccount, setLogoutBeforeDeleteAccount] = useState(false)

    useEffect(() => {
        const closeMainDropdown = (e) => {
            if(mainDropdownRef.current && mainDropdownRef.current.contains(e.target)) return
            setTimeout(() => {
                setOpenMainDropdown(false)
            }, 200);
        }

        document.addEventListener("mousedown", closeMainDropdown)
        return () => document.removeEventListener("mousedown", closeMainDropdown)
    }, [openMainDropdown])

    useEffect(() => {
        const closeUserDropdown = (e) => {
            if(userDropdownRef.current && userDropdownRef.current.contains(e.target)) return
            setTimeout(() => {
                setOpenUserDropdown(false)
            }, 200);
        }

        document.addEventListener("mousedown", closeUserDropdown)
        return () => document.removeEventListener("mousedown", closeUserDropdown)
    }, [openUserDropdown])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currUser) => {
            if (!currUser) return;
            try{
                setUser(currUser)
                const userRef = doc(db, "users", currUser.uid)
                const userSnap = await getDoc(userRef)
                setUserName(userSnap.data()?.name || "User")
            } catch(err) {
                console.log(`Error`, err);
            }
        })
        return () => unsubscribe()
    }, [])

    const startBtn = () => {
        if (!user) {
            router.replace('/auth');
            return;
        }

        if (window.location.pathname === '/') {
            window.scrollTo({ top: 140, behavior: 'smooth' });
            document.getElementById("shorten-input")?.focus();
            return;
        }

        router.replace('/#hero');
    }

    const handleLogOut = async () => {
        try {
            await signOut(auth)
            document.cookie = "authToken=; path=/; max-age=0;";
            setUser(null)
            setUserName("")
            setLogoutAlert(false)
            router.replace('/auth')
        } catch(err) {
            console.log(`Error Signing Out`, err);
        }
    }

    const deleteUserData = async (user) => {
        try {
            await deleteDoc(doc(db, "users", user.uid))
            const q = query(collection(db, "links"), where("userId", "==", user.uid))
            const querySnapshots = await getDocs(q)
            for(const docSnap of querySnapshots.docs) {
                await deleteDoc(doc(db, "links", docSnap.id))
            }
        } catch(err) {
            console.log(`Error deleting user data`, err)
            setLogoutBeforeDeleteAccount(true)
        }
    }

    const handleDeleteUser = async() => {
        if (!user) return
        try{
            await deleteUserData(auth.currentUser)
            await deleteUser(auth.currentUser)

            setUser(null)
            setUserName("")

            document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            router.replace('/auth')
        } catch(err) {
            console.log(`Error deleting account`, err);
            setLogoutBeforeDeleteAccount(true)
        }
    }


  return (
    <>
    {pathname === '/auth' || pathname === '/forget-password' ? (
    <Link href='/' className='cursor-pointer absolute top-5 left-5 w-full aspect-[875/262] min-w-[130px] max-w-[220px]'>
        <Image src='/assets/logo-white.png' fill alt="ShortenIt Logo" className='object-cover'/>
    </Link>
    ) : (
    <>
    <nav className="fixed w-full bg-[#f0f1f6] z-30">
        <div className="navbar md:px-5">
            <div className="navbar-start">
                <div className="dropdown" ref={mainDropdownRef} onClick={() => setOpenMainDropdown(!openMainDropdown)}>
                    <div tabIndex={0} role="button" className="p-4 cursor-pointer lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 hover:stroke-[#7c7c7c]" fill="none" viewBox="0 0 24 24" stroke="#004aad"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    {openMainDropdown && (
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li><button className='font-bold text-[#7c7c7c] transition-all duration-200 hover:!text-[#004aad]'
                            onClick={startBtn}>Get Started</button></li>
                        <li><Link href='/pricing' className='font-bold text-[#7c7c7c] transition-all duration-200 hover:!text-[#004aad]'
                        onClick={() => setOpenMainDropdown(false)}>Plans</Link></li>
                        <li><Link href='/faq' className='font-bold text-[#7c7c7c] transition-all duration-200 hover:!text-[#004aad]'
                        onClick={() => setOpenMainDropdown(false)}>FAQ</Link></li>
                    </ul>
                    )}
                </div>
                <Link href='/' className='cursor-pointer relative w-full aspect-[875/262] min-w-[130px] max-w-[220px]'>
                    <Image src='/assets/logo.png' fill alt="ShortenIt Logo" className="object-cover"/>
                </Link>
                <ul className={`menu menu-horizontal px-1 hidden lg:flex lg:ms-5`}>
                    <li><button className='font-bold text-[#7c7c7c] transition-all duration-200 hover:!text-[#004aad]'
                        onClick={startBtn}>Get Started</button></li>
                    <li><Link href='/pricing' className='font-bold text-[#7c7c7c] transition-all duration-200 hover:!text-[#004aad]'>Plans</Link></li>
                    <li><Link href='/faq' className='font-bold text-[#7c7c7c] transition-all duration-200 hover:!text-[#004aad]'>FAQ</Link></li>
                </ul>
            </div>
            <div className="navbar-end">
                {user ? (
                    <div className="dropdown dropdown-end" ref={userDropdownRef} onClick={() => setOpenUserDropdown(!openUserDropdown)}>
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#004aad" className="size-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                            </div>
                        </div>
                        {openUserDropdown && (
                        <ul
                            tabIndex="-1"
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            <li><span className='font-bold text-[#004aad] hover:!bg-transparent text-base cursor-auto'>Hi {userName}</span></li>
                            <li><Link href='/dashboard' className='font-bold text-[#7c7c7c] transition-all duration-200 hover:!text-[#004aad]'>Dashboard</Link></li>
                            <li><button className='font-bold text-[#7c7c7c] transition-all duration-200 hover:!text-[#004aad]' 
                                onClick={() => setLogoutAlert(true)}>Logout</button></li>
                            <li><button className='font-bold text-red-600 transition-all duration-200 hover:!text-red-700'
                                onClick={() => setDeleteAccountAlert(true)}>Delete Account</button></li>
                        </ul>
                        )}
                    </div>
                    ) : (
                    <>
                    <Link href='/auth' className="btn text-xs md:text-sm bg-transparent border-none shadow-none font-bold text-[#636262] transition-all duration-200 hover:!text-[#004aad]">Login</Link>
                    <Link href='/auth' className="text-xs md:text-sm font-bold bg-[#004aad] text-[#fdfdfd] rounded-3xl cursor-pointer py-2 px-3 md:px-5 transition-all duration-200 hover:!bg-[#0160dd]">Sign Up</Link>
                    </>
                )}
            </div>
        </div>
        {user && logoutAlert && (
        <div className="fixed left-1/2 top-1/2 -translate-1/2 bg-[#0000004f] w-full h-full flex justify-center items-center z-40"
            onClick={() => setLogoutAlert(false)}>
            <div role="alert" className="alert alert-vertical gap-1.5 text-[rgba(42,42,42,0.95)]"
                onClick={(e) => e.stopPropagation()}>
                <span>Are you sure you want to logout?</span>
                <div>
                    <button className="btn btn-sm rounded-2xl px-3 ms-2"
                    onClick={() => logoutAlert && setLogoutAlert(false)}
                    >Cancel</button>
                    <button className="btn btn-sm bg-gray-600 hover:!bg-gray-500 text-white rounded-2xl px-3 ms-2"
                        onClick={handleLogOut}>Logout
                    </button>
                </div>
            </div>
        </div>
        )}
        {deleteAccountAlert && (
        <div className="fixed left-1/2 top-1/2 -translate-1/2 bg-[#0000004f] w-full h-full flex justify-center items-center z-40"
            onClick={() => setDeleteAccountAlert(false)}>
            <div role="alert" className="alert alert-vertical gap-1.5 text-[rgba(42,42,42,0.95)]"
                onClick={(e) => e.stopPropagation()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" role="img">
                    <title>Delete</title>
                    <path d="M3 6h18" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 11v6" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 11v6" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Do you really want to delete your account?
                    <br/> All your saved data will be lost forever.</span>
                <div>
                    <button className="btn btn-sm rounded-2xl px-3 ms-2"
                    onClick={() => deleteAccountAlert && setDeleteAccountAlert(false)}
                    >Cancel</button>
                    <button className="btn btn-sm bg-red-600 hover:!bg-red-500 text-white rounded-2xl px-3 ms-2"
                        onClick={() => {
                            handleDeleteUser()
                            setDeleteAccountAlert(false)
                        }}>Delete
                    </button>
                </div>
            </div>
        </div>
        )}
    </nav>
    {logoutBeforeDeleteAccount &&
    <div className="fixed left-1/2 top-1/2 -translate-1/2 bg-[#0000004f] w-full h-full flex justify-center items-center z-40"
          onClick={() => setLogoutBeforeDeleteAccount(false)}>
          <div role="alert" className="alert alert-vertical gap-1.5 text-[rgba(42,42,42,0.95)] mx-3"
            onClick={(e) => e.stopPropagation()}>
            <span>Please sign in again for security reasons before permanently deleting your account?</span>
            <div>
              <button className="btn btn-sm rounded-2xl px-3 ms-2"
                onClick={() => setLogoutBeforeDeleteAccount(false)}>Cancel</button>
              <button className="btn btn-sm bg-red-600 hover:!bg-red-500 text-white rounded-2xl px-4 ms-2"
                onClick={() => {
                handleLogOut()
                setLogoutBeforeDeleteAccount(false)
                }}>Logout</button>
            </div>
          </div>
        </div>
    }
    </>
    )}
  </>
  )
}

