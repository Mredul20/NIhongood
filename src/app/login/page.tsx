"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register, isAuthenticated, isLoading, error, clearError, loginWithGoogle, loginWithGithub } = useAuthStore();
  const router = useRouter();

  // Pre-generate random positions for floating kana (fixes hydration mismatch)
  const kanaPositions = useMemo(() => {
    return ["あ", "カ", "さ", "テ", "の", "ヒ", "む", "レ", "お", "キ"].map((char, i) => ({
      char,
      fontSize: 40 + (i * 7) % 60,
      top: (i * 13) % 100,
      left: (i * 17 + 5) % 100,
      delay: (i * 0.3) % 3,
      duration: 3 + (i * 0.4) % 4,
    }));
  }, []);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [mounted, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsSubmitting(true);

    if (!email || !password) {
      setIsSubmitting(false);
      return;
    }

    try {
      if (isLogin) {
        const success = await login(email, password);
        if (success) {
          router.push("/dashboard");
        }
      } else {
        if (!name) {
          setIsSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setIsSubmitting(false);
          return;
        }
        const success = await register(email, name, password);
        if (success) {
          router.push("/dashboard");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    if (provider === "google") {
      await loginWithGoogle();
    } else {
      await loginWithGithub();
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sakura-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-400/5 rounded-full blur-3xl" />

        {/* Floating kana - using pre-generated positions */}
        {kanaPositions.map((kana, i) => (
          <div
            key={i}
            className="absolute text-white/[0.03] font-japanese select-none animate-float"
            style={{
              fontSize: `${kana.fontSize}px`,
              top: `${kana.top}%`,
              left: `${kana.left}%`,
              animationDelay: `${kana.delay}s`,
              animationDuration: `${kana.duration}s`,
            }}
          >
            {kana.char}
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
              onClick={() => { setIsLogin(true); clearError(); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isLogin ? "bg-sakura-500/20 text-sakura-400" : "text-slate-400 hover:text-slate-300"
              }`}
              id="login-tab"
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); clearError(); }}
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
                  disabled={isSubmitting || isLoading}
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
                disabled={isSubmitting || isLoading}
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
                disabled={isSubmitting || isLoading}
              />
              {!isLogin && (
                <p className="text-xs text-slate-500 mt-1">Must be at least 6 characters</p>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-slide-up">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary w-full flex items-center justify-center gap-2" 
              id="submit-btn"
              disabled={isSubmitting || isLoading}
            >
              {(isSubmitting || isLoading) ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-navy-900 text-slate-500">or continue with</span>
            </div>
          </div>

          {/* OAuth buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleOAuthLogin("google")}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all text-sm font-medium"
              disabled={isSubmitting || isLoading}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuthLogin("github")}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all text-sm font-medium"
              disabled={isSubmitting || isLoading}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>

          {/* Info */}
          <div className="mt-6 p-3 rounded-xl bg-teal-500/5 border border-teal-500/10">
            <p className="text-xs text-teal-400/70 text-center">
              Your progress syncs across devices with your account
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
