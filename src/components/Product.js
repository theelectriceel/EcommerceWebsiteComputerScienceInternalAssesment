'use client'
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { auth,db } from "@/firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Rendering from "@/app/Rendering";
import { use } from "react";
    export default function ClientComponent({ params }) {
    
        const [product, setProduct] = useState(null);
        const [value, setValue] = useState(1);
        const [userData, setUserData] = useState(null);
        const  paramss = params.id
        

 
    useEffect(() => {
        const fetchProduct = async () => {
            const docRef = doc(db, "Products", paramss);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setProduct(docSnap.data());
            } else {
                console.log("No such document!");
            }
        };

        fetchProduct();
    }, [paramss]);

    useEffect(() => {
     
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            
            if (user) {
                const useref = collection(db, 'UserData');
                const q = query(useref, where('email', '==', user?.email));
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    const data = snapshot.docs[0].data();
                    setUserData({ ...data, id: snapshot.docs[0].id });
                } else {
                    console.log("User not found.");
                }
            }
        });

        return()=> unsubscribe();
    }, []);

    async function AddtoCart() {
        if (userData && product) {
            // Ensure Items is an array
            let arrayitems = userData.Items;
            
            // Add the product Title to the cart based on quantity
            for (let i = 0; i < value; i++) {
                arrayitems.push(product.Title);
            }

            const docref = doc(db, 'UserData', userData.id);
            try {
                await updateDoc(docref, {
                    Items: arrayitems,
                });
                console.log('Cart updated successfully.');
            } catch (error) {
                console.error("Error adding to cart:", error);
            }
        } else {
            console.log('User data or product missing');
        }
    }

    if (!product || !userData) {
        return <Rendering />;
    }

    return (
        <main className="bg-gray-100 h-screen">
            <Navbar />
            <div className="max-w-9xl mx-auto px-4 py-8 h-screen flex">
                <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg flex items-center">
                    <div className="flex flex-col lg:flex-row relative w-full">
                        <div className="lg:w-1/2 h-full">
                            <img 
                                src={product.imgsrc} 
                                alt={product.Title} 
                                className="object-cover w-full h-full rounded-lg shadow-md" 
                            />
                        </div>
                        <div className="lg:w-1/2 lg:pl-6 mt-6 lg:mt-0 flex flex-col justify-center">
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.Title}</h1>
                            <div className="block h-1 bg-orange-500 w-11/12 mb-4 -mt-2"></div>
                            <p className="text-gray-600 mb-6">{product.Desc}</p>
                            <p className="text-lg font-semibold text-gray-700">Tag: <span className="text-gray-500">{product.Tag}</span></p>
                            <form action="" className="space-x-3 flex items-center mt-4">
                                <button 
                                    type="button" 
                                    onClick={AddtoCart} 
                                    className="p-4 bg-gradient-to-tr from-orange-700 to-orange-800 text-white font-bold rounded-full hover:text-black hover:bg-gradient-to-tr hover:from-slate-500 hover:to-gray-400 transition">
                                    Add to Cart
                                </button>
                                <p className="text-xl font-bold underline underline-offset-4 bg-orange-500 rounded-full p-2 text-white ">{`${product.Price} Rs`}</p>
                                <div>
                                    <p className="font-bold underline underline-offset-4">Qty</p>
                                    <select onChange={(e) => setValue(parseInt(e.target.value, 10))} value={value}>
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
