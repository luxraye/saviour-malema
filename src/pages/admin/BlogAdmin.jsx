import { useState } from "react";
import { Eye, EyeOff, Plus, Save, Trash2, Edit3, FileText } from "lucide-react";
import { useBlogPosts } from "../../hooks/useBlogPosts";
import { ImageUpload } from "../../components/ImageUpload";
import { RichTextEditor } from "../../components/RichTextEditor";
import { formatDate } from "../../utils/formatDate";

const emptyPost = {
  id: "",
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  cover_image_url: "",
  published: false,
};

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function BlogAdmin() {
  const { posts, savePost, deletePost } = useBlogPosts({ publishedOnly: false });
  const [draft, setDraft] = useState(emptyPost);
  const [saving, setSaving] = useState(false);

  function patch(field, value) {
    setDraft((d) => ({ ...d, [field]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const slug = draft.slug || generateSlug(draft.title);
    await savePost({ ...draft, slug });
    setDraft(emptyPost);
    setSaving(false);
  }

  function handleEdit(post) {
    setDraft(post);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this article permanently?")) return;
    await deletePost(id);
    if (draft.id === id) setDraft(emptyPost);
  }

  async function togglePublished(post) {
    await savePost({ ...post, published: !post.published });
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/30">Content</p>
        <h1 className="mt-2 text-2xl font-black text-white">Articles</h1>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        {/* Editor */}
        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-base font-black text-white">
              {draft.id ? "Edit article" : "New article"}
            </h2>
            {draft.id && (
              <button
                type="button"
                className="admin-secondary text-xs py-2"
                onClick={() => setDraft(emptyPost)}
              >
                <Plus className="size-3.5" />
                New blank
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="grid gap-4">
            <label className="admin-field">
              Title
              <input
                required
                value={draft.title}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    title: e.target.value,
                    slug: d.id ? d.slug : generateSlug(e.target.value),
                  }))
                }
                placeholder="Winter Warmth Drive: 300 Families Reached"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="admin-field">
                URL slug
                <input
                  value={draft.slug}
                  onChange={(e) => patch("slug", e.target.value)}
                  placeholder="auto-generated"
                  className="font-mono text-xs"
                />
              </label>
              <label className="admin-field">
                Excerpt
                <input
                  value={draft.excerpt}
                  onChange={(e) => patch("excerpt", e.target.value)}
                  placeholder="Short summary shown in listings"
                />
              </label>
            </div>

            <div className="admin-field">
              <span className="text-sm font-black text-white/80">Cover image</span>
              <ImageUpload
                value={draft.cover_image_url}
                onChange={(url) => patch("cover_image_url", url)}
              />
            </div>

            <div className="admin-field">
              <span className="text-sm font-black text-white/80">Article body</span>
              <RichTextEditor
                value={draft.body}
                onChange={(val) => patch("body", val)}
                placeholder="Write your article in Markdown… Use the toolbar above to format."
              />
            </div>

            <label className="flex items-center gap-3 text-sm font-bold text-white/70">
              <input
                className="size-4 accent-gold"
                type="checkbox"
                checked={draft.published}
                onChange={(e) => patch("published", e.target.checked)}
              />
              Publish immediately
            </label>

            <div className="flex flex-wrap gap-3">
              <button className="admin-primary" type="submit" disabled={saving}>
                <Save className="size-4" />
                {saving ? "Saving…" : draft.id ? "Save changes" : "Create article"}
              </button>
              {!draft.id && (
                <button
                  className="admin-secondary"
                  type="button"
                  onClick={() => setDraft(emptyPost)}
                >
                  <Plus className="size-4" />
                  Clear form
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Article list */}
        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-base font-black text-white">All articles</h2>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black text-white/50">
              {posts.length}
            </span>
          </div>

          <div className="max-h-[calc(100vh-12rem)] overflow-y-auto space-y-3 pr-1">
            {posts.length === 0 && (
              <div className="rounded-2xl border border-white/8 p-10 text-center">
                <FileText className="mx-auto size-8 text-white/20" />
                <p className="mt-3 text-sm text-white/35">No articles yet.</p>
              </div>
            )}
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-xl border border-white/8 bg-[#0a0f1a] p-4 transition hover:border-white/15"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {post.published ? (
                        <span className="rounded-full bg-grove/15 px-2.5 py-0.5 text-[11px] font-black text-grove">
                          Published
                        </span>
                      ) : (
                        <span className="rounded-full bg-white/8 px-2.5 py-0.5 text-[11px] font-black text-white/40">
                          Draft
                        </span>
                      )}
                      {post.published_at && (
                        <span className="text-[11px] text-white/35">
                          {formatDate(post.published_at.split("T")[0])}
                        </span>
                      )}
                    </div>
                    <h4 className="font-black text-white text-sm leading-5">{post.title}</h4>
                    {post.excerpt && (
                      <p className="mt-1 text-xs text-white/40 line-clamp-2">{post.excerpt}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <button
                      className="data-icon-button"
                      type="button"
                      title={post.published ? "Unpublish" : "Publish"}
                      onClick={() => togglePublished(post)}
                    >
                      {post.published ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    </button>
                    <button
                      className="data-icon-button"
                      type="button"
                      title="Edit"
                      onClick={() => handleEdit(post)}
                    >
                      <Edit3 className="size-3.5" />
                    </button>
                    <button
                      className="data-icon-button hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                      type="button"
                      title="Delete"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
