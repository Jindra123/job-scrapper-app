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
        // Ensure credentials are defined and typed correctly
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        // Check if user exists and has a password
        if (!user || !user.password) {
          throw new Error("No user found with this email or password not set");
        }

        // Type assertion or check to ensure password is a string
        const isValid = await bcrypt.compare(
          credentials.password as string, // Type assertion if needed
          user.password, // Already checked for null above
        );

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
    Github,
  ],
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/register",
  },
  debug: true,
});
