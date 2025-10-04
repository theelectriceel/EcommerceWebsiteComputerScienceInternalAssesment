'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {db,auth} from '../firebase'
import Link from 'next/link';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const [isAnimated, setAnimated] = useState(false);
    const [isLogged, setIsLogged] = useState(false);
    const [userData, setUserData] = useState(null);

    
    const router = useRouter();

    function mobileMenuDisp() {
        setAnimated(!isAnimated);
        console.log('clicked');
    }

    async function handleSignOut() {
        try {
            await signOut(auth);
            router.push('/');
            console.log('signed out');
        } catch (error) {
            console.error('Error signing out:', error.message);
        }
    }

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsLogged(true);
                // Proceed with fetching user data
                const usersCollection = collection(db, 'UserData');
                const q = query(usersCollection, where('email', '==', user.email));
                const unsubscribedata = onSnapshot(q, (snapshot) => {
                    if (!snapshot.empty) {
                        setUserData(snapshot.docs[0].data());
                    } else {
                        setUserData(null);
                    }
                });

                return () => {
                    unsubscribedata();
                };
            } else {
                setIsLogged(false);
                setUserData(null);
            }
        });

        return () => {
            unsubscribeAuth();
        };
    }, []);

    return (
        <header className={`${scroll ? 'bg-transparent border-b-4' : 'bg-transparent'} transition fixed inset-x-0 top-0 z-10 w-full`}>
            <div className="px-4 mx-auto sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    <div className="flex-shrink-0">
                        <a href="#" title="" className="flex">
                            <h1>Marine Reef Paradise</h1>
                        </a>
                    </div>

                    <button
                        onClick={mobileMenuDisp}
                        type="button"
                        className="inline-flex p-2 text-black transition-all duration-200 rounded-md lg:hidden focus:bg-gray-100 hover:bg-gray-100"
                    >
                        <svg
                            className="block w-6 h-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>

                    <div className="hidden ml-auto flex-col lg:flex-row lg:flex lg:items-center lg:justify-center lg:space-x-10">
                        {!isLogged ? (
                            <div className="space-x-4">
                                <Link href="/Login" title="" className="text-base font-semibold text-black transition-all duration-200 hover:text-opacity-80">
                                    Log in
                                </Link>
                                <Link href="/Signup" title="" className="inline-flex items-center justify-center px-5 py-2.5 text-base font-semibold transition-all duration-200 rounded-full bg-orange-500 text-white" role="button">
                                    Sign Up
                                </Link>
                            </div>
                        ) : (
                            <div className="space-x-4 flex">
                                <p>{`Welcome ${userData?.email}`}</p>
                                <Link href="/Market/Cart" title="" className="text-base font-semibold flex relative text-black transition-all duration-200 hover:text-opacity-80">
                                    <p className="bg-orange-800 px-[0.3rem] text-white rounded-full absolute -bottom-4 -right-2">
                                        {userData?.Items?.length || 0}
                                    </p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                    </svg>
                                </Link>
                                <button
                                    title=""
                                    className="text-base font-semibold text-black transition-all duration-200 hover:text-opacity-80"
                                    onClick={handleSignOut}
                                >
                                    Sign out
                                </button>
                                <Link href='/Market/UserProfile'>My account</Link>
                                <Link href="/Market">Market</Link>
                                <Link href={'/Market/Admin'} className={`${userData?.Admin ? 'block':'hidden'}`}>Admin</Link>
                                
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <motion.div
                animate={{ y: isAnimated ? 20 : -20, opacity: isAnimated ? 100 : 0 }}
                className="text-center flex w-[100%] flex-col lg:flex-row bg-white lg:flex lg:items-center justify-center lg:space-x-10 space-y-8"
            >
                <div className="flex flex-col w-1/2 mx-auto space-y-8"></div>
            </motion.div>
        </header>
    );
};

export default Navbar;
