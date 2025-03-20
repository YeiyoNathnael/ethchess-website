export const config = {
  // Base URL of your application 
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 
         (process.env.NODE_ENV === 'production' 
            ? 'https://your-production-domain.com' 
            : 'http://localhost:3007'),
            
  // Lichess client ID
  lichessClientId: process.env.LICHESS_CLIENT_ID || "ethchess_app",
  
  // Cookie settings
  cookies: {
    // For session cookies
    session: {
      name: 'user_session',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      secure: process.env.NODE_ENV === 'production',
    },
    // For PKCE verifier
    verifier: {
      name: 'lichess_verifier',
      maxAge: 600, // 10 minutes
      secure: process.env.NODE_ENV === 'production',
    }
  }
};