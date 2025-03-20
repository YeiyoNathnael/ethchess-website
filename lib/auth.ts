import { cookies } from 'next/headers';

export async function getSession() {
  try {
    const cookieStore = cookies();
    const sessionCookie = (await cookieStore).get('user_session');
    
    if (!sessionCookie?.value) {
      return null;
    }
    
    return JSON.parse(sessionCookie.value);
  } catch (e) {
    console.error('Error accessing session cookie:', e);
    return null;
  }
}

export async function isAuthenticated() {
  return await getSession() !== null;
}