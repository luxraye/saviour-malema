import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { defaultBlogPosts, BLOG_KEY } from "../lib/constants";

export function useBlogPosts({ publishedOnly = true } = {}) {
  const [posts, setPosts] = useState(publishedOnly ? defaultBlogPosts : defaultBlogPosts);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    if (!supabase) {
      try {
        const saved = JSON.parse(window.localStorage.getItem(BLOG_KEY) || "null");
        if (Array.isArray(saved) && saved.length > 0) {
          setPosts(publishedOnly ? saved.filter((p) => p.published) : saved);
        } else {
          setPosts(publishedOnly ? defaultBlogPosts.filter((p) => p.published) : defaultBlogPosts);
        }
      } catch {
        setPosts(publishedOnly ? defaultBlogPosts.filter((p) => p.published) : defaultBlogPosts);
      }
      setLoading(false);
      return;
    }

    let query = supabase
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false, nullsFirst: false });

    if (publishedOnly) {
      query = query.eq("published", true);
    }

    const { data, error } = await query;
    if (!error && data) setPosts(data);
    setLoading(false);
  }, [publishedOnly]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  async function savePost(post) {
    if (!supabase) {
      const current = JSON.parse(window.localStorage.getItem(BLOG_KEY) || "null") || defaultBlogPosts;
      const idx = current.findIndex((p) => p.id === post.id);
      const entry = {
        ...post,
        id: post.id || `post-${Date.now()}`,
        published_at: post.published && !post.published_at ? new Date().toISOString() : post.published_at,
      };
      const updated =
        idx >= 0 ? current.map((p) => (p.id === post.id ? entry : p)) : [entry, ...current];
      window.localStorage.setItem(BLOG_KEY, JSON.stringify(updated));
      setPosts(publishedOnly ? updated.filter((p) => p.published) : updated);
      return { error: null };
    }

    const { id, ...rest } = post;
    if (rest.published && !rest.published_at) {
      rest.published_at = new Date().toISOString();
    }

    if (id) {
      const { error } = await supabase.from("blog_posts").update(rest).eq("id", id);
      if (!error) await fetchPosts();
      return { error };
    } else {
      const { error } = await supabase.from("blog_posts").insert(rest);
      if (!error) await fetchPosts();
      return { error };
    }
  }

  async function deletePost(id) {
    if (!supabase) {
      const current = JSON.parse(window.localStorage.getItem(BLOG_KEY) || "null") || defaultBlogPosts;
      const updated = current.filter((p) => p.id !== id);
      window.localStorage.setItem(BLOG_KEY, JSON.stringify(updated));
      setPosts(publishedOnly ? updated.filter((p) => p.published) : updated);
      return { error: null };
    }
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (!error) await fetchPosts();
    return { error };
  }

  return { posts, loading, savePost, deletePost, refetch: fetchPosts };
}
