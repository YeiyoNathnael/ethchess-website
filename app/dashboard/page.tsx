import { cookies } from 'next/headers';
import Link from 'next/link';
import { config } from '@/lib/config';
import CreateGame from '../components/CreateGame';
import CreateTournament from '../components/CreateTournament';


// Tell Next.js this page should always be dynamically rendered
export const dynamic = 'force-dynamic';

// Server action to get the session
async function getSessionData() {
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

// Function to create a rating badge with appropriate color
function RatingBadge({ rating, gameType }: { rating: number; gameType: string }) {
  // Color logic based on rating
  let color = "bg-gray-100 text-gray-600";
  
  if (rating >= 2200) color = "bg-amber-100 text-amber-800"; // Master
  else if (rating >= 2000) color = "bg-violet-100 text-violet-800"; // Expert
  else if (rating >= 1800) color = "bg-blue-100 text-blue-800"; // Class A
  else if (rating >= 1600) color = "bg-green-100 text-green-800"; // Class B
  else if (rating >= 1400) color = "bg-yellow-100 text-yellow-800"; // Class C
  else if (rating >= 1200) color = "bg-orange-100 text-orange-800"; // Class D
  else color = "bg-red-100 text-red-800"; // Class E and below

  return (
    <div className={`px-3 py-1 rounded-full ${color} inline-flex items-center mr-2 mb-2`}>
      <span className="font-medium">{gameType}: {rating}</span>
    </div>
  );
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
  
  // Calculate time since account creation
  const createdDate = new Date(session.user.createdAt);
  const accountAge = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate total play time in hours
  const playTimeHours = Math.round(session.user.playTime?.total / 3600) || 0;
  
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Welcome, {session.user.name}!</h1>
          <p className="text-gray-600">
            Lichess player for {accountAge} days ({playTimeHours} hours played)
          </p>
        </div>
        <a 
          href={session.user.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          View Lichess Profile →
        </a>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Your Ratings</h2>
        <div className="flex flex-wrap">
          {session.user.perfs?.blitz && (
            <RatingBadge rating={session.user.perfs.blitz.rating} gameType="Blitz" />
          )}
          {session.user.perfs?.rapid && (
            <RatingBadge rating={session.user.perfs.rapid.rating} gameType="Rapid" />
          )}
          {session.user.perfs?.bullet && (
            <RatingBadge rating={session.user.perfs.bullet.rating} gameType="Bullet" />
          )}
          {session.user.perfs?.classical && (
            <RatingBadge rating={session.user.perfs.classical.rating} gameType="Classical" />
          )}
          {session.user.perfs?.puzzle && (
            <RatingBadge rating={session.user.perfs.puzzle.rating} gameType="Puzzle" />
          )}
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Games Played</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {session.user.perfs?.blitz && (
            <div className="p-4 bg-gray-50 rounded border border-gray-200">
              <div className="text-lg font-medium">Blitz</div>
              <div className="text-2xl font-bold">{session.user.perfs.blitz.games}</div>
            </div>
          )}
          {session.user.perfs?.rapid && (
            <div className="p-4 bg-gray-50 rounded border border-gray-200">
              <div className="text-lg font-medium">Rapid</div>
              <div className="text-2xl font-bold">{session.user.perfs.rapid.games}</div>
            </div>
          )}
          {session.user.perfs?.bullet && (
            <div className="p-4 bg-gray-50 rounded border border-gray-200">
              <div className="text-lg font-medium">Bullet</div>
              <div className="text-2xl font-bold">{session.user.perfs.bullet.games}</div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Play Chess</h2>
        <CreateGame />
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">Create Tournament</h2>
          <CreateTournament />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">Join Tournament</h2>
       
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