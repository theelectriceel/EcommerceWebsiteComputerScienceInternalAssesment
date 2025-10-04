'use client'
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";
import { db, auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import Link from "next/link";
import Rendering from "../Rendering";

export default function Page() {
    const router = useRouter();

    const [productdata, setProductdata] = useState([]);
    const [filters, setFilter] = useState([]);
    const [search, setSearch] = useState('');
    const [filtereddata, setFiltereddata] = useState([]);
    const [isRendering , setIsrendering] = useState(true);

    const handleFilterChange = (filterName) => {
        setFilter((prevFilters) =>
            prevFilters.includes(filterName)
                ? prevFilters.filter((f) => f !== filterName)
                : [...prevFilters, filterName]
        );
    };

    useEffect(() => {
        const productref = collection(db, 'Products');
        
        const unsubscribe = onSnapshot(productref, (snapshot) => {
            const datas = snapshot.docs.map((doc) =>({
id:doc.id,
             ...doc.data()
        }));
            setProductdata(datas);
            setIsrendering(false)
        });

        onAuthStateChanged(auth, (user) => {
            if (!user) router.push('/Login');
        });

        return () => {
            unsubscribe();
        };
    }, [router]);

    useEffect(() => {
        let filtered = productdata;

        if (search.length > 0) {
            filtered = filtered.filter((item) =>
                item.Title.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (filters.length > 0) {
            filtered = filtered.filter((item) =>
                filters.includes(item.Tag)
            );
        }

        setFiltereddata(filtered);
    }, [search, filters, productdata]);

    if(isRendering)
    {
        return(
            <Rendering/>
        )
    }
    else{
    return (
        <section>
            <Navbar />
            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <h2 className="text-[4rem] font-bold tracking-wider">Discover our Products</h2>
                    <div className="block w-1/2 h-2 bg-orange-500"></div>
                    <div>
                        <h1 className={`${filters.length === 0 ? 'hidden invisible' : 'text-[2rem] font-bold'}`}>Filters Chosen</h1>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search products..."
                            className="w-1/2 rounded-full px-4 py-2 mt-4 border border-gray-300 "
                        />
                        <div className="w-full flex">
                            {filters.map((items, index) => (
                                <div key={index} className="flex m-3">
                                    <h1>{` - ${items}`}</h1>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-6">
                        <div className="w-1/3">
                            <aside className="w-64 bg-white p-6 h-screen">
                                <h2 className="text-xl font-bold mb-4">Filter</h2>
                                <div className="block w-1/2 h-1 my-2 bg-orange-500"></div>
                                <div className="space-y-2">
                                    <label className="block">
                                        <input type="checkbox" className="mr-2 leading-tight" onChange={() => handleFilterChange('Coral')} />
                                        <span className="text-gray-700">Coral</span>
                                    </label>
                                    <label className="block">
                                        <input type="checkbox" className="mr-2 leading-tight" onChange={() => handleFilterChange('Reef')} />
                                        <span className="text-gray-700">Reef</span>
                                    </label>
                                    <label className="block">
                                        <input type="checkbox" className="mr-2 leading-tight" onChange={() => handleFilterChange('Aquarium')} />
                                        <span className="text-gray-700">Aquarium</span>
                                    </label>
                                </div>
                            </aside>
                        </div>

                        <div className="col-span-5 mt-8 grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-x-4">
                            {filtereddata.map((items) => (
                                <Link href={`/Market/Product/${items.id}`}
                                    className={`border-2 relative rounded-xl max-h-[75vh] shadow-xl flex flex-col justify-center m-2 hover:opacity-70 transition duration-400`}
                                    key={items.id}
                                    id={items.id}
                                >
                                    <div className="items-center inset-0 top-0 flex absolute h-1/2">
                                        <img src={items.imgsrc} className="object-cover inset-0 w-full h-full" />
                                    </div>
                                    <div className="space-y-2 p-2 absolute bottom-0 h-1/2">
                                        <h1 className="font-bold text-center text-[1.25rem]">{items.Title}</h1>
                                        <p className="h-3/6 overflow-hidden">{items.Desc}</p>
                                        <p>{items.Tag}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </section>
    )
}
}