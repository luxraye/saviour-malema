import { useState } from "react";
import { Plus, Save, Trash2, Edit3, User } from "lucide-react";
import { useTeam } from "../../hooks/useTeam";
import { ImageUpload } from "../../components/ImageUpload";

const emptyMember = {
  id: "",
  name: "",
  role: "",
  bio: "",
  photo_url: "",
  order: 99,
};

export function TeamAdmin() {
  const { members, saveMember, deleteMember } = useTeam();
  const [draft, setDraft] = useState(emptyMember);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  function patch(field, value) {
    setDraft((d) => ({ ...d, [field]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    await saveMember(draft);
    setDraft(emptyMember);
    setShowForm(false);
    setSaving(false);
  }

  function handleEdit(member) {
    setDraft(member);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Remove this team member?")) return;
    await deleteMember(id);
    if (draft.id === id) { setDraft(emptyMember); setShowForm(false); }
  }

  const initials = (name) =>
    name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/30">Site management</p>
          <h1 className="mt-2 text-2xl font-black text-white">Meet the Team</h1>
          <p className="mt-1 text-sm text-white/45">
            Manage the team profiles shown in the About Us section of the public site.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setDraft(emptyMember); setShowForm(!showForm); }}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-black text-midnight transition hover:-translate-y-0.5"
        >
          <Plus className="size-4" />
          Add member
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSave}
          className="mb-8 rounded-2xl border border-white/10 bg-[#0a0f1a] p-6"
        >
          <h2 className="mb-5 text-base font-black text-white">
            {draft.id ? "Edit team member" : "New team member"}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="admin-field">
              Full name
              <input
                required
                value={draft.name}
                onChange={(e) => patch("name", e.target.value)}
                placeholder="Naledi Mokoena"
              />
            </label>
            <label className="admin-field">
              Role / title
              <input
                required
                value={draft.role}
                onChange={(e) => patch("role", e.target.value)}
                placeholder="Head of Outreach"
              />
            </label>
          </div>

          <div className="mt-4">
            <label className="admin-field">
              Bio
              <textarea
                rows={4}
                value={draft.bio}
                onChange={(e) => patch("bio", e.target.value)}
                placeholder="Short biography…"
                className="resize-none"
              />
            </label>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
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

          <div className="mt-4">
            <p className="mb-2 text-sm font-black text-white/80">Profile photo</p>
            <ImageUpload value={draft.photo_url} onChange={(url) => patch("photo_url", url)} />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button type="submit" disabled={saving} className="admin-primary">
              <Save className="size-4" />
              {saving ? "Saving…" : draft.id ? "Save changes" : "Add member"}
            </button>
            <button
              type="button"
              className="admin-secondary"
              onClick={() => { setDraft(emptyMember); setShowForm(false); }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...members].sort((a, b) => a.order - b.order).map((member) => (
          <div
            key={member.id}
            className="group rounded-2xl border border-white/8 bg-[#0a0f1a] p-5 transition hover:border-white/15"
          >
            <div className="flex items-start gap-4">
              {member.photo_url ? (
                <img
                  src={member.photo_url}
                  alt={member.name}
                  className="size-14 rounded-xl object-cover border border-white/10"
                />
              ) : (
                <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-gold/15 text-sm font-black text-gold">
                  {member.name ? initials(member.name) : <User className="size-5" />}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-black text-white">{member.name}</p>
                <p className="text-xs font-bold text-gold/70 mt-0.5">{member.role}</p>
                <span className="text-[11px] text-white/20 font-mono">order #{member.order}</span>
              </div>
            </div>
            {member.bio && (
              <p className="mt-3 text-sm text-white/45 line-clamp-3">{member.bio}</p>
            )}

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                title="Edit"
                onClick={() => handleEdit(member)}
                className="data-icon-button"
              >
                <Edit3 className="size-3.5" />
              </button>
              <button
                type="button"
                title="Delete"
                onClick={() => handleDelete(member.id)}
                className="data-icon-button hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
