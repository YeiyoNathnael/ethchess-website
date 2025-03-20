import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function POST(request: Request) {
  // Get the base URL from the request
  const url = new URL(request.url);
  const protocol = request.headers.get('x-forwarded-proto') || 
                  (url.host.includes('localhost') ? 'http' : 'https');
  const baseUrl = `${protocol}://${url.host}`;
  
  const response = NextResponse.redirect(`${baseUrl}/`);
  
  // Clear the session cookie
  response.cookies.set({
    name: config.cookies.session.name,
    value: '',
    httpOnly: true,
    secure: config.cookies.session.secure,
    path: '/',
    maxAge: 0
  });
  
  return response;
}