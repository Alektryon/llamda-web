import NextAuth from "next-auth"
import Auth0Provider from "next-auth/providers/auth0"

console.log("Auth0 configuration:", {
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET?.slice(0, 5) + '...',
  issuer: process.env.AUTH0_ISSUER,
})

const handler = NextAuth({
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      issuer: `https://${process.env.AUTH0_ISSUER}`,
      authorization: { params: { scope: "openid email profile" } },
      wellKnown: `${process.env.AUTH0_ISSUER}/.well-known/openid-configuration`
    }) 
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log("Redirect callback:", { url, baseUrl })
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async jwt({ token, account, profile }) {
      console.log("JWT callback:", { token, account, profile })
      return token
    },
    async session({ session, token, user }) {
      console.log("Session callback:", { session, token, user })
      return session
    }
  },
  events: {
    async signIn(message) { console.log("SignIn event:", message) },
    async signOut(message) { console.log("SignOut event:", message) },
    async createUser(message) { console.log("CreateUser event:", message) },
    async linkAccount(message) { console.log("LinkAccount event:", message) },
    async session(message) { console.log("Session event:", message) },
  }
})

export { handler as GET, handler as POST }