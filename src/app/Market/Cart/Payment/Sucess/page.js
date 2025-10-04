'use client';

import React, { useState, useEffect } from 'react';
import { db, auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, onSnapshot, where, updateDoc, doc } from 'firebase/firestore';
import { useCart } from '@/app/Cartcontext';
import { useRouter } from 'next/navigation';

export default function PaymentSuccessPage() {
    const [userData, setUserData] = useState(null);
    const { cartItems, clearCart } = useCart();  // Assuming useCart has a function to clear the cart
    const router = useRouter();
    const {totalPrice} = useCart();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                const userdataref = collection(db, 'UserData');
                const q = query(userdataref, where('email', '==', authUser.email));
                const unsubscribeData = onSnapshot(q, (snapshot) => {
                    if (!snapshot.empty) {
                        const doc = snapshot.docs[0];
                        setUserData({
                            id: doc.id,
                            ...doc.data(),
                        });
                    } else {
                        setUserData(null);
                    }
                });

                return () => unsubscribeData();
            } else {
                setUserData(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleOrderCompletion = async () => {
        if (userData && cartItems.length > 0) {
            try {
                const userDocRef = doc(db, 'UserData', userData.id);

               
                const updatedOrders = [
                    ...userData.orders || [],  
                    {
                        orderId: Date.now(),   
                        items: cartItems,   
                        totalAmount: {totalPrice},
                        timestamp: new Date().toISOString()
                    }
                ];

                // Update Firestore
                await updateDoc(userDocRef, { orders: updatedOrders });

                // Clear the cart after order is added
                clearCart();

                // Redirect to user profile or another page
                router.push('/Market/UserProfile');

            } catch (error) {
                console.error("Error updating order: ", error);
            }
        }
    };

    useEffect(() => {
        handleOrderCompletion();
    }, [userData]);

    return (
        <div className="container mx-auto p-5">
            <h1 className="text-2xl font-bold">Payment Successful!</h1>
            <p>Your order has been placed successfully.</p>
        </div>
    );
}
