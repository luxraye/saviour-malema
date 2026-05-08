import { useState } from "react";
import { Plus, Save, Trash2, Edit3, Star, Globe } from "lucide-react";
import { usePartners } from "../../hooks/usePartners";
import { ImageUpload } from "../../components/ImageUpload";

const emptyPartner = {
  id: "",
  name: "",
  logo_url: "",
  website: "",
  description: "",
  featured: true,
  order: 99,
};

export function PartnersAdmin() {
  const { partners, savePartner, deletePartner } = usePartners();
  const [draft, setDraft] = useState(emptyPartner);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  function patch(field, value) {
    setDraft((d) => ({ ...d, [field]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    await savePartner(draft);
    setDraft(emptyPartner);
    setShowForm(false);
    setSaving(false);
  }

  function handleEdit(partner) {
    setDraft(partner);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Remove this partner?")) return;
    await deletePartner(id);
    if (draft.id === id) { setDraft(emptyPartner); setShowForm(false); }
  }

  async function toggleFeatured(partner) {
    await savePartner({ ...partner, featured: !partner.featured });
  }

  const initials = (name) =>
    name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/30">Site management</p>
          <h1 className="mt-2 text-2xl font-black text-white">Partners</h1>
          <p className="mt-1 text-sm text-white/45">
            Manage partner logos, links, and visibility on the public site.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setDraft(emptyPartner); setShowForm(!showForm); }}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-black text-midnight transition hover:-translate-y-0.5"
        >
          <Plus className="size-4" />
          Add partner
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSave}
          className="mb-8 rounded-2xl border border-white/10 bg-[#0a0f1a] p-6"
        >
          <h2 className="mb-5 text-base font-black text-white">
            {draft.id ? "Edit partner" : "New partner"}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="admin-field">
              Organisation name
              <input
                required
                value={draft.name}
                onChange={(e) => patch("name", e.target.value)}
                placeholder="FoodForward SA"
              />
            </label>
            <label className="admin-field">
              Website URL
              <input
                type="url"
                value={draft.website}
                onChange={(e) => patch("website", e.target.value)}
                placeholder="https://..."
              />
            </label>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="admin-field">
              Short description
              <input
                value={draft.description}
                onChange={(e) => patch("description", e.target.value)}
                placeholder="Food redistribution partner"
              />
            </label>
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

          <div className="mt-4 admin-field">
            <span className="text-sm font-black text-white/80">Logo image</span>
            <ImageUpload value={draft.logo_url} onChange={(url) => patch("logo_url", url)} />
          </div>

          <label className="mt-4 flex items-center gap-3 text-sm font-bold text-white/70">
            <input
              type="checkbox"
              className="size-4 accent-gold"
              checked={draft.featured}
              onChange={(e) => patch("featured", e.target.checked)}
            />
            Show on public site (featured)
          </label>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="admin-primary"
            >
              <Save className="size-4" />
              {saving ? "Saving…" : draft.id ? "Save changes" : "Add partner"}
            </button>
            <button
              type="button"
              className="admin-secondary"
              onClick={() => { setDraft(emptyPartner); setShowForm(false); }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {partners.map((partner) => {
          const inits = initials(partner.name);
          return (
            <div
              key={partner.id}
              className="group rounded-2xl border border-white/8 bg-[#0a0f1a] p-5 transition hover:border-white/15"
            >
              <div className="flex items-start gap-4">
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="size-12 rounded-xl object-contain border border-white/10 bg-white/5 p-1"
                  />
                ) : (
                  <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-gold/15 text-sm font-black text-gold">
                    {inits}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-black text-white truncate">{partner.name}</p>
                  {partner.description && (
                    <p className="text-xs text-white/45 mt-0.5">{partner.description}</p>
                  )}
                  {partner.website && (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 flex items-center gap-1 text-xs text-gold/70 hover:text-gold"
                    >
                      <Globe className="size-3" />
                      Website
                    </a>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2">
                <button
                  type="button"
                  title={partner.featured ? "Remove from public site" : "Show on public site"}
                  onClick={() => toggleFeatured(partner)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black transition ${
                    partner.featured
                      ? "bg-gold/15 text-gold"
                      : "bg-white/5 text-white/30 hover:text-white"
                  }`}
                >
                  <Star className={`size-3 ${partner.featured ? "fill-gold" : ""}`} />
                  {partner.featured ? "Featured" : "Hidden"}
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    title="Edit"
                    onClick={() => handleEdit(partner)}
                    className="data-icon-button"
                  >
                    <Edit3 className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Delete"
                    onClick={() => handleDelete(partner.id)}
                    className="data-icon-button hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
