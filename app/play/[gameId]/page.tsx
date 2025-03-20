'use client';

import { useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function PlayGame() {
  const { gameId } = useParams();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    // Ensure we have a game ID
    if (!gameId) return;
    
    // Set up any additional integrations or listeners for the game
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://lichess.org') return;
      
      // Handle messages from Lichess iframe if needed
      console.log('Message from Lichess:', event.data);
    };
    
    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [gameId]);
  
  if (!gameId) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-bold mb-4">Game Not Found</h1>
        <p className="mb-4">No game ID was provided.</p>
        <Link 
          href="/dashboard"
          className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto mt-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Playing Chess</h1>
        <Link 
          href="/dashboard"
          className="text-blue-600 hover:underline"
        >
          Return to Dashboard
        </Link>
      </div>
      
      <div className="w-full bg-gray-100 border rounded-lg overflow-hidden" style={{ height: "80vh" }}>
        <iframe
          ref={iframeRef}
          src={`https://lichess.org/embed/${gameId}?theme=auto&bg=auto`}
          width="100%"
          height="100%"
          className="border-0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}