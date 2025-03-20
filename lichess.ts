import { OAuthConfig, OAuthUserConfig } from 'next-auth/providers';
import { User } from 'next-auth';

interface LichessProfile extends User {
  id: string;
  username: string;
}

export default function LichessProvider(options: OAuthUserConfig<LichessProfile>): OAuthConfig<LichessProfile> {
  const clientId = "ethchess_app";
  
  return {
    id: 'lichess',
    name: 'Lichess',
    type: 'oauth',
    
    // These values are for the NextAuth implementation,
    // but we're actually using our custom routes at /api/auth/lichess
    clientId,
    clientSecret: "",
    authorization: {
      url: 'https://lichess.org/oauth',
      params: {
        scope: 'preference:read'
      }
    },
    token: {
      url: 'https://lichess.org/api/token'
    },
    userinfo: {
      url: 'https://lichess.org/api/account'
    },
    profile(profile) {
      return {
        id: profile.id,
        name: profile.username,
        email: null,
        image: null
      };
    }
  };
}