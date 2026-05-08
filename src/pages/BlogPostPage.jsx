import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "../lib/supabase";
import { formatDate } from "../utils/formatDate";

export function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();
      setPost(data);
      setLoading(false);
    }
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-midnight">
        <div className="size-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-midnight px-5 text-center">
        <h1 className="text-3xl font-black text-white">Post not found</h1>
        <p className="mt-3 text-white/60">This post may have been removed or is not yet published.</p>
        <Link to="/blog" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-gold">
          <ArrowLeft className="size-4" /> Back to updates
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midnight px-5 pb-20 pt-28 sm:px-8">
      <article className="mx-auto max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-gold transition hover:text-white">
          <ArrowLeft className="size-4" /> All updates
        </Link>

        {post.cover_image_url && (
          <img className="mt-6 h-72 w-full rounded-lg object-cover" src={post.cover_image_url} alt="" />
        )}

        <p className="mt-6 text-xs font-black uppercase tracking-wide text-gold">
          {formatDate(post.published_at?.split("T")[0])}
        </p>
        <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">{post.title}</h1>

        <div className="blog-prose mt-8">
          <Markdown remarkPlugins={[remarkGfm]}>{post.body}</Markdown>
        </div>
      </article>
    </div>
  );
}
