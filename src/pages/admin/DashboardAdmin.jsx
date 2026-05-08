import { Link } from "react-router-dom";
import {
  Inbox, FileText, CalendarHeart, Users, ArrowRight, TrendingUp,
  Clock, CheckCircle, AlertCircle,
} from "lucide-react";
import { useDonations } from "../../hooks/useDonations";
import { useBlogPosts } from "../../hooks/useBlogPosts";
import { useMoments } from "../../hooks/useMoments";
import { formatDate } from "../../utils/formatDate";

const STATUS_META = {
  new:       { label: "New",       cls: "bg-ember/15 text-ember" },
  contacted: { label: "Contacted", cls: "bg-gold/15 text-gold" },
  closed:    { label: "Closed",    cls: "bg-white/10 text-white/40" },
};

function StatCard({ icon: Icon, value, label, accent, to }) {
  const ACCENT = {
    gold:  "border-gold/25  bg-gold/8  text-gold",
    ember: "border-ember/25 bg-ember/8 text-ember",
    grove: "border-grove/25 bg-grove/8 text-grove",
    white: "border-white/15 bg-white/5 text-white/60",
  };
  const Wrapper = to ? Link : "div";
  return (
    <Wrapper
      to={to}
      className={`group rounded-2xl border p-5 transition ${ACCENT[accent]} ${to ? "hover:opacity-90" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <Icon className="size-5" />
        {to && <ArrowRight className="size-4 opacity-0 transition group-hover:opacity-100" />}
      </div>
      <p className="mt-4 text-3xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs font-semibold text-white/50">{label}</p>
    </Wrapper>
  );
}

export function DashboardAdmin() {
  const { donations, newCount } = useDonations();
  const { posts } = useBlogPosts({ publishedOnly: false });
  const { moments } = useMoments();

  const publishedPosts = posts.filter((p) => p.published).length;
  const recentInquiries = donations.slice(0, 6);

  const thisWeek = donations.filter((d) => {
    const submitted = new Date(d.submitted_at);
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return submitted >= cutoff;
  }).length;

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/30">Overview</p>
        <h1 className="mt-2 text-2xl font-black text-white">Dashboard</h1>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Inbox}
          value={newCount}
          label="New inquiries"
          accent="ember"
          to="/admin/inquiries"
        />
        <StatCard
          icon={TrendingUp}
          value={thisWeek}
          label="Received this week"
          accent="gold"
          to="/admin/inquiries"
        />
        <StatCard
          icon={FileText}
          value={publishedPosts}
          label="Published articles"
          accent="grove"
          to="/admin/blog"
        />
        <StatCard
          icon={CalendarHeart}
          value={moments.length}
          label="Moments on wheel"
          accent="white"
          to="/admin/moments"
        />
      </div>

      {/* Recent inquiries */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-base font-black text-white">Recent Inquiries</h2>
          <Link
            to="/admin/inquiries"
            className="flex items-center gap-1.5 text-xs font-bold text-gold transition hover:text-white"
          >
            View all
            <ArrowRight className="size-3" />
          </Link>
        </div>

        {recentInquiries.length === 0 ? (
          <div className="rounded-2xl border border-white/8 bg-white/3 p-10 text-center">
            <Inbox className="mx-auto size-8 text-white/20" />
            <p className="mt-3 text-sm text-white/35">No inquiries yet.</p>
            <p className="mt-1 text-xs text-white/25">
              Inquiries from the Donate button will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0a0f1a]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-wide text-white/30">Name</th>
                  <th className="hidden px-5 py-3.5 text-left text-xs font-black uppercase tracking-wide text-white/30 sm:table-cell">Interest</th>
                  <th className="hidden px-5 py-3.5 text-left text-xs font-black uppercase tracking-wide text-white/30 md:table-cell">Date</th>
                  <th className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-wide text-white/30">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentInquiries.map((inq, i) => {
                  const meta = STATUS_META[inq.status] ?? STATUS_META.new;
                  return (
                    <tr
                      key={inq.id}
                      className={`border-b border-white/5 last:border-0 ${i % 2 === 0 ? "" : "bg-white/2"}`}
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-white">{inq.name}</p>
                        <p className="text-xs text-white/40">{inq.email}</p>
                      </td>
                      <td className="hidden px-5 py-3.5 text-white/60 sm:table-cell">
                        {inq.interest}
                      </td>
                      <td className="hidden px-5 py-3.5 text-xs text-white/40 md:table-cell">
                        {formatDate(inq.submitted_at?.split("T")[0])}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-black ${meta.cls}`}
                        >
                          {meta.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="mt-10">
        <h2 className="mb-4 text-base font-black text-white">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { to: "/admin/moments",   icon: CalendarHeart, label: "Add a moment",    desc: "Update the wheel" },
            { to: "/admin/blog",      icon: FileText,      label: "Write article",   desc: "Publish an update" },
            { to: "/admin/inquiries", icon: Inbox,         label: "Review inquiries",desc: "Follow up contacts" },
            { to: "/admin/partners",  icon: Users,         label: "Manage partners", desc: "Update logos & links" },
          ].map(({ to, icon: Icon, label, desc }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-center gap-4 rounded-xl border border-white/8 bg-white/3 px-4 py-4 transition hover:border-white/15 hover:bg-white/6"
            >
              <div className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/8 text-white/50 group-hover:border-gold/30 group-hover:text-gold transition">
                <Icon className="size-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{label}</p>
                <p className="text-xs text-white/40">{desc}</p>
              </div>
              <ArrowRight className="ml-auto size-4 text-white/20 opacity-0 transition group-hover:opacity-100 group-hover:text-gold" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
