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
    
    // Get the tournament options from the request
    const body = await request.json();
    const { 
      name, 
      clockTime, 
      clockIncrement, 
      minutes, 
      waitMinutes, 
      variant = 'standard'
    } = body;
    
    // Create the tournament via Lichess API
    const response = await fetch('https://lichess.org/api/tournament', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        name,
        clockTime: clockTime.toString(),
        clockIncrement: clockIncrement.toString(),
        minutes: minutes.toString(),
        waitMinutes: waitMinutes.toString(),
        variant,
        // Optional parameters you could add:
        // description: 'Tournament created via EthChess',
        // conditions.teamMember.teamId: 'your-team-id',
        // berserkable: 'true',
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lichess API error:', errorText);
      return NextResponse.json(
        { error: `Failed to create tournament: ${errorText}` }, 
        { status: response.status }
      );
    }
    
    const tournament = await response.json();
    console.log('Tournament created:', tournament);
    
    // Return the tournament data
    return NextResponse.json({
      id: tournament.id,
      url: tournament.url || `https://lichess.org/tournament/${tournament.id}`,
      tournament
    });
  } catch (error) {
    console.error('Error creating tournament:', error);
    return NextResponse.json(
      { error: String(error) }, 
      { status: 500 }
    );
  }
}