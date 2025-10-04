'use client'
import axios from "axios";
import { useState } from "react";
import ReactMarkdown from 'react-markdown'
require("dotenv").config();


export default function AIhelpy() {
    const [ans,setAns] =useState('')
    const [toggle, setToggle] = useState(false);
    const [prompt, setPrompt] = useState('')
    const API = process.env.NEXT_PUBLIC_API_KEY;

let retryCount = 0;

function toggleAIbox() {
    setToggle(!toggle);
}



let userContext = {
    lastQuery: null,
    preferences: {
        language: 'English',
        personality: 'Coral the Marine Biologist', 
    },
};

async function generateanswer(e) {
    e.preventDefault();
    
    if (!prompt || prompt.trim() === '') {
        setAns('Please provide a valid prompt.');
        return;
    }

    setAns('Loading...');

    try {
        
        const cachedResponse = checkCachedAnswer(prompt);
        if (cachedResponse) {
            setAns(cachedResponse);
            return;
        }

     
        const response = await makeAIRequestWithRetry(prompt, 2); 


        let processedAnswer =response;
      

        saveToCache(prompt, processedAnswer);

      
        setAns(processedAnswer);
        
 
        userContext.lastQuery = prompt;

    } catch (error) {
        setAns('An error occurred: ' + error.message);
    }
}


async function makeAIRequestWithRetry(prompt, retries) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); 

    try {
        const response = await axios({
            url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + API,
            method: 'post',
            signal: controller.signal,
            data: createRequestData(prompt),
        });
        
        clearTimeout(timeoutId);
        return response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No valid response';
    
    } catch (error) {
        clearTimeout(timeoutId);
        if (retries > 0 && error.code !== 'ERR_CANCELED') {
            retryCount++;
            return await makeAIRequestWithRetry(prompt, retries - 1);
        } else {
            throw new Error('Failed after multiple retries.');
        }
    }
}
function createRequestData(prompt) {
    return {
        contents: [
            {
                parts: [
                    {
                        text: `${prompt} (Respond as ${userContext.preferences.personality}, with accurate details on marine ecosystems and a focus on ${getSeaLifeTopic(prompt)}). Make it concise and less than 50 words`
                    }
                ]
            }
        ]
    };
}


function getSeaLifeTopic(prompt) {
    if (prompt.toLowerCase().includes('coral')) {
        return 'the impact of climate change on coral reefs';
    } else if (prompt.toLowerCase().includes('whale')) {
        return 'the behavior of whales';
    } else if (prompt.toLowerCase().includes('sharks')) {
        return 'shark migration patterns';
    } else {
        return 'marine ecosystems in general';
    }
}

function checkCachedAnswer(prompt) {
    const cache = localStorage.getItem('ai_cache');
    if (cache) {
        const cachedData = JSON.parse(cache);
        return cachedData[prompt];
    }
    return null;
}


function saveToCache(prompt, answer) {
    let cache = localStorage.getItem('ai_cache');
    cache = cache ? JSON.parse(cache) : {};
    cache[prompt] = answer;
    localStorage.setItem('ai_cache', JSON.stringify(cache));
}



    return (
        <div className="z-10 fixed bottom-0 right-0">
            <div className={`h-[75vh] w-[25vw] ${toggle ? 'block' : 'hidden'} top-0 flex justify-end `}>
                <div className="mb-18  rounded-xl p-4  mx-4 mb-20 bg-white border-4 relative border-black shadow-2xl">
                <h1 className="font-bold text-center text-xl">Hello Friend! My name is coral</h1>
                <h2 className="text-gray-600 text-center text-sm">You can ask me anything about coral!</h2>
               <div className="h-[60%] overflow-y-scroll"><ReactMarkdown>{ans}</ReactMarkdown></div> 
                <form className="absolute flex items-center bottom-0 w-full h-[10%]" onSubmit={generateanswer}>
                    <input type="text" value={prompt} onChange={(e)=> setPrompt(e.target.value)} className="w-[80%]" placeholder="Write Prompt here.."></input>
                    <button type='submit'> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
</svg>
</button>

                </form>
                </div>
            </div>
            <div className="fixed bottom-0 right-0 m-4">
                <div onClick={() => toggleAIbox()} className="bg-orange-600/95 p-2 rounded-full cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="White" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
