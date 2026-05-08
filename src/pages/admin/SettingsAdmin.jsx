import { useState } from "react";
import { Save, RefreshCw, Sliders, Info } from "lucide-react";
import { useSiteSettings } from "../../hooks/useSiteSettings";

export function SettingsAdmin() {
  const { pledgeSettings, saveSettings, resetSettings } = useSiteSettings();
  const [form, setForm] = useState({ ...pledgeSettings });
  const [saved, setSaved] = useState(false);

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

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/30">Site configuration</p>
        <h1 className="mt-2 text-2xl font-black text-white">Settings</h1>
        <p className="mt-1 text-sm text-white/45">
          Configure the pledge estimator displayed on the public site.
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
