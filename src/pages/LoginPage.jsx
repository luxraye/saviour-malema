import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { signIn, resetPasswordForEmail, user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate("/admin", { replace: true });
    return null;
  }

  async function handleSignIn(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const { error: err } = await signIn(email, password);
    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      navigate("/admin", { replace: true });
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const { error: err } = await resetPasswordForEmail(email);
    setLoading(false);

    if (err) {
      setError(err.message);
      return;
    }

    setMessage("If that email is registered, a reset link has been sent. Check your inbox.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-midnight px-5">
      <div className="glass-panel w-full max-w-md p-8">
        <div className="text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-gold/20">
            {mode === "signin" ? (
              <LogIn className="size-6 text-gold" />
            ) : (
              <Mail className="size-6 text-gold" />
            )}
          </div>
          <h1 className="mt-5 text-3xl font-black text-white">
            {mode === "signin" ? "Admin Sign In" : "Reset password"}
          </h1>
          <p className="mt-2 text-sm text-white/60">
            {mode === "signin"
              ? "Sign in to manage foundation content."
              : "We'll email you a link to choose a new password."}
          </p>
        </div>

        <form
          onSubmit={mode === "signin" ? handleSignIn : handleForgotPassword}
          className="mt-8 grid gap-4"
        >
          <label className="admin-field">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@saviourmalemafoundation.co.bw"
            />
          </label>

          {mode === "signin" && (
            <label className="admin-field">
              Password
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </label>
          )}

          {error && (
            <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-bold text-red-400">
              {error}
            </p>
          )}

          {message && (
            <p className="rounded-lg bg-grove/20 px-4 py-2 text-sm font-bold text-grove">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 text-sm font-black text-midnight disabled:opacity-60"
          >
            {loading
              ? "Please wait…"
              : mode === "signin"
                ? "Sign in"
                : "Send reset link"}
          </button>
        </form>

        <div className="mt-5 text-center text-sm">
          {mode === "signin" ? (
            <button
              type="button"
              onClick={() => {
                setMode("forgot");
                setError("");
                setMessage("");
              }}
              className="font-bold text-gold transition hover:text-white"
            >
              Forgot your password?
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError("");
                setMessage("");
              }}
              className="font-bold text-gold transition hover:text-white"
            >
              Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
