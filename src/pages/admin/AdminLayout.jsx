import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarHeart,
  FileText,
  Inbox,
  Handshake,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  Bell,
  LayoutGrid,
  Users,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useDonations } from "../../hooks/useDonations";

const sidebarLinks = [
  { to: "/admin",              label: "Dashboard",  icon: LayoutDashboard, end: true },
  { to: "/admin/moments",      label: "Moments",    icon: CalendarHeart,   end: false },
  { to: "/admin/blog",         label: "Articles",   icon: FileText,        end: false },
  { to: "/admin/inquiries",    label: "Inquiries",  icon: Inbox,           end: false },
  { to: "/admin/programmes",   label: "Programmes", icon: LayoutGrid,      end: false },
  { to: "/admin/team",         label: "Team",       icon: Users,           end: false },
  { to: "/admin/partners",     label: "Partners",   icon: Handshake,       end: false },
  { to: "/admin/settings",     label: "Settings",   icon: Settings,        end: false },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { newCount } = useDonations();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/8">
        <div className="grid size-9 place-items-center rounded-full border border-gold/40 bg-gold/15">
          <Sparkles className="size-4 text-gold" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-wider text-gold">TSMF</p>
          <p className="truncate text-[11px] text-white/40">{user?.email}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="mb-2 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/25">
          Control Centre
        </p>
        {sidebarLinks.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? "bg-gold/15 text-gold"
                  : "text-white/55 hover:bg-white/8 hover:text-white"
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-gold" />
                )}
                <Icon className={`size-4 ${isActive ? "text-gold" : "text-white/40 group-hover:text-white"}`} />
                {label}
                {label === "Inquiries" && newCount > 0 && (
                  <span className="ml-auto rounded-full bg-ember px-2 py-0.5 text-[10px] font-black text-white">
                    {newCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/8 px-3 py-4">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/40 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[240px] bg-[#0a0f1a] border-r border-white/5 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main area */}
      <div className="lg:pl-[240px]">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/6 bg-[#0d1117]/90 px-5 backdrop-blur-xl sm:px-7">
          <button
            type="button"
            className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/60 lg:hidden"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            {sidebarOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>

          <p className="text-sm font-black text-white/30 lg:ml-0">
            Situation Room
          </p>

          <div className="flex items-center gap-3">
            {newCount > 0 && (
              <NavLink
                to="/admin/inquiries"
                className="relative grid size-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition hover:text-white"
              >
                <Bell className="size-4" />
                <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-ember text-[9px] font-black text-white">
                  {newCount}
                </span>
              </NavLink>
            )}
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-white/8 bg-white/5 px-3 py-1.5">
              <div className="size-2 rounded-full bg-grove animate-slow-pulse" />
              <span className="text-xs font-semibold text-white/50">Live</span>
            </div>
          </div>
        </header>

        <main className="px-5 py-8 sm:px-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
