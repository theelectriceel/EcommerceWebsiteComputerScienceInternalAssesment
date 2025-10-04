'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Rendering from '@/app/Rendering';
import { db, auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, onSnapshot, where , updateDoc, doc } from 'firebase/firestore';

const UserProfile = () => {
  // Define user state at the top
  const [user, setUser] = useState({
    email: 'username@example.com',
    fullName: '',
    phoneNumber: '',
    profilePicture: '',
    lastLogin: '2024-09-15',
    address: {
      street: '',
      city: '',
      state: '',
      zipcode: '',
      country: ''
    },
    orderHistory: [
      {
        orderId: '',
        items: [],
        totalAmount: 0,
        orderDate: '',
        status: ''
      }
    ]
  });

  const [UserData, SetUserData] = useState(null); // Set initial state to null for loading

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userdataref = collection(db, 'UserData');
        const q = query(userdataref, where('email', '==', authUser.email));
        const unsubscribeData = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            SetUserData(
                { id: doc.id,
                   ...doc.data(),
          }
        );

            // Populate the user state with fetched data
            setUser((prevUser) => ({
              ...prevUser,
              email: doc.data().email,
              fullName: doc.data().fullName || '',
              phoneNumber: doc.data().phoneNumber || '',
              
              address: {
                ...prevUser.address,
                ...doc.data().address,
              },
              order_history: doc.data().order_history || prevUser.order_history
            }));
          } else {
            SetUserData(null);
          }
        }, (error) => {
          console.error('Error fetching user data: ', error);
        });

        return () => unsubscribeData();
      } else {
        SetUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      address: {
        ...user.address,
        [name]: value
      }
    });
  };

  const   handleSubmit =async (e) => {
    e.preventDefault();
    const ref = doc(db, 'UserData', UserData.id)
    try{
            
    await updateDoc(ref, user);
    alert('Sucess');
    }
    catch(error)
    {
        console.error();
    }
        

  };

  if (UserData === null) {
    return <Rendering />; // Loading screen when user data is not yet available
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <Navbar />

      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="tracking-wider font-bold mb-4 text-6xl">
          Welcome, {user.email}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-orange-600"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">Full Name:</label>
            <input
              type="text"
              name="fullName"
              value={user.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-orange-600"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">Phone Number:</label>
            <input
              type="tel"
              name="phoneNumber"
              value={user.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-orange-600"
            />
          </div>

         

          <fieldset className="border border-gray-300 p-4 rounded-md space-y-4">
            <legend className="text-lg font-bold text-orange-600">Address</legend>
            <div className="space-y-2">
              <label className="block text-lg font-medium text-gray-700">Street:</label>
              <input
                type="text"
                name="street"
                value={user.address.street}
                onChange={handleAddressChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-orange-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-lg font-medium text-gray-700">City:</label>
                <input
                  type="text"
                  name="city"
                  value={user.address.city}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-orange-600"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-lg font-medium text-gray-700">State:</label>
                <input
                  type="text"
                  name="state"
                  value={user.address.state}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-orange-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-lg font-medium text-gray-700">Zip Code:</label>
                <input
                  type="text"
                  name="zipcode"
                  value={user.address.zipcode}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-orange-600"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-lg font-medium text-gray-700">Country:</label>
                <input
                  type="text"
                  name="country"
                  value={user.address.country}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-orange-600"
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="border border-gray-300 p-4 rounded-md space-y-4">
            <legend className="text-lg font-bold text-orange-600">Order History</legend>
            {user.order_history.map((order, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 mb-4">
                <p className="text-gray-600"><strong>Order ID:</strong> {order.orderId}</p>
                <p className="text-gray-600"><strong>Items:</strong> {order.items.join(', ')}</p>
                <p className="text-gray-600"><strong>Total Amount:</strong> AED{order.totalAmount}</p>
                <p className="text-gray-600"><strong>Order Date:</strong> {order.timestamp}</p>
                <p className="text-gray-600"><strong>Status:</strong> {order.status}</p>
              </div>
            ))}
          </fieldset>

          <button
            type="submit"
            className="px-4 py-2 bg-orange-600 text-white rounded-md shadow hover:bg-orange-700"
          >
            Save Changes
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default UserProfile;
