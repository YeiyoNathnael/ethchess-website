'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
      <p className="mb-4">Something went wrong during authentication:</p>
      <div className="p-3 bg-red-50 border border-red-200 rounded mb-4">
        <code>{error || 'Unknown error'}</code>
      </div>
      <Link 
        href="/"
        className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
      >
        Return to Home
      </Link>
    </div>
  );
}