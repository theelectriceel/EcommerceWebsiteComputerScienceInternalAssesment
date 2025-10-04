'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { db, auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, onSnapshot, where, updateDoc, doc } from 'firebase/firestore';
import { useCart } from '@/app/Cartcontext';
import { useRouter } from 'next/navigation';

export default function PaymentSuccessPage() {
    const [userData, setUserData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);  // Loading state for order completion
    const { totalPrice } = useCart();
    const router = useRouter();

    // Function to handle order completion
    const handleOrderCompletion = useCallback(async () => {
        if (userData && userData.Items?.length > 0) {
            setIsProcessing(true);  // Start processing
            try {
                const userDocRef = doc(db, 'UserData', userData.id);

                const updatedOrders = [
                    ...(userData.order_history || []),
                    {
                        orderId: Date.now(),
                        items: userData.Items,
                        totalAmount: userData.CartPrice,
                        status: 'Processing',
                        timestamp: new Date().toISOString(),
                    },
                ];

                await updateDoc(userDocRef, { order_history: updatedOrders, Items: [] });
                console.log("Order successfully completed.");
                setIsProcessing(false);  // Stop processing after order completion
                router.push('/Market');  // Navigate to market page after order is completed
            } catch (error) {
                console.error("Error updating order: ", error);
                setIsProcessing(false);  // Stop processing if there's an error
            }
        }
    }, [userData, router]);

    // Fetch User Data
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                const userdataRef = collection(db, 'UserData');
                const q = query(userdataRef, where('email', '==', authUser.email));
                const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
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

                return () => unsubscribeSnapshot(); // Cleanup Firestore listener
            } else {
                setUserData(null);
            }
        });

        return () => unsubscribeAuth(); // Cleanup Auth listener
    }, []);

    // Trigger order completion when userData changes (userData should be fully loaded first)
    useEffect(() => {
        if (userData && userData.Items?.length > 0) {
            handleOrderCompletion();
        }
    }, [userData, handleOrderCompletion]);

    // Render Loading state or Payment Successful message
    if (isProcessing) {
        return <div className="container mx-auto p-5"><p>Processing your order...</p></div>;
    }

    if (!userData) {
        return <div className="container mx-auto p-5"><p>Loading...</p></div>;
    }

    return (
        <div className="container mx-auto p-5">
            <h1 className="text-2xl font-bold">Payment Successful!</h1>
            <p>Your order has been placed successfully.</p>
    
               
        </div>
    );
}
