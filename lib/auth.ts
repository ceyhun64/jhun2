import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongoose";
import Admin from "@/models/admin"; // Admin modelinizi import edin
import bcrypt from "bcrypt";

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

        // 🔌 MongoDB'ye bağlan
        await connectDB();

        // 🔍 Admin modelinden kullanıcıyı bul
        const admin = await Admin.findOne({ email: credentials.email });

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

        // Giriş başarılı → session'a dönecek veri
        return {
          id: admin._id.toString(), // Mongoose'da _id kullanılır
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
        id: token.id as string,
        name: token.name as string,
        surname: token.surname as string,
        email: token.email as string,
      };
      return session;
    },
  },

  pages: {
    signIn: "/admin/login", // 🔐 özel admin giriş sayfası
  },
};