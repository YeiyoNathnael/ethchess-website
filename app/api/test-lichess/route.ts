import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { config } from '@/lib/config';

// Utility functions for PKCE
const base64URLEncode = (buffer: Buffer): string => {
  return buffer.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

const sha256 = (str: string): Buffer => crypto.createHash('sha256').update(str).digest();
const createVerifier = () => base64URLEncode(crypto.randomBytes(32));
const createChallenge = (verifier: string) => base64URLEncode(sha256(verifier));

export async function GET(request: Request) {
  // Dynamically determine the base URL from the request
  const headersList = headers();
  const host = (await headersList).get('host') || 'localhost:3007';
  const protocol = request.headers.get('x-forwarded-proto') || 
                  (host.includes('localhost') ? 'http' : 'https');
  const baseUrl = `${protocol}://${host}`;
  
  const clientId = config.lichessClientId;
  const callbackUrl = `${baseUrl}/api/test-lichess/callback`;
  
  // Generate PKCE code verifier and challenge
  const verifier = createVerifier();
  const challenge = createChallenge(verifier);
  
  console.log("TEST ROUTE - Generated verifier:", verifier);
  
  // Create the authorization URL
  const authUrl = new URL('https://lichess.org/oauth');
  authUrl.search = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: callbackUrl,
    scope: 'preference:read challenge:write board:play tournament:write', // Added tournament scopes
    code_challenge_method: 'S256',
    code_challenge: challenge
  }).toString();
  
  // Create the redirect response
  const response = NextResponse.redirect(authUrl.toString());
  
  // Store the verifier in a cookie
  response.cookies.set({
    name: config.cookies.verifier.name,
    value: verifier,
    httpOnly: true,
    secure: config.cookies.verifier.secure,
    sameSite: 'lax',
    path: '/',
    maxAge: config.cookies.verifier.maxAge
  });
  
  return response;
}