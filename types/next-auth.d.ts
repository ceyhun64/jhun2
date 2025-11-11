import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    surname: string;
    email: string;
    name: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      surname: string;
      email: string;
      name: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    surname: string;
    email: string;
    name: string;
  }
}
