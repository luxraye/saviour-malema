import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    return () => subscription.unsubscribe();
  }, []);

  async function signIn(email, password) {
    if (!supabase) return { error: { message: "Supabase not configured" } };
    return supabase.auth.signInWithPassword({ email, password });
  }

  async function signOut() {
    if (!supabase) return;
    return supabase.auth.signOut();
  }

  async function getAccessToken() {
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }

  async function resetPasswordForEmail(email) {
    if (!supabase) return { error: { message: "Supabase not configured" } };

    const redirectTo = `${window.location.origin}/reset-password`;
    return supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo });
  }

  async function updatePassword(password) {
    if (!supabase) return { error: { message: "Supabase not configured" } };
    return supabase.auth.updateUser({ password });
  }

  async function createAdminUser(email, password) {
    const token = await getAccessToken();
    if (!token) {
      return { error: { message: "You must be signed in to create accounts" } };
    }

    try {
      const response = await fetch("/api/create-admin-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json();
      if (!response.ok) {
        return { error: { message: payload.error || "Failed to create account" } };
      }

      return { data: payload, error: null };
    } catch {
      return { error: { message: "Could not reach the account service. Deploy to Vercel or use vercel dev." } };
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        resetPasswordForEmail,
        updatePassword,
        createAdminUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
