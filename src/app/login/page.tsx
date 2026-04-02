"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  const { login, register, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [mounted, isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (isLogin) {
      const success = login(email, password);
      if (!success) {
        setError("Invalid email or password");
        return;
      }
    } else {
      if (!name) {
        setError("Please enter your name");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      const success = register(email, name, password);
      if (!success) {
        setError("An account with this email already exists");
        return;
      }
    }

    router.push("/dashboard");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sakura-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-400/5 rounded-full blur-3xl" />

        {/* Floating kana */}
        {["あ", "カ", "さ", "テ", "の", "ヒ", "む", "レ", "お", "キ"].map((char, i) => (
          <div
            key={i}
            className="absolute text-white/[0.03] font-japanese select-none animate-float"
            style={{
              fontSize: `${40 + Math.random() * 60}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            {char}
          </div>
        ))}
      </div>

      <div className="w-full max-w-md animate-scale-in relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-sakura-400 to-sakura-600 text-4xl font-bold mb-4 shadow-2xl shadow-sakura-500/30 animate-pulse-glow">
            日
          </div>
          <h1 className="text-3xl font-bold text-slate-100 mb-1">NIhongood</h1>
          <p className="text-slate-400">Master Japanese, the smart way</p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8">
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-navy-800/60 rounded-xl mb-6">
            <button
              onClick={() => { setIsLogin(true); setError(""); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isLogin ? "bg-sakura-500/20 text-sakura-400" : "text-slate-400 hover:text-slate-300"
              }`}
              id="login-tab"
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(""); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                !isLogin ? "bg-sakura-500/20 text-sakura-400" : "text-slate-400 hover:text-slate-300"
              }`}
              id="register-tab"
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="animate-slide-up">
                <label className="block text-sm text-slate-400 mb-1.5">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  placeholder="Your name"
                  id="input-name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                id="input-email"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                id="input-password"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-slide-up">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full" id="submit-btn">
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 p-3 rounded-xl bg-teal-500/5 border border-teal-500/10">
            <p className="text-xs text-teal-400/70 text-center">
              💡 This is an MVP — just register with any email & password to get started!
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          日本語がいい — Japanese is good! 🌸
        </p>
      </div>
    </div>
  );
}
