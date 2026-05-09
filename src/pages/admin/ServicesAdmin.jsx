import { useState } from "react";
import { Plus, Save, Trash2, Edit3, GripVertical } from "lucide-react";
import { useServices } from "../../hooks/useServices";
import { SERVICE_ICON_MAP, SERVICE_ACCENTS } from "../../lib/constants";

const emptyService = {
  id: "",
  icon_name: "HeartHandshake",
  title: "",
  description: "",
  stat: "",
  accent: "ember",
  order: 99,
};

const accentPreview = {
  ember: "bg-ember/15 text-ember border-ember/20",
  gold:  "bg-gold/15 text-gold border-gold/20",
  grove: "bg-grove/15 text-grove border-grove/20",
};

export function ServicesAdmin() {
  const { services, saveService, deleteService } = useServices();
  const [draft, setDraft] = useState(emptyService);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  function patch(field, value) {
    setDraft((d) => ({ ...d, [field]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    await saveService(draft);
    setDraft(emptyService);
    setShowForm(false);
    setSaving(false);
  }

  function handleEdit(service) {
    setDraft(service);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Remove this programme card?")) return;
    await deleteService(id);
    if (draft.id === id) { setDraft(emptyService); setShowForm(false); }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/30">Site management</p>
          <h1 className="mt-2 text-2xl font-black text-white">Programmes</h1>
          <p className="mt-1 text-sm text-white/45">
            Manage the programme cards shown in the Programs section of the public site.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setDraft(emptyService); setShowForm(!showForm); }}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-black text-midnight transition hover:-translate-y-0.5"
        >
          <Plus className="size-4" />
          Add programme
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSave}
          className="mb-8 rounded-2xl border border-white/10 bg-[#0a0f1a] p-6"
        >
          <h2 className="mb-5 text-base font-black text-white">
            {draft.id ? "Edit programme" : "New programme"}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="admin-field">
              Title
              <input
                required
                value={draft.title}
                onChange={(e) => patch("title", e.target.value)}
                placeholder="Food Relief"
              />
            </label>
            <label className="admin-field">
              Impact stat
              <input
                value={draft.stat}
                onChange={(e) => patch("stat", e.target.value)}
                placeholder="500+ families monthly"
              />
            </label>
          </div>

          <div className="mt-4">
            <label className="admin-field">
              Description
              <textarea
                required
                rows={3}
                value={draft.description}
                onChange={(e) => patch("description", e.target.value)}
                placeholder="Short description of this programme…"
                className="resize-none"
              />
            </label>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {/* Icon picker */}
            <div>
              <p className="mb-2 text-sm font-black text-white/80">Icon</p>
              <div className="grid grid-cols-4 gap-1.5 rounded-xl border border-white/10 bg-[#080d14] p-2 max-h-40 overflow-y-auto">
                {Object.keys(SERVICE_ICON_MAP).map((name) => {
                  const Icon = SERVICE_ICON_MAP[name];
                  const active = draft.icon_name === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      title={name}
                      onClick={() => patch("icon_name", name)}
                      className={`flex flex-col items-center justify-center gap-1 rounded-lg p-2 transition ${
                        active
                          ? "bg-gold/20 text-gold ring-1 ring-gold/40"
                          : "text-white/30 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className="size-4 shrink-0" />
                    </button>
                  );
                })}
              </div>
              <p className="mt-1 text-[11px] text-white/30">Selected: {draft.icon_name}</p>
            </div>

            {/* Accent colour */}
            <div>
              <p className="mb-2 text-sm font-black text-white/80">Accent colour</p>
              <div className="flex flex-col gap-2">
                {SERVICE_ACCENTS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => patch("accent", value)}
                    className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-sm font-bold transition ${
                      draft.accent === value
                        ? accentPreview[value]
                        : "border-white/10 bg-white/5 text-white/40 hover:text-white"
                    }`}
                  >
                    <span className={`size-3 rounded-full ${
                      value === "ember" ? "bg-ember" :
                      value === "gold"  ? "bg-gold"  : "bg-grove"
                    }`} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Display order */}
            <div>
              <label className="admin-field">
                Display order
                <input
                  type="number"
                  min="1"
                  value={draft.order}
                  onChange={(e) => patch("order", Number(e.target.value))}
                />
              </label>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button type="submit" disabled={saving} className="admin-primary">
              <Save className="size-4" />
              {saving ? "Saving…" : draft.id ? "Save changes" : "Add programme"}
            </button>
            <button
              type="button"
              className="admin-secondary"
              onClick={() => { setDraft(emptyService); setShowForm(false); }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...services].sort((a, b) => a.order - b.order).map((svc) => {
          const Icon = SERVICE_ICON_MAP[svc.icon_name] || SERVICE_ICON_MAP.Package;
          const accent = accentPreview[svc.accent] || accentPreview.ember;
          return (
            <div
              key={svc.id}
              className="group rounded-2xl border border-white/8 bg-[#0a0f1a] p-5 transition hover:border-white/15"
            >
              <div className="flex items-start gap-3">
                <div className={`grid size-10 shrink-0 place-items-center rounded-xl border ${accent}`}>
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-black text-white">{svc.title}</p>
                  {svc.stat && (
                    <p className="text-xs font-bold text-white/40 mt-0.5">{svc.stat}</p>
                  )}
                </div>
                <span className="text-[11px] text-white/20 font-mono">#{svc.order}</span>
              </div>
              <p className="mt-3 text-sm text-white/50 line-clamp-2">{svc.description}</p>

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  title="Edit"
                  onClick={() => handleEdit(svc)}
                  className="data-icon-button"
                >
                  <Edit3 className="size-3.5" />
                </button>
                <button
                  type="button"
                  title="Delete"
                  onClick={() => handleDelete(svc.id)}
                  className="data-icon-button hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
