import { useState } from "react";
import { Send } from "lucide-react";
import { supabase } from "../lib/supabase";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    if (!supabase) {
      setTimeout(() => setStatus("success"), 500);
      setEmail("");
      return;
    }

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email });

    if (error?.code === "23505") {
      setStatus("success");
    } else if (error) {
      setStatus("error");
    } else {
      setStatus("success");
    }
    setEmail("");
  }

  if (status === "success") {
    return (
      <p className="rounded-lg border border-gold/30 bg-gold/10 px-4 py-3 text-sm font-bold text-gold">
        You're subscribed! We'll keep you in the loop.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="flex-1 rounded-full border border-white/15 bg-midnight/50 px-5 py-3 text-sm font-semibold text-white outline-none placeholder:text-white/40 focus:border-gold/80"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-black text-midnight disabled:opacity-60"
      >
        <Send className="size-4" aria-hidden="true" />
        {status === "loading" ? "..." : "Subscribe"}
      </button>
      {status === "error" && (
        <p className="mt-2 text-xs text-red-400">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
