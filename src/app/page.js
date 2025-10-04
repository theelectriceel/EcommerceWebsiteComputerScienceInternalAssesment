import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AIhelpy from "../components/AIhelp";

export default function Home() {
  return (
    <div className="relative">
      <Navbar />
<AIhelpy></AIhelpy>
      <section className="py-24 flex items-center min-h-screen justify-center bg-white">
        <div className="mx-auto max-w-[43rem]">
          <div className="text-center">
            <h1 className="-mb-4 text-[4rem] font-bold text-orange-600/75">Marine Reef Paradise</h1>
            <h1 className="text-[3.5rem] font-bold leading-[4rem] tracking-tight text-black">
              Your ultimate source for beautiful corals
            </h1>
            <p className="text-lg leading-relaxed text-slate-400">
              Discover a wide variety of vibrant corals and reef essentials
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <a href="#" className="transform rounded-md bg-orange-500/95 px-5 py-3 font-medium text-white transition-colors hover:bg-indigo-700">
              Browse Catalogue
            </a>
            <a href="#" className="transform rounded-md px-5 py-3 font-medium text-slate-900 transition-colors inline-flex hover:bg-slate-50">
              Get in Touch
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mx-2 animate-bounce">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <section className="min-h-screen bg-gray-100">
        <div className="grid grid-cols-3 gap-2">
          <div className="h-screen w-full relative col-span-2">
            <Image src='/Fish.jpg' layout="fill" objectFit="cover" alt="Coral" />
          </div>
          <div className="flex flex-col text-center justify-start space-y-6 p-4 border-4 shadow-2xl bg-white m-4">
            <h1 className="text-[4rem] font-bold">About Us</h1>
            <p className="leading-[4rem] tracking-wide">
              At Coral Reef Haven, we specialize in offering an exquisite selection of corals and reef products. Our goal is to bring the beauty of the ocean to your aquarium.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 bg-gray-50 sm:py-16 lg:py-24">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">Pricing & Plans</h2>
            <p className="max-w-md mx-auto mt-4 text-base leading-relaxed text-gray-600">
              Choose from our flexible plans to suit your needs for coral and reef supplies.
            </p>
          </div>

          <div className="mt-10">
            <div className="flex items-center justify-center space-x-2.5">
              <span className="text-base font-medium text-gray-900"> Monthly </span>
          
              <button type="button" className="relative inline-flex flex-shrink-0 h-6 py-0.5 transition-colors duration-200 ease-in-out bg-transparent border-2 border-blue-600 rounded-full cursor-pointer w-12 focus:outline-none" role="switch">
                <span aria-hidden="true" className="inline-block w-4 h-4 transition duration-200 ease-in-out translate-x-6 bg-blue-600 rounded-full shadow pointer-events-none"></span>
              </button>
              <span className="text-base font-medium text-gray-900"> Yearly </span>
            </div>
          </div>

          <div className="grid max-w-3xl grid-cols-1 gap-6 mx-auto sm:grid-cols-2 mt-14 md:gap-9">
            <div className="overflow-hidden bg-transparent border-2 border-gray-200 rounded-md">
              <div className="p-6 md:py-8 md:px-9">
                <h3 className="text-xl font-semibold text-black">Basic Coral Plan</h3>
                <p className="mt-2.5 text-sm text-gray-600">Essential features to start your coral collection</p>
                <div className="flex items-end mt-5">
                  <div className="flex items-start">
                    <span className="text-xl font-medium text-black">$</span>
                    <p className="text-6xl font-medium tracking-tight">29</p>
                  </div>
                  <span className="ml-0.5 text-lg text-gray-600"> / month </span>
                </div>
                <a href="#" title="" className="inline-flex items-center justify-center w-full px-4 py-3 mt-6 font-semibold text-gray-900 transition-all duration-200 bg-transparent border-2 rounded-full border-fuchsia-600 hover:bg-fuchsia-600 hover:text-white focus:text-white focus:bg-fuchsia-600">
                  Start 14 Days Free Trial
                </a>
                <ul className="flex flex-col mt-8 space-y-4">
                  <li className="inline-flex items-center space-x-2">
                    <svg className="flex-shrink-0 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-base font-medium text-gray-900">1 Coral Species</span>
                  </li>
                  <li className="inline-flex items-center space-x-2">
                    <svg className="flex-shrink-0 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-base font-medium text-gray-900">Weekly Tips & Guides</span>
                  </li>
                  <li className="inline-flex items-center space-x-2">
                    <svg className="flex-shrink-0 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-base font-medium text-gray-900">Access to Coral Care Resources</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="overflow-hidden bg-white border-2 border-transparent rounded-md">
              <div className="p-6 md:py-8 md:px-9">
                <h3 className="text-xl font-semibold text-black">Premium Coral Plan</h3>
                <p className="mt-2.5 text-sm text-gray-600">Advanced features for experienced coral enthusiasts</p>
                <div className="flex items-end mt-5">
                  <div className="flex items-start">
                    <span className="text-xl font-medium text-black">$</span>
                    <p className="text-6xl font-medium tracking-tight">89</p>
                  </div>
                  <span className="ml-0.5 text-lg text-gray-600"> / month </span>
                </div>
                <a href="#" title="" className="inline-flex items-center justify-center w-full px-4 py-3 mt-6 font-semibold text-gray-900 transition-all duration-200 bg-transparent border-2 rounded-full border-indigo-600 hover:bg-indigo-600 hover:text-white focus:text-white focus:bg-indigo-600">
                  Start 14 Days Free Trial
                </a>
                <ul className="flex flex-col mt-8 space-y-4">
                  <li className="inline-flex items-center space-x-2">
                    <svg className="flex-shrink-0 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-base font-medium text-gray-900">3 Coral Species</span>
                  </li>
                  <li className="inline-flex items-center space-x-2">
                    <svg className="flex-shrink-0 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-base font-medium text-gray-900">Bi-weekly Expert Consultation</span>
                  </li>
                  <li className="inline-flex items-center space-x-2">
                    <svg className="flex-shrink-0 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-base font-medium text-gray-900">Priority Support & Resources</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
