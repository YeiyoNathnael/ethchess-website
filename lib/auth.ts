import { cookies } from 'next/headers';

export async function getSession() {
  const cookieStore = cookies();
  const sessionCookie = (await cookieStore).get('user_session');
  
  if (!sessionCookie?.value) {
    return null;
  }
  
  try {
    return JSON.parse(sessionCookie.value);
  } catch (e) {
    return null;
  }
}

export async function isAuthenticated() {
  return await getSession() !== null;
}