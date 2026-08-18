import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Mock Account",
      credentials: {
        username: { label: "Username (any)", type: "text", placeholder: "player1" },
        password: { label: "Password (any)", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username) return null;
        
        // Mock authentication: create or fetch a user based on the username
        let user = await prisma.user.findFirst({
          where: { email: `${credentials.username}@moneyquest.local` }
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              name: credentials.username,
              email: `${credentials.username}@moneyquest.local`,
            }
          });
        }

        return { id: user.id, name: user.name, email: user.email };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "money_quest_secret_key_12345",
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        // Add the user ID to the session object
        (session.user as any).id = token.sub;
      }
      return session;
    }
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
