import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, CheckCircle, Users, CalendarCheck, Handshake, School, AlertCircle, MapPin, BookOpen } from "lucide-react";
import { MomentWheel3D } from "../components/MomentWheel3D";
import { BlogCard } from "../components/BlogCard";
import { Reveal } from "../components/Reveal";
import { CountUp } from "../components/CountUp";
import { useMoments } from "../hooks/useMoments";
import { useBlogPosts } from "../hooks/useBlogPosts";
import { usePartners } from "../hooks/usePartners";
import { useSiteSettings } from "../hooks/useSiteSettings";
import { useDonationModal } from "../context/DonationContext";
import { useServices } from "../hooks/useServices";
import { useTeam } from "../hooks/useTeam";
import { SERVICE_ICON_MAP, defaultSchoolNeeds } from "../lib/constants";
import { formatDate } from "../utils/formatDate";

const ACCENT_CLASSES = {
  ember: "text-ember border-ember/30 bg-ember/10",
  gold:  "text-gold  border-gold/30  bg-gold/10",
  grove: "text-grove border-grove/30 bg-grove/10",
};

const STAT_BAR = [
  { value: "500+", label: "Families reached monthly", icon: Heart },
  { value: "350+", label: "Learners supported", icon: CheckCircle },
  { value: "48",   label: "Volunteer drives", icon: CalendarCheck },
  { value: "6",    label: "Active programmes", icon: Users },
];

