import { Mail, MapPin, Shield, Facebook, Twitter, Instagram, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { NewsletterForm } from "./NewsletterForm";

const footerLinks = {
  Foundation: [
    { label: "About Us", href: "/#about" },
    { label: "Our Programs", href: "/#programs" },
    { label: "School Needs", href: "/#schools" },
    { label: "Moments Wheel", href: "/#moments" },
    { label: "Our Partners", href: "/#partners" },
  ],
  "Get Involved": [
    { label: "Needs Report", href: "/urgent-needs" },
    { label: "Updates & Blog", href: "/blog" },
    { label: "Volunteer", href: null, modal: true },
    { label: "Donate Funds", href: null, modal: true },
    { label: "Corporate Partnerships", href: null, modal: true },
  ],
};

export function Footer({ openDonation }) {
  return (
    <footer className="bg-[#0a0f1a] text-white/80">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-full border border-white/20 bg-white/10">
                <Heart className="size-5 text-gold" />
              </div>
              <span className="text-sm font-black uppercase leading-tight tracking-wide text-white">
                The Saviour Malema Foundation
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/55">
              A community-first NGO restoring dignity and building futures for less privileged
              families through transparent, care-driven outreach.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/50 transition hover:border-gold/40 hover:text-gold"
              >
                <Facebook className="size-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/50 transition hover:border-gold/40 hover:text-gold"
              >
                <Twitter className="size-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/50 transition hover:border-gold/40 hover:text-gold"
              >
                <Instagram className="size-4" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/40">{heading}</p>
              <ul className="mt-4 grid gap-2">
                {links.map(({ label, href, modal }) => (
                  <li key={label}>
                    {modal ? (
                      <button
                        type="button"
                        onClick={openDonation}
                        className="text-sm text-white/60 transition hover:text-white"
                      >
                        {label}
                      </button>
                    ) : href?.startsWith("/") ? (
                      <Link to={href} className="text-sm text-white/60 transition hover:text-white">
                        {label}
                      </Link>
                    ) : (
                      <a href={href} className="text-sm text-white/60 transition hover:text-white">
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/40">
              Stay connected
            </p>
            <p className="mt-3 text-sm leading-6 text-white/55">
              Get impact reports and outreach updates in your inbox.
            </p>
            <div className="mt-4">
              <NewsletterForm />
            </div>
            <div className="mt-5 grid gap-2 text-sm text-white/55">
              <a
                className="flex items-center gap-2 transition hover:text-white"
                href="mailto:hello@saviourmalemafoundation.co.bw"
              >
                <Mail className="size-3.5 shrink-0 text-gold" aria-hidden="true" />
                hello@saviourmalemafoundation.co.bw
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="size-3.5 shrink-0 text-gold" aria-hidden="true" />
                Community outreach hub, Botswana
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8 bg-black/30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} The Saviour Malema Foundation. All rights reserved.
          </p>
          <Link
            to="/login"
            aria-label="Admin portal"
            title="Admin portal"
            className="grid size-7 place-items-center rounded-full text-white/15 transition hover:text-white/40"
          >
            <Shield className="size-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
