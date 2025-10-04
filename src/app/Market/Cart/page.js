'use client';

import Footer from "../../../components/Footer";
import { db, auth } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  onSnapshot,
  where,
  getDocs,
  getDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import Rendering from "../../Rendering";
import Link from "next/link";
import { useCart } from "@/app/Cartcontext";
import { useRouter } from "next/navigation";

export default function Cart() {
  const [UserData, SetUserData] = useState(null);
  const [ProdData, SetProdData] = useState(null);
  const [CouponData, setCouponData] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [items, setItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const { setTotalPrice } = useCart();
  const router = useRouter();

  // Fetch authenticated user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userdataref = collection(db, "UserData");
        const q = query(userdataref, where("email", "==", user.email));
        const unsubscribeData = onSnapshot(
          q,
          (snapshot) => {
            if (!snapshot.empty) {
              const doc = snapshot.docs[0];
              SetUserData({ ...doc.data(), id: doc.id });
            } else {
              SetUserData(null);
            }
          },
          (error) => {
            console.error("Error fetching user data: ", error);
          }
        );

        return () => unsubscribeData();
      } else {
        SetUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch coupon data
  useEffect(() => {
    const fetchCouponData = async () => {
      try {
        const couponref = collection(db, "Coupons");
        const snapshot = await getDocs(couponref);
        const data = snapshot.docs.map((doc) => ({ ...doc.data() }));
        setCouponData(data);
      } catch (error) {
        console.error("Error fetching coupon data: ", error);
      }
    };

    fetchCouponData();
  }, []);

  // Remove item from cart
  const remove = async (itemremoved) => {
    if (!UserData?.Items) return;
    const docref = doc(db, "UserData", UserData.id);
    const NewArr = UserData.Items.filter((item) => item !== itemremoved);

    try {
      await updateDoc(docref, {
        Items: NewArr,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch product data
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Products"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ ...doc.data() }));
      SetProdData(data);
    });

    return () => unsubscribe();
  }, []);

  // Update unique items in cart
  useEffect(() => {
    if (UserData?.Items) {
      const uniqueItems = [...new Set(UserData.Items)];
      if (JSON.stringify(uniqueItems) !== JSON.stringify(items)) {
        setItems(uniqueItems);
      }
    }
  }, [UserData?.Items]);

  // Coupon validation
  const couponval = (e) => {
    e.preventDefault();
    const matchedCoupon = CouponData.find((c) => c.Value === coupon);
    if (matchedCoupon) {
      setDiscount(matchedCoupon.Percentage);
      console.log(`Discount Percentage: ${matchedCoupon.Percentage}`);
    } else {
      setDiscount(0);
      setCoupon("");
      alert("Invalid coupon");
    }
  }

const updateCartPriceInUserData = async () => {
  if (UserData?.email) {
    const userRef = doc(db, 'UserData', UserData.id);
    
    try { 
        const cartPrice = totalcartprice();
        await updateDoc(userRef, {
          CartPrice: cartPrice,
        });
    } catch (error) {
      console.error("Error updating CartPrice: ", error);

};
  }
}

  // Calculate total cart price
  const totalcartprice = () => {
    const total = UserData?.Items?.reduce((total, item) => {
      const price = pricefinder(item);
      return total + (price || 0);
    }, 0);
    return total ? total * (1 - discount / 100) : 0;
  };

  // Find price of an item
  const pricefinder = (itemprod) => {
    const founditem = ProdData?.find((item) => item.Title === itemprod);
    return founditem ? founditem.Price : 0;
  };

  // Calculate total price for an item
  const totalpricefinder = (count, price) => {
    return count * price;
  };

  // Find item count
  const countfinder = (itemprod) => {
    return UserData?.Items?.reduce(
      (count, item) => (item === itemprod ? count + 1 : count),
      0
    );
  };

  // Redirect to payment
  const handlesubmit = () => {
    let totalprice = totalcartprice();
    updateCartPriceInUserData()
    setTotalPrice(totalprice);
    router.push("/Market/Cart/Payment");
  };

  if (UserData === null || !auth?.currentUser || ProdData === null) {
    return <Rendering />;
  }
  
  return (
    <>
      <div className="container max-w-5xl h-full mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          {`Your Shopping Cart ${UserData.email}`}
        </h1>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-left font-medium text-gray-600">
                  Product
                </th>
                <th className="p-4 text-center font-medium text-gray-600">
                  Quantity
                </th>
                <th className="p-4 text-center font-medium text-gray-600">
                  Price
                </th>
                <th className="p-4 text-center font-medium text-gray-600">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item}>
                  <td className="text-left p-2 border-2 shadow">
                    <h1>{item}</h1>
                    <button className="underline hover:text-red-500" onClick={() => remove(item)}>Remove</button>
                  </td>
                  <td className="p-2 border-2 shadow text-center">
                    {countfinder(item)}
                  </td>
                  <td className="p-2 border-2 shadow text-center">
                    {pricefinder(item)}
                  </td>
                  <td className="p-2 border-2 shadow text-center">
                    {totalpricefinder(countfinder(item), pricefinder(item))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-6 flex justify-end items-center space-x-8">
            <p className="font-bold underline underline-offset-8 decoration-orange-500">
              {`${totalcartprice()}AED`}
            </p>
            <form onSubmit={couponval}>
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button type="submit">Apply</button>
            </form>
            <button
              onClick={handlesubmit}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
