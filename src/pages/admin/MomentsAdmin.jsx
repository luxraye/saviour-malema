import { useState } from "react";
import { Edit3, Plus, Save, Trash2, CalendarHeart } from "lucide-react";
import { useMoments } from "../../hooks/useMoments";
import { ImageUpload } from "../../components/ImageUpload";
import { CATEGORIES, emptyMoment } from "../../lib/constants";
import { formatDate } from "../../utils/formatDate";

export function MomentsAdmin() {
  const { moments, saveMoment, deleteMoment } = useMoments();
  const [draft, setDraft] = useState(emptyMoment);
  const [saving, setSaving] = useState(false);

  function patch(field, value) {
    setDraft((d) => ({ ...d, [field]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const id =
      draft.id ||
      `${draft.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
    await saveMoment({
      ...draft,
      id,
      image_url:
        draft.image_url ||
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80",
    });
    setDraft(emptyMoment);
    setSaving(false);
  }

  function handleEdit(moment) {
    setDraft(moment);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Remove this moment from the wheel?")) return;
    await deleteMoment(id);
    if (draft.id === id) setDraft(emptyMoment);
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/30">Wheel data</p>
        <h1 className="mt-2 text-2xl font-black text-white">Moments</h1>
        <p className="mt-1 text-sm text-white/45">
          Manage the 3D moments wheel entries shown on the public site.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_1.1fr]">
        {/* Form */}
        <section>
          <h2 className="mb-4 text-base font-black text-white">
            {draft.id ? "Edit moment" : "Add new moment"}
          </h2>
          <form className="grid gap-4" onSubmit={handleSave}>
            <label className="admin-field">
              Moment title
              <input
                required
                value={draft.title}
                onChange={(e) => patch("title", e.target.value)}
                placeholder="Youth food drive"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="admin-field">
                Date
                <input
                  required
                  type="date"
                  value={draft.date}
                  onChange={(e) => patch("date", e.target.value)}
                />
              </label>
              <label className="admin-field">
                Category
                <select
                  value={draft.category}
                  onChange={(e) => patch("category", e.target.value)}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="admin-field">
              <span className="text-sm font-black text-white/80">Image</span>
              <ImageUpload
                value={draft.image_url}
                onChange={(url) => patch("image_url", url)}
              />
            </div>

            <label className="admin-field">
              Impact note
              <textarea
                required
                value={draft.impact}
                onChange={(e) => patch("impact", e.target.value)}
                placeholder="Describe who was helped and why this moment matters."
                className="min-h-[5rem]"
              />
            </label>

            <label className="flex items-center gap-3 text-sm font-bold text-white/70">
              <input
                className="size-4 accent-gold"
                type="checkbox"
                checked={draft.featured}
                onChange={(e) => patch("featured", e.target.checked)}
              />
              Feature this moment in highlights
            </label>

            <div className="flex flex-wrap gap-3">
              <button className="admin-primary" type="submit" disabled={saving}>
                <Save className="size-4" />
                {saving ? "Saving…" : draft.id ? "Save changes" : "Add to wheel"}
              </button>
              <button
                className="admin-secondary"
                type="button"
                onClick={() => setDraft(emptyMoment)}
              >
                <Plus className="size-4" />
                New blank
              </button>
            </div>
          </form>
        </section>

        {/* Moments list */}
        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-base font-black text-white">Wheel entries</h2>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black text-white/50">
              {moments.length}
            </span>
          </div>

          <div className="max-h-[calc(100vh-12rem)] space-y-3 overflow-y-auto pr-1">
            {moments.map((moment) => (
              <article
                key={moment.id}
                className="grid gap-3 rounded-xl border border-white/8 bg-[#0a0f1a] p-4 sm:grid-cols-[6rem_1fr] transition hover:border-white/15"
              >
                <img
                  className="h-24 w-full rounded-lg object-cover"
                  src={moment.image_url || moment.image}
                  alt=""
                />
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-black uppercase text-gold">{moment.category}</p>
                      <h4 className="mt-0.5 font-black text-white text-sm">{moment.title}</h4>
                      <p className="mt-0.5 text-xs text-white/40">{formatDate(moment.date)}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        className="data-icon-button"
                        type="button"
                        title="Edit"
                        onClick={() => handleEdit(moment)}
                      >
                        <Edit3 className="size-3.5" />
                      </button>
                      <button
                        className="data-icon-button hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                        type="button"
                        title="Delete"
                        onClick={() => handleDelete(moment.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-white/50 line-clamp-2">
                    {moment.impact}
                  </p>
                  {moment.featured && (
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-gold/10 px-2.5 py-0.5 text-[11px] font-black text-gold">
                      <CalendarHeart className="size-3" />
                      Featured
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
