import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

declare module "next-auth" {
  interface User {
    role?: string; 
  }
}

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
              role: user.role, 
            };
          }
        }

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
              role: company.role,
            };
          }
        }

        throw new Error("Invalid email or password");
      },
    }),
    Github({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/register",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "github" && user.email) {
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || user.email.split("@")[0],
              role: "USER",
            },
          });
        }

        user.id = dbUser.id;
        user.role = dbUser.role;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          role: token.role as string,
        };
      }
      return session;
    },
  },
  debug: true,
});
