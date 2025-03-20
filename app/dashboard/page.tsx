import { cookies } from 'next/headers';
import Link from 'next/link';
import { config } from '@/lib/config';

// Tell Next.js this page should always be dynamically rendered
export const dynamic = 'force-dynamic';

// Server action to get the session
async function getSessionData() {
  // Wrap the cookies access in a try/catch block
  try {
    const cookieStore = cookies();
    const sessionCookie = (await cookieStore).get(config.cookies.session.name);
    
    if (!sessionCookie?.value) {
      return null;
    }
    
    return JSON.parse(sessionCookie.value);
  } catch (e) {
    console.error('Error accessing session cookie:', e);
    return null;
  }
}

export default async function Dashboard() {
  // Use the server action to get the session data
  const session = await getSessionData();
  
  if (!session) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Not Authenticated</h1>
        <p className="mb-4">You need to sign in to access this page.</p>
        <Link 
          href="/api/test-lichess"
          className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
        >
          Sign in with Lichess
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">User Profile</h2>
        <div className="p-3 bg-gray-50 border border-gray-200 rounded">
          <p><strong>ID:</strong> {session.user.id}</p>
          <p><strong>Username:</strong> {session.user.name}</p>
        </div>
      </div>
      <form action="/api/logout" method="post">
        <button 
          type="submit"
          className="px-4 py-2 bg-red-600 text-white font-medium rounded hover:bg-red-700"
        >
          Sign Out
        </button>
      </form>
    </div>
  );
}