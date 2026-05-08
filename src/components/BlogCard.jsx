import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";

export function BlogCard({ post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="glass-panel overflow-hidden transition hover:-translate-y-1 hover:border-gold/40">
      {post.cover_image_url && (
        <img className="h-48 w-full object-cover" src={post.cover_image_url} alt="" />
      )}
      <div className="p-5">
        <p className="text-xs font-black uppercase tracking-wide text-gold">
          {formatDate(post.published_at?.split("T")[0])}
        </p>
        <h3 className="mt-3 text-xl font-black text-white">{post.title}</h3>
        {post.excerpt && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/70">{post.excerpt}</p>
        )}
      </div>
    </Link>
  );
}
