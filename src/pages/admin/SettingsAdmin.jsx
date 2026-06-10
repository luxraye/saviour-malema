import { useState } from "react";
import {
  Save, RefreshCw, Sliders, Info, Palette, Check,
  Users, KeyRound, Mail, UserPlus, Shuffle,
} from "lucide-react";
import { useSiteSettings } from "../../hooks/useSiteSettings";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { generateTempPassword } from "../../utils/generateTempPassword";

export function SettingsAdmin() {
  const { pledgeSettings, saveSettings, resetSettings } = useSiteSettings();
  const { theme, setTheme, themes } = useTheme();
  const { user, createAdminUser, resetPasswordForEmail, updatePassword } = useAuth();
  const [form, setForm] = useState({ ...pledgeSettings });
  const [saved, setSaved] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [myPassword, setMyPassword] = useState("");
  const [myPasswordConfirm, setMyPasswordConfirm] = useState("");
  const [accessMessage, setAccessMessage] = useState("");
  const [accessError, setAccessError] = useState("");
  const [accessLoading, setAccessLoading] = useState("");

  function patch(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSave(e) {
    e.preventDefault();
    saveSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleReset() {
    if (!window.confirm("Reset pledge estimator to defaults?")) return;
    resetSettings();
    setForm({ ...pledgeSettings });
  }

  const previewImpact = {
    u1: Math.round(form.defaultAmount / form.unit1Divisor),
    u2: Math.max(form.unit2Min, Math.round(form.defaultAmount / form.unit2Divisor)),
  };

  function clearAccessFeedback() {
    setAccessMessage("");
    setAccessError("");
  }

  async function handleCreateAccount(e) {
    e.preventDefault();
    clearAccessFeedback();
    setAccessLoading("create");

    const { error } = await createAdminUser(newEmail, newPassword);
    setAccessLoading("");

    if (error) {
      setAccessError(error.message);
      return;
    }

    setAccessMessage(
      `Account created for ${newEmail.trim().toLowerCase()}. Share the temporary password securely, then ask them to sign in and change it.`,
    );
    setNewEmail("");
    setNewPassword("");
  }

  async function handleSendReset(e) {
    e.preventDefault();
    clearAccessFeedback();
    setAccessLoading("reset");

    const { error } = await resetPasswordForEmail(resetEmail);
    setAccessLoading("");

    if (error) {
      setAccessError(error.message);
      return;
    }

    setAccessMessage(`Reset link sent to ${resetEmail.trim().toLowerCase()} (if that account exists).`);
    setResetEmail("");
  }

  async function handleChangeMyPassword(e) {
    e.preventDefault();
    clearAccessFeedback();

    if (myPassword.length < 8) {
      setAccessError("Password must be at least 8 characters.");
      return;
    }

    if (myPassword !== myPasswordConfirm) {
      setAccessError("Passwords do not match.");
      return;
    }

    setAccessLoading("password");
    const { error } = await updatePassword(myPassword);
    setAccessLoading("");

    if (error) {
      setAccessError(error.message);
      return;
    }

    setAccessMessage("Your password has been updated.");
    setMyPassword("");
    setMyPasswordConfirm("");
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/30">Site configuration</p>
        <h1 className="mt-2 text-2xl font-black text-white">Settings</h1>
        <p className="mt-1 text-sm text-white/45">
          Configure the appearance and pledge estimator displayed on the public site.
        </p>
      </div>

      {/* ── Appearance / theme picker ─────────────────────── */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-[#0a0f1a] p-6">
        <div className="mb-2 flex items-center gap-2">
          <Palette className="size-4 text-gold" />
          <h2 className="text-sm font-black text-white">Appearance</h2>
        </div>
        <p className="mb-5 text-sm text-white/45">
          Choose the colour palette for the public website. Changes apply instantly and are saved
          for all visitors.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          {themes.map((t) => {
            const active = t.id === theme;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                aria-pressed={active}
                className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-gold/70 bg-white/8 shadow-glow"
                    : "border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/8"
                }`}
              >
                {active && (
                  <span className="absolute right-3 top-3 grid size-6 place-items-center rounded-full bg-gold text-midnight">
                    <Check className="size-3.5" />
                  </span>
                )}
                <div className="flex gap-1.5">
                  {t.swatches.map((hex) => (
                    <span
                      key={hex}
                      className="size-6 rounded-full ring-1 ring-white/15"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
                <p className="mt-4 text-sm font-black text-white">{t.name}</p>
                <p className="mt-1 text-xs leading-5 text-white/45">{t.tagline}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Team access / passwords ───────────────────────── */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-[#0a0f1a] p-6">
        <div className="mb-2 flex items-center gap-2">
          <Users className="size-4 text-gold" />
          <h2 className="text-sm font-black text-white">Team access</h2>
        </div>
        <p className="mb-5 text-sm text-white/45">
          Create admin accounts with temporary passwords, send reset links, or update your own
          password. Signed in as <strong className="text-white/70">{user?.email}</strong>.
        </p>

        {(accessMessage || accessError) && (
          <div
            className={`mb-5 rounded-xl px-4 py-3 text-sm ${
              accessError
                ? "border border-red-500/30 bg-red-500/10 text-red-300"
                : "border border-grove/30 bg-grove/10 text-grove"
            }`}
          >
            {accessError || accessMessage}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <form onSubmit={handleCreateAccount} className="rounded-xl border border-white/8 p-4">
            <div className="mb-4 flex items-center gap-2">
              <UserPlus className="size-4 text-gold" />
              <h3 className="text-sm font-black text-white">Create admin account</h3>
            </div>
            <div className="grid gap-3">
              <label className="admin-field">
                Email
                <input
                  required
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="colleague@example.com"
                />
              </label>
              <label className="admin-field">
                Temporary password
                <div className="flex gap-2">
                  <input
                    required
                    type="text"
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                  />
                  <button
                    type="button"
                    title="Generate password"
                    onClick={() => setNewPassword(generateTempPassword())}
                    className="admin-secondary shrink-0 px-3"
                  >
                    <Shuffle className="size-4" />
                  </button>
                </div>
              </label>
              <button
                type="submit"
                disabled={accessLoading === "create"}
                className="admin-primary"
              >
                <UserPlus className="size-4" />
                {accessLoading === "create" ? "Creating…" : "Create account"}
              </button>
            </div>
          </form>

          <form onSubmit={handleSendReset} className="rounded-xl border border-white/8 p-4">
            <div className="mb-4 flex items-center gap-2">
              <Mail className="size-4 text-gold" />
              <h3 className="text-sm font-black text-white">Send password reset</h3>
            </div>
            <div className="grid gap-3">
              <label className="admin-field">
                Account email
                <input
                  required
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="user@example.com"
                />
              </label>
              <p className="text-xs leading-5 text-white/40">
                Sends a secure link so they can choose a new password themselves.
              </p>
              <button
                type="submit"
                disabled={accessLoading === "reset"}
                className="admin-secondary"
              >
                <Mail className="size-4" />
                {accessLoading === "reset" ? "Sending…" : "Send reset link"}
              </button>
            </div>
          </form>
        </div>

        <form
          onSubmit={handleChangeMyPassword}
          className="mt-6 rounded-xl border border-white/8 p-4"
        >
          <div className="mb-4 flex items-center gap-2">
            <KeyRound className="size-4 text-gold" />
            <h3 className="text-sm font-black text-white">Change my password</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="admin-field">
              New password
              <input
                required
                type="password"
                minLength={8}
                value={myPassword}
                onChange={(e) => setMyPassword(e.target.value)}
              />
            </label>
            <label className="admin-field">
              Confirm password
              <input
                required
                type="password"
                minLength={8}
                value={myPasswordConfirm}
                onChange={(e) => setMyPasswordConfirm(e.target.value)}
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={accessLoading === "password"}
            className="admin-primary mt-4"
          >
            <KeyRound className="size-4" />
            {accessLoading === "password" ? "Updating…" : "Update my password"}
          </button>
        </form>

        <p className="mt-4 text-xs leading-5 text-white/35">
          Creating accounts requires <code className="text-white/50">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
          on Vercel. Add{" "}
          <code className="text-white/50">/reset-password</code> to Supabase Auth redirect URLs.
        </p>
      </div>

      <form onSubmit={handleSave}>
        <div className="rounded-2xl border border-white/10 bg-[#0a0f1a] p-6">
          <div className="flex items-center gap-2 mb-5">
            <Sliders className="size-4 text-gold" />
            <h2 className="text-sm font-black text-white">Pledge Estimator</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="admin-field">
              Currency symbol
              <input
                value={form.currency}
                onChange={(e) => patch("currency", e.target.value)}
                placeholder="P"
                maxLength={3}
              />
            </label>
            <label className="admin-field">
              Default pledge amount
              <input
                type="number"
                min="50"
                step="50"
                value={form.defaultAmount}
                onChange={(e) => patch("defaultAmount", Number(e.target.value))}
              />
            </label>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <label className="admin-field">
              Minimum amount
              <input
                type="number"
                min="10"
                step="10"
                value={form.min}
                onChange={(e) => patch("min", Number(e.target.value))}
              />
            </label>
            <label className="admin-field">
              Maximum amount
              <input
                type="number"
                min="100"
                step="100"
                value={form.max}
                onChange={(e) => patch("max", Number(e.target.value))}
              />
            </label>
            <label className="admin-field">
              Slider step
              <input
                type="number"
                min="10"
                step="10"
                value={form.step}
                onChange={(e) => patch("step", Number(e.target.value))}
              />
            </label>
          </div>

          <div className="mt-6 border-t border-white/8 pt-5">
            <p className="text-xs font-black uppercase tracking-wide text-white/30 mb-4">
              Impact units
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="admin-field">
                Unit 1 label (plural)
                <input
                  value={form.unit1Label}
                  onChange={(e) => patch("unit1Label", e.target.value)}
                  placeholder="meals"
                />
              </label>
              <label className="admin-field">
                Unit 1 cost divisor
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={form.unit1Divisor}
                    onChange={(e) => patch("unit1Divisor", Number(e.target.value))}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/30">
                    {form.currency}/{form.unit1Label}
                  </span>
                </div>
              </label>

              <label className="admin-field">
                Unit 2 label (plural)
                <input
                  value={form.unit2Label}
                  onChange={(e) => patch("unit2Label", e.target.value)}
                  placeholder="dignity kits"
                />
              </label>
              <label className="admin-field">
                Unit 2 cost divisor
                <input
                  type="number"
                  min="1"
                  value={form.unit2Divisor}
                  onChange={(e) => patch("unit2Divisor", Number(e.target.value))}
                />
              </label>

              <label className="admin-field">
                Unit 2 minimum display
                <input
                  type="number"
                  min="0"
                  value={form.unit2Min}
                  onChange={(e) => patch("unit2Min", Number(e.target.value))}
                />
              </label>
            </div>
          </div>

          {/* Live preview */}
          <div className="mt-6 rounded-xl border border-gold/20 bg-gold/8 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="size-3.5 text-gold" />
              <p className="text-xs font-black text-gold">Preview</p>
            </div>
            <p className="text-sm text-white/70">
              A monthly pledge of{" "}
              <strong className="text-white">
                {form.currency}{Number(form.defaultAmount).toLocaleString()}
              </strong>{" "}
              can provide roughly{" "}
              <strong className="text-white">
                {previewImpact.u1} {form.unit1Label}
              </strong>{" "}
              or{" "}
              <strong className="text-white">
                {previewImpact.u2} {form.unit2Label}
              </strong>
              .
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className={`admin-primary transition ${saved ? "bg-grove text-white" : ""}`}
          >
            <Save className="size-4" />
            {saved ? "Saved!" : "Save settings"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="admin-secondary"
          >
            <RefreshCw className="size-4" />
            Reset to defaults
          </button>
        </div>
      </form>
    </div>
  );
}
