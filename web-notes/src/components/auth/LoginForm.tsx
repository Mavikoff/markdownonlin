"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const supabase = createClient();
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
      }
      router.replace("/app");
    } catch (err: any) {
      setError(err?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background text-foreground p-4">
      <div className="w-full max-w-sm border rounded-lg p-6 bg-card shadow-sm">
        <h1 className="text-xl font-semibold mb-4 text-center">
          {mode === "signin" ? "Вход" : "Регистрация"}
        </h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 border rounded-md bg-background"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            className="w-full px-3 py-2 border rounded-md bg-background"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <div className="text-sm text-red-500" role="alert">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full px-3 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black disabled:opacity-60"
            disabled={loading}
          >
            {loading
              ? "Загрузка..."
              : mode === "signin"
              ? "Войти"
              : "Зарегистрироваться"}
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          {mode === "signin" ? (
            <button
              className="underline"
              onClick={() => setMode("signup")}
            >
              Нет аккаунта? Зарегистрироваться
            </button>
          ) : (
            <button className="underline" onClick={() => setMode("signin")}>
              Уже есть аккаунт? Войти
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
