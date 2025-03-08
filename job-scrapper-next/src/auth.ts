import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        // Check User table
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (user && user.password) {
          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password,
          );
          if (isValid) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              type: "user",
            };
          }
        }

        // Check Company table
        const company = await prisma.company.findUnique({
          where: { email: credentials.email as string },
        });
        if (company && company.password) {
          const isValid = await bcrypt.compare(
            credentials.password as string,
            company.password,
          );
          if (isValid) {
            return {
              id: company.id,
              name: company.name,
              email: company.email,
              type: "company",
            };
          }
        }

        throw new Error("Invalid email or password");
      },
    }),
    Github,
  ],
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/register",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        token.id = user.id; // From User
        token.type = account.type; // From Account (e.g., "oauth", "credentials")
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id;
      }
      if (token.type) {
        session.user.type = token.type;
      }
      return session;
    },
  },
  debug: true,
});
