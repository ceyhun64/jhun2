import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./db";
import bcrypt from "bcrypt"; // bcrypt yerine bcryptjs kullanmak genelde daha sorunsuzdur

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email ve şifre gereklidir.");
        }

        // 🔍 Admin tablosundan kullanıcıyı bul
        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email },
        });

        if (!admin) {
          throw new Error("Admin bulunamadı.");
        }

        // 🔑 Şifre kontrolü
        const isValid = await bcrypt.compare(
          credentials.password,
          admin.password
        );
        if (!isValid) {
          throw new Error("Geçersiz şifre.");
        }

        // Giriş başarılı → session’a dönecek veri
        return {
          id: admin.id.toString(),
          name: admin.name,
          surname: admin.surname,
          email: admin.email,
        };
      },
    }),
  ],

  // Session JWT olarak tutulacak
  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  // 🔁 Token ve session callbackleri
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.surname = user.surname;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        surname: token.surname,
        email: token.email,
      };
      return session;
    },
  },

  pages: {
    signIn: "/admin/login", // 🔐 özel admin giriş sayfası
  },
};
