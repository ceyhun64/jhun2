"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginMessage("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) setLoginMessage("❌ Hatalı email veya şifre!");
      else if (res?.ok) {
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();

        if (sessionData?.user?.role !== "ADMIN") {
          setLoginMessage("❌ Bu alan sadece adminler için!");
          return;
        }

        setLoginMessage("✅ Giriş başarılı! Yönlendiriliyorsunuz...");
        setTimeout(() => router.push("/admin/dashboard"), 1000);
      } else setLoginMessage("❌ Bilinmeyen bir hata oluştu.");
    } catch (error) {
      console.error(error);
      setLoginMessage("❌ Giriş sırasında bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-linear-to-b from-[#0a0f25] to-[#101a3b]">
      {/* Minimal glow arka plan */}
      <div className="absolute inset-0 bg-linear-to-tr from-[#0f1326] to-[#081024] opacity-60 blur-[60px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg p-8"
      >
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/favicon.ico"
            alt="Logo"
            width={60}
            height={60}
            className="mb-3"
          />
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Admin Panel
          </h1>
          <p className="text-gray-300 mt-1 text-center text-sm">
            Yönetici girişi için kimlik doğrulaması yapın
          </p>
        </div>

        <Separator className="my-5 bg-white/20" />

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <Label className="text-gray-200 flex items-center gap-2">
              <Mail size={16} /> E-posta
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@jhun.com"
              className="mt-2 bg-black/20 text-white placeholder-gray-400 border border-gray-600 focus:border-sky-400 focus:ring-sky-400"
            />
          </div>

          <div>
            <Label className="text-gray-200 flex items-center gap-2">
              <Lock size={16} /> Şifre
            </Label>
            <div className="relative mt-2">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="bg-black/20 text-white placeholder-gray-400 border border-gray-600 focus:border-sky-400 focus:ring-sky-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-linear-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-sky-500/40 transition-all"
          >
            {isLoading ? "Yükleniyor..." : "Giriş Yap"}
          </Button>
        </form>

        {loginMessage && (
          <p
            className={`mt-4 text-center text-sm ${
              loginMessage.includes("başarılı")
                ? "text-green-400"
                : "text-red-500"
            }`}
          >
            {loginMessage}
          </p>
        )}

        <p className="text-center text-gray-400 text-xs mt-6">
          © {new Date().getFullYear()} .jhun Admin System
        </p>
      </motion.div>
    </div>
  );
}
