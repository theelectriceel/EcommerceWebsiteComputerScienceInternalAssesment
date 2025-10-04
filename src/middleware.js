import { NextResponse } from 'next/server';

export async function middleware(req) {
    const token = req.cookies.get('token'); 
    if (!token) {
        return NextResponse.redirect(new URL('/Login', req.url));
    }

   
    return NextResponse.next(); 
}

export const config = {
    matcher: ['/Market/:path*'], // Matches /Market and any subpath under /Market
};

