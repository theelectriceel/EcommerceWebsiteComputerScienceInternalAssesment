/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../../firebase';
import { addDoc, collection, deleteDoc, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Rendering from '../../Rendering';

export default function Page() {
    const [prodData, setProdData] = useState([]);
    const [option, setOption] = useState('Modify');
    const [updateFormId, setUpdateFormId] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const router = useRouter();

    const initialFormState = { Title: '', Desc: '', Price: 0, Tag: '', imgsrc: '' };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (!auth?.currentUser || auth?.currentUser?.email !== 'abraar.khalid300@gmail.com') {
            router.push('/');
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    useEffect(() => {
        const productRef = collection(db, 'Products');
        const unsubscribe = onSnapshot(productRef, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setProdData(data);
        });
        return () => unsubscribe();
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'Products'), formData);
            setFormData(initialFormState);
        } catch (error) {
            console.error('Error adding document:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'Products', id));
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };

    const handleUpdate = async (e, id) => {
        e.preventDefault();
        try {
            await updateDoc(doc(db, 'Products', id), formData);
            setFormData(initialFormState);
            setUpdateFormId(null);
        } catch (error) {
            console.error('Error updating document:', error);
        }
    };

    if (!isAuthorized) return null;
    if (!prodData.length) return <Rendering />;

    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 flex justify-center items-start p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-screen-xl">
                    <div className="border-4 border-gray-300 p-4 rounded-lg shadow-lg">
                        {['Modify', 'Add'].map((value) => (
                            <button
                                key={value}
                                onClick={() => { setOption(value); setUpdateFormId(null); setFormData(initialFormState); }}
                                className={`w-full border-4 p-2 mb-2 text-xl font-medium rounded-lg ${option === value ? 'bg-orange-800 text-white' : 'bg-white text-black'}`}
                            >
                                {value}
                            </button>
                        ))}
                    </div>
                    <div className="border-4 border-gray-300 overflow-y-auto col-span-1 md:col-span-3 p-4 rounded-lg shadow-lg">
                        {option === 'Modify' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {prodData.map((item) => (
                                    <div key={item.id} className={`text-center border-4 border-gray-300 p-4 rounded-lg shadow-md ${updateFormId === item.id ? 'col-span-2' : ''}`}>
                                        <h1 className="text-lg font-semibold mb-2">{item.Title}</h1>
                                        <p className="mb-2 text-sm">{item.Desc}</p>
                                        <img src={item.imgsrc} className="w-full h-48 object-cover rounded-lg" alt={item.Title} />
                                        <button onClick={() => handleDelete(item.id)}>Delete</button>
                                        <button onClick={() => { setUpdateFormId(item.id); setFormData(item); }}>Update</button>
                                        {updateFormId === item.id && (
                                            <form className="w-full m-4 flex flex-col space-y-4" onSubmit={(e) => handleUpdate(e, item.id)}>
                                                {Object.keys(initialFormState).map((field) => (
                                                    <div key={field}>
                                                        <label className="font-medium">{field}:</label>
                                                        <input
                                                            type={field === 'Price' ? 'number' : 'text'}
                                                            value={formData[field]}
                                                            onChange={(e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }))}
                                                            className="border-2 border-gray-300 p-3 rounded-lg"
                                                        />
                                                    </div>
                                                ))}
                                                <button type="submit" className="p-3 bg-orange-500 text-white font-bold rounded-full border-2 border-black">Submit</button>
                                            </form>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <form className="flex flex-col space-y-4" onSubmit={handleFormSubmit}>
                                {Object.keys(initialFormState).map((field) => (
                                    <div key={field}>
                                        <label className="font-medium">{field}:</label>
                                        <input
                                            type={field === 'Price' ? 'number' : 'text'}
                                            value={formData[field]}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }))}
                                            className="border-2 border-gray-300 p-3 rounded-lg"
                                        />
                                    </div>
                                ))}
                                <button type="submit" className="p-3 bg-orange-500 text-white font-bold rounded-full border-2 border-black">Submit</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
