'use client'
import { db, auth } from "@/firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import Rendering from "@/app/Rendering";
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation';
import { useCart } from "@/app/Cartcontext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutPage from "@/components/checkout";

export default function Payment() {
  const [UserData, SetUserData] = useState(null);
  const [ProdData, SetProdData] = useState(null);
  const [Items, setItems] = useState([]);
  const router = useRouter();

  const searchParams = useSearchParams();
  const stripepromise = loadStripe(process.env.NEXT_PUBLIC_PUBLISHKEY);
  
  const { totalPrice } = useCart();
  
  function converttosubcurrency() {
    // Convert AED to INR first, then to paise (1 INR = 100 paise)
    const priceInINR = totalPrice;
    return Math.round(priceInINR * 100); // Convert to paise
  }

  useEffect(() => {
    if (UserData?.Items) {
      const uniqueItems = [...new Set(UserData.Items)]; // Ensure items are unique
      setItems(uniqueItems);
    }
  }, [UserData?.Items]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userdataref = collection(db, 'UserData');
        const q = query(userdataref, where('email', '==', user.email));
        const unsubscribeData = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            SetUserData(doc.data());
          } else {
            SetUserData(null);
          }
        }, (error) => {
          console.error("Error fetching user data: ", error);
        });

        return () => unsubscribeData();
      } else {
        SetUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'Products'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data() }));
      SetProdData(data);
    });
    return () => unsubscribe();
  }, []);

  const totalcartprice = () => {
    const total = UserData?.Items.reduce((total, item) => {
      const price = pricefinder(item);
      return total + (price || 0);
    }, 0);
    return total ? total * (1 - discount / 100) : 0;
  };

  const pricefinder = (itemprod) => {
    const founditem = ProdData?.find(item => item.Title === itemprod);
    return founditem ? founditem.Price : 0;
  };

  const totalpricefinder = (count, price) => {
    return count * price;
  };

  const countfinder = (itemprod) => {
    return UserData?.Items.reduce((count, item) => (item === itemprod ? count + 1 : count), 0);
  };

  // Ensure we don't render the page until data is loaded
  if (UserData === null || ProdData === null) {
    return <Rendering />;
  } else {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <ul className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <li className="mb-2"><strong>Email:</strong> {UserData.email}</li>
          <li className="mb-2"><strong>Full Name:</strong> {UserData.fullname}</li>
          <li className="mb-2"><strong>Phone Number:</strong> {UserData.phonenumber}</li>
          <li className="mb-2"><strong>Address:</strong> {UserData.address.length > 0 ? UserData.address.join(', ') : 'No address on file'}</li>
          <div>
            {Items.map((item) => (
              <div key={item} className="flex">
                <div className="text-left p-2 border-2 shadow">
                  <h1>{item}</h1>
                </div>
                <div className="p-2 border-2 shadow text-center">{countfinder(item)}</div>
                <div className="p-2 border-2 shadow text-center">AED{pricefinder(item)}</div>
                <div className="p-2 border-2 shadow text-center">
                  AED{totalpricefinder(countfinder(item), pricefinder(item))}
                </div>
              </div>
            ))}
            <p className="font-bold text-xl p-4">{totalPrice} AED</p>
          </div>
        </ul>

        <div className="p-4">
          <Elements
            stripe={stripepromise}
            options={{
              mode: 'payment',
              amount: converttosubcurrency(),
              currency: 'aed',  // Set currency to INR
            }}
          >
            <CheckoutPage />
          </Elements>
        </div>
      </div>
    );
  }
}
