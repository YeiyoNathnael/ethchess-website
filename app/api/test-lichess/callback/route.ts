import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  const manualVerifier = url.searchParams.get('verifier'); // Allow passing verifier in URL
  
  // Dynamically determine the base URL from the request
  const protocol = request.headers.get('x-forwarded-proto') || 
                  (url.host.includes('localhost') ? 'http' : 'https');
  const baseUrl = `${protocol}://${url.host}`;
  
  console.log("Callback received with params:", { code, error, manualVerifier });
  
  if (error) {
    return NextResponse.redirect(`${baseUrl}/auth/error?error=${encodeURIComponent(error)}`);
  }
  
  if (!code) {
    return NextResponse.redirect(`${baseUrl}/auth/error?error=No_authorization_code`);
  }
  
  // Try to get the verifier from cookies
  try {
    const cookieStore = cookies();
    const allCookies = (await cookieStore).getAll();
    let verifier = (await cookieStore).get(config.cookies.verifier.name)?.value;
    
    console.log("Cookies in callback:", allCookies.map(c => c.name));
    console.log("Verifier from cookie:", verifier);
    
    // If no verifier in cookie, try the URL parameter
    if (!verifier && manualVerifier) {
      console.log("Using manual verifier from URL param");
      verifier = manualVerifier;
    }
    
    if (!verifier) {
      return NextResponse.redirect(`${baseUrl}/auth/error?error=No_PKCE_verifier`);
    }
    
    const clientId = config.lichessClientId;
    const callbackUrl = `${baseUrl}/api/test-lichess/callback`;
    
    console.log("Making token request with code:", code);
    console.log("Using verifier:", verifier);
    
    // Exchange the authorization code for a token
    const tokenResponse = await fetch('https://lichess.org/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        redirect_uri: callbackUrl,
        client_id: clientId,
        code,
        code_verifier: verifier
      })
    });
    
    const responseText = await tokenResponse.text();
    console.log("Token response status:", tokenResponse.status);
    console.log("Token response:", responseText);
    
    if (!tokenResponse.ok) {
      return NextResponse.redirect(`${baseUrl}/auth/error?error=${encodeURIComponent(`Token request failed: ${responseText}`)}`);
    }
    
    const tokens = JSON.parse(responseText);
    
    // Get the user info
    const userinfoResponse = await fetch('https://lichess.org/api/account', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    });
    
    if (!userinfoResponse.ok) {
      const errorText = await userinfoResponse.text();
      return NextResponse.redirect(`${baseUrl}/auth/error?error=${encodeURIComponent(`Userinfo request failed: ${errorText}`)}`);
    }
    
    const userinfo = await userinfoResponse.json();
    
    // Create a session and redirect to dashboard
    const response = NextResponse.redirect(`${baseUrl}/dashboard`);
    
    // Store user session in a cookie
    response.cookies.set({
      name: config.cookies.session.name,
      value: JSON.stringify({
        user: {
          id: userinfo.id,
          name: userinfo.username,
        },
        accessToken: tokens.access_token
      }),
      httpOnly: true,
      secure: config.cookies.session.secure,
      sameSite: 'lax',
      path: '/',
      maxAge: config.cookies.session.maxAge
    });
    
    return response;
  } catch (error) {
    return NextResponse.redirect(`${baseUrl}/auth/error?error=${encodeURIComponent(String(error))}`);
  }
}