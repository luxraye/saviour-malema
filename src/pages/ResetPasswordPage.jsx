import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export function ResetPasswordPage() {
  const { updatePassword, user } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setReady(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error: err } = await updatePassword(password);
    setLoading(false);

    if (err) {
      setError(err.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => navigate("/admin", { replace: true }), 2000);
  }

  if (!supabase) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-midnight px-5">
        <p className="text-white/60">Supabase is not configured.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-midnight px-5">
      <div className="glass-panel w-full max-w-md p-8">
        <div className="text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-gold/20">
            <KeyRound className="size-6 text-gold" />
          </div>
          <h1 className="mt-5 text-3xl font-black text-white">Set new password</h1>
          <p className="mt-2 text-sm text-white/60">
            {user?.email ? `Updating password for ${user.email}` : "Choose a new admin password."}
          </p>
        </div>

        {!ready ? (
          <div className="mt-8 text-center">
            <p className="text-sm text-white/55">
              Open the reset link from your email to continue. Links expire after a short time.
            </p>
            <Link to="/login" className="mt-4 inline-block text-sm font-bold text-gold hover:text-white">
              Back to sign in
            </Link>
          </div>
        ) : success ? (
          <p className="mt-8 rounded-lg bg-grove/20 px-4 py-3 text-center text-sm font-bold text-grove">
            Password updated. Redirecting to admin…
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
            <label className="admin-field">
              New password
              <input
                required
                type="password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
              />
            </label>
            <label className="admin-field">
              Confirm password
              <input
                required
                type="password"
                minLength={8}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat new password"
              />
            </label>

            {error && (
              <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-bold text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 text-sm font-black text-midnight disabled:opacity-60"
            >
              {loading ? "Saving…" : "Update password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
