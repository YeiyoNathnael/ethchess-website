import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { config } from '@/lib/config';

export async function POST(request: Request) {
  try {
    // Get the session to verify the user is logged in and get the access token
    const cookieStore = cookies();
    const sessionCookie = (await cookieStore).get(config.cookies.session.name);
    
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const session = JSON.parse(sessionCookie.value);
    const accessToken = session.accessToken;
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }
    
    // Get the game options from the request
    const body = await request.json();
    const { time, increment, color, variant = 'standard' } = body;
    
    // Create a challenge via Lichess API
    const response = await fetch('https://lichess.org/api/challenge/open', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clock: {
          limit: time * 60,
          increment: increment
        },
        color: color,
        variant: variant
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lichess API error:', errorText);
      return NextResponse.json(
        { error: `Failed to create game: ${errorText}` }, 
        { status: response.status }
      );
    }
    
    const challenge = await response.json();
    console.log('Challenge created:', challenge);
    
    // Return the challenge data
    return NextResponse.json({
      gameId: challenge.id,
      url: challenge.url || `https://lichess.org/${challenge.id}`,
      challenge
    });
  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}