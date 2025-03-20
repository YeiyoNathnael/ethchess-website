// Make sure your auth.ts file looks like this
import NextAuth from "next-auth";
import LichessProvider from "@/lichess";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    LichessProvider({}), // We're not passing clientId here since it's hardcoded in the provider
  ],
  debug: true,
  pages: {
    error: "/auth/error"
  }
});