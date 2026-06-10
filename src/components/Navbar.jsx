import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Heart, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useDonationModal } from "../context/DonationContext";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { openDonation } = useDonationModal();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  const navLinks = [
    { href: "/#home",     label: "Home" },
    { href: "/#about",    label: "About" },
    { href: "/#programs", label: "Programs" },
    { href: "/#schools",  label: "School Needs" },
    { href: "/#moments",  label: "Moments" },
    { href: "/blog",      label: "Updates", isRoute: true },
  ];

  return (
    <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
      <Link
        to="/"
        className="flex items-center gap-3"
        aria-label="The Saviour Malema Foundation home"
        onClick={() => setMenuOpen(false)}
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold shadow-lg shadow-gold/40">
          <span className="text-sm font-black tracking-tighter text-white">SMF</span>
        </span>
        <span className="max-w-44 text-sm font-black uppercase leading-tight tracking-wide sm:max-w-none">
          The Saviour Malema Foundation
        </span>
      </Link>

      <nav className="hidden items-center gap-6 text-sm font-semibold text-white/75 md:flex">
        {navLinks.map(({ href, label, isRoute }) =>
          isRoute ? (
            <Link key={label} to={href} className="transition hover:text-white">
              {label}
            </Link>
          ) : (
            <a key={label} href={href} className="transition hover:text-white">
              {label}
            </a>
          ),
        )}
        {user && (
          <Link
            to="/admin"
            className="flex items-center gap-1.5 transition hover:text-white"
          >
            <LayoutDashboard className="size-3.5" />
            Admin
          </Link>
        )}
      </nav>

      <div className="hidden items-center gap-3 md:flex">
        <button
          type="button"
          onClick={() => openDonation()}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-black text-midnight shadow-lg shadow-gold/20 transition hover:-translate-y-0.5 hover:shadow-gold/30"
        >
          <Heart className="size-3.5" aria-hidden="true" />
          Donate
        </button>
      </div>

      <button
        className="grid size-11 place-items-center rounded-full border border-white/25 bg-white/15 backdrop-blur-xl md:hidden"
        type="button"
        aria-label="Toggle navigation"
        onClick={() => setMenuOpen((v) => !v)}
      >
        {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {menuOpen && (
        <div className="absolute right-5 top-20 z-30 w-60 rounded-2xl border border-white/15 bg-surface-deep/95 p-4 shadow-2xl backdrop-blur-2xl md:hidden">
          {navLinks.map(({ href, label, isRoute }) =>
            isRoute ? (
              <Link
                key={label}
                to={href}
                className="mobile-nav-link"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ) : (
              <a
                key={label}
                href={href}
                className="mobile-nav-link"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ),
          )}
          {user && (
            <Link
              to="/admin"
              className="mobile-nav-link"
              onClick={() => setMenuOpen(false)}
            >
              Admin Panel
            </Link>
          )}
          <div className="mt-3 border-t border-white/10 pt-3">
            <button
              type="button"
              onClick={() => { setMenuOpen(false); openDonation(); }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-black text-midnight"
            >
              <Heart className="size-4" />
              Donate / Get Involved
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
