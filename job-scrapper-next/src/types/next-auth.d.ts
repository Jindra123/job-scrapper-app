import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      type: "user" | "company";
    } & DefaultSession["user"];
  }

  interface User {
    type: "user" | "company";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    type: "user" | "company";
  }
}
