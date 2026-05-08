import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate("/admin", { replace: true });
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: err } = await signIn(email, password);
    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      navigate("/admin", { replace: true });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-midnight px-5">
      <div className="glass-panel w-full max-w-md p-8">
        <div className="text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-gold/20">
            <LogIn className="size-6 text-gold" />
          </div>
          <h1 className="mt-5 text-3xl font-black text-white">Admin Sign In</h1>
          <p className="mt-2 text-sm text-white/60">Sign in to manage foundation content.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
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

          {error && (
            <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-bold text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 text-sm font-black text-midnight disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
