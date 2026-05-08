import { useEffect, useRef, useState } from "react";
import { X, Heart, Send, CheckCircle2 } from "lucide-react";
import { useDonationModal } from "../context/DonationContext";
import { useDonations } from "../hooks/useDonations";
import { INQUIRY_INTERESTS } from "../lib/constants";

export function DonationModal() {
  const { open, prefillAmount, closeDonation } = useDonationModal();
  const { submitInquiry } = useDonations();
  const [status, setStatus] = useState("idle");
  const overlayRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "Donate Funds",
    pledge_amount: prefillAmount,
    message: "",
  });

  useEffect(() => {
    if (open) {
      setForm((f) => ({ ...f, pledge_amount: prefillAmount }));
      setStatus("idle");
    }
  }, [open, prefillAmount]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") closeDonation();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeDonation]);

  if (!open) return null;

  function patch(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    const { error } = await submitInquiry(form);
    setStatus(error ? "error" : "success");
  }

  const showPledge =
    form.interest === "Donate Funds" || form.interest === "Sponsor a Drive";

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => e.target === overlayRef.current && closeDonation()}
    >
      <div className="absolute inset-0 bg-midnight/80 backdrop-blur-md" />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-md flex-col rounded-2xl border border-white/15 bg-[#0d1117] shadow-2xl shadow-black/60">
        {/* Fixed header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-white/8 px-6 py-5">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold/15">
            <Heart className="size-5 text-gold" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-black text-white">Get Involved</h2>
            <p className="text-xs text-white/50">Tell us how you'd like to support the foundation.</p>
          </div>
          <button
            type="button"
            onClick={closeDonation}
            className="ml-auto grid size-8 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-white/50 transition hover:bg-white/15 hover:text-white"
            aria-label="Close"
          >
            <X className="size-3.5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {status === "success" ? (
            <div className="flex flex-col items-center py-10 text-center">
              <CheckCircle2 className="size-12 text-grove" />
              <h3 className="mt-4 text-xl font-black text-white">Thank you!</h3>
              <p className="mt-2 max-w-xs text-sm leading-6 text-white/65">
                We've received your enquiry and will be in touch at{" "}
                <strong className="text-white">{form.email}</strong> within 2–3 business days.
              </p>
              <button
                type="button"
                onClick={closeDonation}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-black text-white"
              >
                Back to site
              </button>
            </div>
          ) : (
            <form id="donation-form" onSubmit={handleSubmit} className="grid gap-4">
              {/* Row 1 */}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="admin-field">
                  Full name
                  <input
                    required
                    value={form.name}
                    onChange={(e) => patch("name", e.target.value)}
                    placeholder="Your full name"
                  />
                </label>
                <label className="admin-field">
                  Email
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => patch("email", e.target.value)}
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              {/* Row 2 */}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="admin-field">
                  Phone <span className="font-normal text-white/35">(optional)</span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => patch("phone", e.target.value)}
                    placeholder="+267 ..."
                  />
                </label>
                <label className="admin-field">
                  I'd like to
                  <select
                    value={form.interest}
                    onChange={(e) => patch("interest", e.target.value)}
                  >
                    {INQUIRY_INTERESTS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Pledge amount — flat row with currency prefix, no overlay */}
              {showPledge && (
                <div className="grid gap-2 text-sm font-black text-white/80">
                  Monthly pledge (BWP)
                  <div className="flex overflow-hidden rounded-xl border border-white/12 bg-white/5 focus-within:border-gold/60">
                    <span className="flex shrink-0 items-center border-r border-white/10 bg-white/5 px-4 font-black text-gold">
                      P
                    </span>
                    <input
                      type="number"
                      min="50"
                      step="50"
                      value={form.pledge_amount}
                      onChange={(e) => patch("pledge_amount", Number(e.target.value))}
                      className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-sm font-semibold text-white outline-none placeholder:text-white/30"
                    />
                  </div>
                </div>
              )}

              {/* Message */}
              <label className="admin-field">
                Message <span className="font-normal text-white/35">(optional)</span>
                <textarea
                  value={form.message}
                  onChange={(e) => patch("message", e.target.value)}
                  placeholder="Tell us more about how you'd like to help…"
                  className="min-h-[4rem]"
                />
              </label>

              {status === "error" && (
                <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-bold text-red-400">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          )}
        </div>

        {/* Fixed footer — only shown while form is active */}
        {status !== "success" && (
          <div className="shrink-0 border-t border-white/8 px-6 py-4">
            <button
              type="submit"
              form="donation-form"
              disabled={status === "loading"}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-gold/20 transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {status === "loading" ? (
                <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Send className="size-4" aria-hidden="true" />
              )}
              {status === "loading" ? "Sending…" : "Send enquiry"}
            </button>
            <p className="mt-2 text-center text-xs text-white/30">
              Your details are never shared with third parties.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
