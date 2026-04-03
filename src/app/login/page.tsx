"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const { login, register, isAuthenticated, isLoading, error, clearError, loginWithGoogle, loginWithGithub } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    setIsAuthReady(true);
  }, []);

  useEffect(() => {
    if (mounted && isAuthReady && !isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [mounted, isAuthenticated, isAuthReady, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsSubmitting(true);
    if (!email || !password) { setIsSubmitting(false); return; }
    try {
      if (isLogin) {
        const success = await login(email, password);
        if (success) router.push("/dashboard");
        else setIsSubmitting(false);
      } else {
        if (!name || password.length < 6) { setIsSubmitting(false); return; }
        const success = await register(email, name, password);
        if (success) router.push("/dashboard");
        else setIsSubmitting(false);
      }
    } catch { setIsSubmitting(false); }
  };

  // Only disable inputs while an active submit is in flight.
  // Do NOT include isLoading here — authStore.isLoading starts as `true` and
  // initialize() is never called on the login page, so including it would
  // permanently disable all inputs before the user can type anything.
  const isDisabled = isSubmitting;

  const handleOAuthLogin = async (provider: "google" | "github") => {
    if (provider === "google") await loginWithGoogle();
    else await loginWithGithub();
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-secondary, #f7f7f7)" }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl font-black text-white transition-all group-hover:translate-y-[-1px]"
            style={{ background: "#ff4b8b", boxShadow: "0 4px 0 #e0357a" }}
          >
            日
          </div>
          <span className="text-xl font-black" style={{ color: "var(--text-primary, #3c3c3c)" }}>
            NIhongood
          </span>
        </Link>
      </div>

      {/* Main card */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">

          {/* Mascot + headline */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-3 animate-bounce-in">🦉</div>
            <h1 className="text-3xl font-black mb-1" style={{ color: "var(--text-primary, #3c3c3c)" }}>
              {isLogin ? "Welcome back!" : "Get started free!"}
            </h1>
            <p className="font-semibold" style={{ color: "var(--text-secondary, #777)" }}>
              {isLogin ? "Continue your Japanese journey" : "Start learning Japanese today"}
            </p>
          </div>

          {/* Card */}
          <div
            className="rounded-2xl p-7 border-2"
            style={{
              background: "var(--bg-card, #fff)",
              borderColor: "var(--border-color, #e5e5e5)",
              boxShadow: "0 4px 0 var(--border-color, #e5e5e5)",
            }}
          >
            {/* OAuth buttons */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                type="button"
                onClick={() => handleOAuthLogin("google")}
                disabled={isDisabled}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all hover:translate-y-[-1px] disabled:opacity-50"
                style={{
                  background: "var(--bg-card, #fff)",
                  borderColor: "var(--border-color, #e5e5e5)",
                  boxShadow: "0 3px 0 var(--border-color, #e5e5e5)",
                  color: "var(--text-primary, #3c3c3c)",
                }}
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => handleOAuthLogin("github")}
                disabled={isDisabled}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all hover:translate-y-[-1px] disabled:opacity-50"
                style={{
                  background: "var(--bg-card, #fff)",
                  borderColor: "var(--border-color, #e5e5e5)",
                  boxShadow: "0 3px 0 var(--border-color, #e5e5e5)",
                  color: "var(--text-primary, #3c3c3c)",
                }}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px" style={{ background: "var(--border-color, #e5e5e5)" }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-secondary, #777)" }}>or</span>
              <div className="flex-1 h-px" style={{ background: "var(--border-color, #e5e5e5)" }} />
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 rounded-xl border-2 border-red-200 bg-red-50 flex items-center gap-2">
                <span>⚠️</span>
                <p className="text-sm font-bold text-red-600">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-black mb-1.5" style={{ color: "var(--text-primary, #3c3c3c)" }}>
                    Your name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sakura Yamamoto"
                    disabled={isDisabled}
                    className="input-field"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-black mb-1.5" style={{ color: "var(--text-primary, #3c3c3c)" }}>
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={isDisabled}
                  className="input-field"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-black" style={{ color: "var(--text-primary, #3c3c3c)" }}>
                    Password
                  </label>
                  {isLogin && (
                    <a href="#" className="text-xs font-bold" style={{ color: "#1cb0f6" }}>
                      Forgot?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isDisabled}
                    className="input-field pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold transition-colors"
                    style={{ color: "var(--text-secondary, #777)" }}
                    disabled={isDisabled}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {!isLogin && (
                  <p className="text-xs font-semibold mt-1.5" style={{ color: "var(--text-secondary, #777)" }}>
                    At least 6 characters
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isDisabled}
                className="btn-primary w-full mt-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </span>
                ) : (
                  isLogin ? "LOG IN" : "CREATE ACCOUNT"
                )}
              </button>
            </form>
          </div>

          {/* Toggle */}
          <div className="mt-5 text-center">
            <p className="font-semibold" style={{ color: "var(--text-secondary, #777)" }}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); clearError(); setEmail(""); setName(""); setPassword(""); }}
                className="font-black transition-colors"
                style={{ color: "#1cb0f6" }}
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>

          {/* Fun fact strip */}
          <div
            className="mt-6 p-4 rounded-2xl border-2 flex items-center gap-3"
            style={{
              background: "rgba(88,204,2,0.07)",
              borderColor: "rgba(88,204,2,0.25)",
            }}
          >
            <span className="text-2xl">🌸</span>
            <p className="text-sm font-bold" style={{ color: "#e0357a" }}>
              Join thousands learning Japanese with spaced repetition!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