export function HomePage() {
  const { moments } = useMoments();
  const { posts: blogPosts } = useBlogPosts({ publishedOnly: true });
  const { partners } = usePartners();
  const { pledgeSettings } = useSiteSettings();
  const { openDonation } = useDonationModal();
  const { services } = useServices();
  const { members } = useTeam();

  const [pledge, setPledge] = useState(pledgeSettings.defaultAmount);
  const [activeMoment, setActiveMoment] = useState(0);

  const impact = useMemo(() => {
    const u1 = Math.round(pledge / pledgeSettings.unit1Divisor);
    const u2 = Math.max(pledgeSettings.unit2Min, Math.round(pledge / pledgeSettings.unit2Divisor));
    return { u1, u2 };
  }, [pledge, pledgeSettings]);

  const currentMoment = moments[activeMoment] ?? moments[0];
  const featuredPosts = blogPosts.slice(0, 3);
  const featuredPartners = partners.filter((p) => p.featured);

  function spinWheel(direction) {
    setActiveMoment((i) => (i + direction + moments.length) % moments.length);
  }

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        id="home"
        className="relative min-h-screen overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgb(var(--c-surface-deep) / 0.9), rgb(var(--c-grove) / 0.4)), url('https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=2400&q=85')",
        }}
      >
        {/* Drifting theme-coloured glow blobs */}
        <div className="glow-blob left-[8%] top-[18%] size-72 animate-glow-drift bg-gold/25" />
        <div className="glow-blob right-[6%] top-[30%] size-80 animate-glow-drift-slow bg-ember/20" />
        <div className="glow-blob bottom-[8%] left-[40%] size-72 animate-glow-drift bg-grove/20" />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-5 pb-24 pt-32 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pb-32 lg:pt-36">
          <div className="animate-reveal-up">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-bold text-white/90 shadow-glass backdrop-blur-xl">
              <CheckCircle className="size-4 text-gold" aria-hidden="true" />
              Community-first NGO · Botswana
            </p>
            <h1 className="max-w-2xl text-5xl font-black leading-[0.95] sm:text-6xl lg:text-7xl">
              Restoring Dignity,<br />
              <span className="text-gold">Building Futures.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">
              The Saviour Malema Foundation serves less privileged families through food relief,
              education support, youth development, and dignity-centred community outreach.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => openDonation()}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-black text-midnight shadow-xl shadow-gold/20 transition hover:-translate-y-0.5 hover:shadow-gold/30"
              >
                <Heart className="size-4" aria-hidden="true" />
                Donate / Get Involved
              </button>
              <a
                href="#programs"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-4 text-sm font-black text-white shadow-glass backdrop-blur-xl transition hover:bg-white/20"
              >
                See Our Programs
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Pledge Estimator card */}
          <div className="glass-panel animate-float p-6 sm:p-7">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-gold">
              Live pledge estimator
            </p>
            <p className="mt-3 text-sm leading-6 text-white/80">
              A monthly pledge of{" "}
              <strong className="text-white">
                {pledgeSettings.currency}{pledge.toLocaleString()}
              </strong>{" "}
              can provide roughly{" "}
              <strong className="text-white">{impact.u1} {pledgeSettings.unit1Label}</strong> or{" "}
              <strong className="text-white">
                {impact.u2} {pledgeSettings.unit2Label}
              </strong>
              .
            </p>
            <input
              aria-label="Monthly pledge amount"
              className="mt-5 w-full accent-gold"
              type="range"
              min={pledgeSettings.min}
              max={pledgeSettings.max}
              step={pledgeSettings.step}
              value={pledge}
              onChange={(e) => setPledge(Number(e.target.value))}
            />
            <div className="mt-2 flex justify-between text-xs font-bold text-white/50">
              <span>{pledgeSettings.currency}{pledgeSettings.min}</span>
              <span>{pledgeSettings.currency}{pledgeSettings.max.toLocaleString()}</span>
            </div>
            <button
              type="button"
              onClick={() => openDonation(pledge)}
              className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-black text-midnight transition hover:-translate-y-0.5"
            >
              <Heart className="size-4" />
              Start with {pledgeSettings.currency}{pledge.toLocaleString()}/month
            </button>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
              {STAT_BAR.slice(0, 4).map(({ value, label, icon: Icon }) => (
                <div key={label} className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center gap-1.5">
                    <Icon className="size-3.5 text-gold" aria-hidden="true" />
                    <span className="text-xl font-black text-white">{value}</span>
                  </div>
                  <p className="mt-1 text-[11px] font-semibold leading-4 text-white/55">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STAT BAND ────────────────────────────────────── */}
      <section className="bg-gold py-5">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-5 sm:px-8 lg:grid-cols-4">
          {STAT_BAR.map(({ value, label, icon: Icon }) => (
            <div key={label} className="flex items-center gap-3 px-4 py-3">
              <Icon className="size-6 shrink-0 text-midnight/60" aria-hidden="true" />
              <div>
                <CountUp value={value} className="text-2xl font-black text-midnight" />
                <p className="text-[11px] font-bold uppercase tracking-wide text-midnight/60">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROGRAMS / SERVICES ──────────────────────────── */}
      <section id="programs" className="bg-midnight px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="max-w-2xl">
            <p className="section-kicker">Our programmes</p>
            <h2 className="section-title">How we show up for communities.</h2>
            <p className="mt-5 leading-7 text-white/65">
              Six focused programmes, each targeting a distinct dimension of need — from immediate
              food relief to long-term youth development.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...services].sort((a, b) => a.order - b.order).map(({ id, icon_name, title, description, stat, accent }, i) => {
              const Icon = SERVICE_ICON_MAP[icon_name] || SERVICE_ICON_MAP.Package;
              return (
                <Reveal
                  as="article"
                  key={id}
                  delay={i * 70}
                  className="lift-card group rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-white/20 hover:bg-white/8 hover:shadow-glow"
                >
                  <div
                    className={`inline-flex items-center justify-center rounded-xl border p-3 transition duration-300 group-hover:-rotate-6 group-hover:scale-110 ${ACCENT_CLASSES[accent]}`}
                  >
                    <Icon className="size-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-lg font-black text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/65">{description}</p>
                  <p className={`mt-4 text-xs font-black uppercase tracking-wide ${ACCENT_CLASSES[accent].split(" ")[0]}`}>
                    {stat}
                  </p>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => openDonation()}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-7 py-3 text-sm font-black text-white transition hover:bg-white/15"
            >
              <Handshake className="size-4" />
              Support a programme
            </button>
          </div>
        </div>
      </section>

      {/* ── ABOUT US ─────────────────────────────────────── */}
      <section id="about" className="bg-surface px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">

            {/* Foundation story */}
            <Reveal>
              <p className="section-kicker">About us</p>
              <h2 className="section-title">Built on a promise to serve.</h2>
              <p className="mt-5 leading-7 text-white/65">
                The Saviour Malema Foundation was established in February 2024 in Botswana with
                one conviction: that every family deserves to be treated with dignity, regardless
                of circumstance.
              </p>
              <p className="mt-4 leading-7 text-white/65">
                What began as a small volunteer circle has grown into a structured organisation
                running six active programmes — from food relief and education support to elder care
                and youth development. We are transparent, community-driven, and relentlessly
                focused on practical impact.
              </p>

              <div className="mt-8 grid gap-4">
                {[
                  {
                    title: "Dignity first",
                    text: "Every intervention respects the humanity of the people we serve.",
                  },
                  {
                    title: "Radical transparency",
                    text: "Our donations, processes, and outcomes are documented and shared openly.",
                  },
                  {
                    title: "Community ownership",
                    text: "Programmes are designed with communities, not just delivered to them.",
                  },
                ].map(({ title, text }) => (
                  <div key={title} className="flex gap-4">
                    <div className="mt-1.5 size-2 shrink-0 rounded-full bg-gold" />
                    <div>
                      <p className="text-sm font-black text-white">{title}</p>
                      <p className="text-sm leading-6 text-white/55">{text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => openDonation()}
                className="mt-9 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-black text-white shadow-lg shadow-gold/20 transition hover:-translate-y-0.5"
              >
                <Heart className="size-4" />
                Join our mission
              </button>
            </Reveal>

            {/* Team grid */}
            <div>
              <p className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-white/30">
                Our team
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[...members].sort((a, b) => a.order - b.order).map((member, i) => (
                  <Reveal
                    key={member.id}
                    delay={i * 70}
                    className="lift-card rounded-2xl border border-white/8 bg-white/3 p-5 hover:border-white/15 hover:bg-white/5"
                  >
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.name}
                        className="size-16 rounded-full object-cover ring-2 ring-gold/30"
                      />
                    ) : (
                      <div className="grid size-16 place-items-center rounded-full bg-gold/15 text-lg font-black text-gold ring-2 ring-gold/20">
                        {member.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                      </div>
                    )}
                    <h3 className="mt-4 font-black text-white">{member.name}</h3>
                    <p className="text-xs font-bold text-gold">{member.role}</p>
                    <p className="mt-2 text-sm leading-6 text-white/55">{member.bio}</p>
                  </Reveal>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── MOMENTS WHEEL ───────────────────────────────── */}
      <section
        id="moments"
        className="relative overflow-hidden px-5 py-24 sm:px-8"
        style={{
          background:
            "linear-gradient(180deg, rgb(var(--c-midnight)) 0%, rgb(var(--c-surface)) 50%, rgb(var(--c-midnight)) 100%)",
        }}
      >
        <div className="glow-blob right-[10%] top-[12%] size-96 animate-glow-drift-slow bg-ember/20" />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="section-kicker">Living timeline</p>
              <h2 className="section-title">A spinning wheel of defining moments.</h2>
              <p className="mt-5 max-w-sm leading-7 text-white/65">
                Spin through donations, community milestones, anniversaries, and outreach moments
                that define the foundation's journey.
              </p>

              {currentMoment && (
                <article className="glass-panel mt-8 overflow-hidden">
                  <img
                    className="h-56 w-full object-cover"
                    src={currentMoment.image_url || currentMoment.image}
                    alt=""
                  />
                  <div className="p-5">
                    <div className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-wide">
                      <span className="rounded-full bg-gold px-3 py-1 text-midnight">
                        {currentMoment.category}
                      </span>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-white/70">
                        {formatDate(currentMoment.date)}
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-black">{currentMoment.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/70">{currentMoment.impact}</p>
                  </div>
                </article>
              )}
            </div>

            <MomentWheel3D
              moments={moments}
              activeMoment={activeMoment}
              onSpin={spinWheel}
              onSelect={setActiveMoment}
            />
          </div>
        </div>
      </section>

      {/* ── SCHOOL NEEDS ────────────────────────────────── */}
      <section id="schools" className="bg-surface px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="max-w-2xl">
            <p className="section-kicker">Urgent school needs</p>
            <h2 className="section-title">Documented shortages in our schools.</h2>
            <p className="mt-5 leading-7 text-white/65">
              These are real requests, signed and stamped by school heads in the Bobonong and
              Letlhakeng areas. Each one represents children learning without the basics. Your
              support turns these letters into classrooms, uniforms, and dignity.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {defaultSchoolNeeds.map(({ id, school, location, accent, headline, stats, needs }, i) => (
              <Reveal
                as="article"
                key={id}
                delay={i * 80}
                className="lift-card flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-white/20 hover:bg-white/8 hover:shadow-glow"
              >
                <div
                  className={`inline-flex w-fit items-center justify-center rounded-xl border p-3 ${ACCENT_CLASSES[accent]}`}
                >
                  <School className="size-6" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-black text-white">{school}</h3>
                <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-white/45">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {location}
                </p>
                <p className="mt-4 flex gap-2 text-sm leading-6 text-white/75">
                  <AlertCircle
                    className={`mt-0.5 size-4 shrink-0 ${ACCENT_CLASSES[accent].split(" ")[0]}`}
                    aria-hidden="true"
                  />
                  <span>{headline}</span>
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {stats.map((s) => (
                    <span
                      key={s.label}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs"
                    >
                      <strong className="text-white">{s.value}</strong>{" "}
                      <span className="text-white/50">{s.label}</span>
                    </span>
                  ))}
                </div>

                <ul className="mt-5 grid gap-2 border-t border-white/10 pt-5">
                  {needs.map((need) => (
                    <li key={need} className="flex gap-2.5 text-sm leading-6 text-white/65">
                      <span
                        className={`mt-2 size-1.5 shrink-0 rounded-full ${
                          accent === "ember" ? "bg-ember" : accent === "gold" ? "bg-gold" : "bg-grove"
                        }`}
                      />
                      {need}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              to="/urgent-needs"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-black text-midnight shadow-lg shadow-gold/20 transition hover:-translate-y-0.5"
            >
              <BookOpen className="size-4" />
              See the full needs report
            </Link>
            <button
              type="button"
              onClick={() => openDonation()}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-7 py-3 text-sm font-black text-white transition hover:bg-white/15"
            >
              <Heart className="size-4" />
              Help a school today
            </button>
          </div>
        </div>
      </section>

      {/* ── LATEST UPDATES ──────────────────────────────── */}
      <section id="updates" className="bg-midnight px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="section-kicker">Latest updates</p>
              <h2 className="section-title">Stories from the ground.</h2>
            </div>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm font-bold text-gold transition hover:text-white"
            >
              View all updates
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          {featuredPosts.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPosts.map((post, i) => (
                <Reveal key={post.id} delay={i * 80}>
                  <BlogCard post={post} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-10 glass-panel p-10 text-center">
              <p className="text-white/40">No updates published yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── PARTNERS ─────────────────────────────────────── */}
      <section id="partners" className="bg-surface-deep px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="text-center">
            <p className="section-kicker">Partners & collaborators</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              The organisations walking with us.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/55">
              We amplify impact through trusted partnerships — from food redistribution and healthcare
              to youth employment and education.
            </p>
          </Reveal>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {featuredPartners.map((partner, i) => {
              const initials = partner.name
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("");
              return (
                <Reveal
                  as="a"
                  key={partner.id}
                  delay={i * 60}
                  href={partner.website || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lift-card group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 hover:border-gold/30 hover:bg-white/10"
                >
                  {partner.logo_url ? (
                    <img
                      src={partner.logo_url}
                      alt={partner.name}
                      className="h-9 w-auto object-contain"
                    />
                  ) : (
                    <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-gold/15 text-xs font-black text-gold">
                      {initials}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-black text-white group-hover:text-gold transition">
                      {partner.name}
                    </p>
                    {partner.description && (
                      <p className="text-xs text-white/45">{partner.description}</p>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => openDonation()}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-6 py-3 text-sm font-black text-white transition hover:border-gold/30 hover:text-gold"
            >
              <Handshake className="size-4" />
              Become a partner
            </button>
          </div>
        </div>
      </section>

      {/* ── PLEDGE / CTA BAND ───────────────────────────── */}
      <section
        className="relative overflow-hidden bg-gold px-5 py-20 sm:px-8"
      >
        <div className="glow-blob right-[12%] top-1/2 size-96 -translate-y-1/2 bg-ember/30" />
        <div className="sheen-wrap">
          <div className="sheen-bar animate-sheen" />
        </div>
        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-midnight/60">
            Make a difference
          </p>
          <h2 className="max-w-2xl text-4xl font-black leading-tight text-midnight sm:text-5xl">
            Every pledge builds something real.
          </h2>
          <p className="max-w-xl text-base leading-7 text-midnight/75">
            A monthly commitment of just{" "}
            <strong>P{pledgeSettings.defaultAmount}</strong> provides{" "}
            <strong>
              {Math.round(pledgeSettings.defaultAmount / pledgeSettings.unit1Divisor)}{" "}
              {pledgeSettings.unit1Label}
            </strong>{" "}
            or{" "}
            <strong>
              {Math.max(
                pledgeSettings.unit2Min,
                Math.round(pledgeSettings.defaultAmount / pledgeSettings.unit2Divisor),
              )}{" "}
              {pledgeSettings.unit2Label}
            </strong>{" "}
            to a family in need.
          </p>
          <button
            type="button"
            onClick={() => openDonation()}
            className="inline-flex items-center gap-2 rounded-full bg-midnight px-8 py-4 text-sm font-black text-white shadow-2xl transition hover:-translate-y-0.5"
          >
            <Heart className="size-4" />
            Get involved today
          </button>
        </div>
      </section>
    </>
  );
}
