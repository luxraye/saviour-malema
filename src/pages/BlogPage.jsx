import { BookOpen } from "lucide-react";
import { BlogCard } from "../components/BlogCard";
import { NewsletterForm } from "../components/NewsletterForm";
import { useBlogPosts } from "../hooks/useBlogPosts";

export function BlogPage() {
  const { posts, loading } = useBlogPosts({ publishedOnly: true });

  return (
    <div className="min-h-screen bg-midnight px-5 pb-20 pt-28 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="section-kicker">Foundation updates</p>
        <h1 className="section-title">Stories from the ground.</h1>
        <p className="mt-4 max-w-2xl leading-7 text-white/70">
          Follow our journey through outreach stories, community milestones, and donor impact reports.
        </p>

        {loading ? (
          <div className="mt-12 flex justify-center">
            <div className="size-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          </div>
        ) : posts.length === 0 ? (
          <div className="mt-12 glass-panel p-12 text-center">
            <BookOpen className="mx-auto size-12 text-white/30" />
            <p className="mt-4 text-lg font-bold text-white/50">No updates published yet.</p>
            <p className="mt-2 text-sm text-white/40">Check back soon for stories from the foundation.</p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

        <div className="mt-16 glass-panel p-8">
          <h2 className="text-xl font-black text-white">Stay updated</h2>
          <p className="mt-2 text-sm text-white/60">Get new stories and impact reports in your inbox.</p>
          <div className="mt-4 max-w-lg">
            <NewsletterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
