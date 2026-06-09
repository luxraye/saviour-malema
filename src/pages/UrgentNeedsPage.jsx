import { Link } from "react-router-dom";
import {
  Printer, ArrowLeft, School, MapPin, AlertCircle, Quote, Heart,
  Landmark, FileText, Shirt,
} from "lucide-react";
import { useDonationModal } from "../context/DonationContext";
import {
  defaultSchoolNeeds,
  mabumahibiduLearners,
  foundationBankDetails,
  schoolLetterDocs,
} from "../lib/constants";
import { formatDate } from "../utils/formatDate";

const ACCENT_TEXT = {
  ember: "text-ember",
  gold: "text-gold",
  grove: "text-grove",
};

const ACCENT_DOT = {
  ember: "bg-ember",
  gold: "bg-gold",
  grove: "bg-grove",
};

export function UrgentNeedsPage() {
  const { openDonation } = useDonationModal();

  return (
    <main className="booklet bg-midnight pt-24 text-white print:bg-white print:pt-0 print:text-black">
      {/* ── Action bar (screen only) ─────────────────────── */}
      <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-6 print:hidden sm:px-8">
        <Link
          to="/#schools"
          className="inline-flex items-center gap-2 text-sm font-bold text-white/60 transition hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Back to site
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-black text-midnight shadow-lg shadow-gold/20 transition hover:-translate-y-0.5"
        >
          <Printer className="size-4" />
          Download / Print as PDF
        </button>
      </div>

      <article className="mx-auto max-w-4xl px-5 pb-24 sm:px-8 print:max-w-none print:px-0 print:pb-0">
        {/* ── Cover ──────────────────────────────────────── */}
        <header className="booklet-page rounded-3xl border border-white/10 bg-white/5 p-8 text-center sm:p-12 print:rounded-none print:border-0 print:bg-transparent">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-gold shadow-lg shadow-gold/30 print:shadow-none">
            <span className="text-lg font-black tracking-tighter text-white print:text-black">SMF</span>
          </div>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.25em] text-gold">
            The Saviour Malema Foundation
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
            School Needs Report
            <span className="block text-gold">2026</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl leading-7 text-white/65 print:text-black/70">
            A documented record of urgent shortages in primary schools across the Bobonong and
            Letlhakeng areas — drawn directly from official requests signed by school heads.
          </p>
          <p className="mt-6 text-sm font-bold text-white/40 print:text-black/50">
            Restoring Dignity, Building Futures · Bobonong, Botswana
          </p>
        </header>

        {/* ── Why this matters ───────────────────────────── */}
        <section className="mt-12 print:mt-10">
          <h2 className="text-2xl font-black sm:text-3xl">Why this report exists</h2>
          <p className="mt-4 leading-8 text-white/70 print:text-black/75">
            The Saviour Malema Foundation, established in 2024 in Bobonong, exists to serve
            less-privileged families with dignity. In April 2026, three primary schools wrote to us
            with the same message in different words: their learners are going without the basics
            needed to learn safely. Children are taught outside under trees, reception classes sit
            in storerooms, and families can no longer afford uniforms after community support was
            withdrawn during the economic recession.
          </p>
          <p className="mt-4 leading-8 text-white/70 print:text-black/75">
            This booklet brings those requests together so that donors and partners can see exactly
            what is needed, at which school, and how to help. Every item listed here comes from a
            signed, stamped letter — the scanned originals are included as an appendix at the end.
          </p>
        </section>

        {/* ── Per-school sections ────────────────────────── */}
        {defaultSchoolNeeds.map((school, index) => (
          <section
            key={school.id}
            className="booklet-page mt-12 border-t border-white/10 pt-10 print:border-black/15"
          >
            <div className="flex items-start gap-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/5 print:border-black/20">
                <School className={`size-6 ${ACCENT_TEXT[school.accent]}`} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40 print:text-black/50">
                  School {index + 1} of {defaultSchoolNeeds.length}
                </p>
                <h2 className="mt-1 text-2xl font-black sm:text-3xl">{school.school}</h2>
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-white/50 print:text-black/60">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {school.location}
                </p>
              </div>
            </div>

            <p className="mt-6 flex gap-3 text-lg font-bold leading-7">
              <AlertCircle
                className={`mt-1 size-5 shrink-0 ${ACCENT_TEXT[school.accent]}`}
                aria-hidden="true"
              />
              {school.headline}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {school.stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 print:border-black/15 print:bg-transparent"
                >
                  <p className={`text-2xl font-black ${ACCENT_TEXT[school.accent]}`}>{s.value}</p>
                  <p className="text-xs font-semibold text-white/55 print:text-black/60">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-8 sm:grid-cols-[1.3fr_1fr]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/40 print:text-black/50">
                  What they need
                </p>
                <ul className="mt-4 grid gap-3">
                  {school.needs.map((need) => (
                    <li key={need} className="flex gap-3 leading-7 text-white/75 print:text-black/80">
                      <span
                        className={`mt-2.5 size-1.5 shrink-0 rounded-full ${ACCENT_DOT[school.accent]}`}
                      />
                      {need}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <blockquote className="rounded-2xl border border-white/10 bg-white/5 p-5 print:border-black/15 print:bg-transparent">
                  <Quote className={`size-5 ${ACCENT_TEXT[school.accent]}`} aria-hidden="true" />
                  <p className="mt-3 text-sm italic leading-7 text-white/75 print:text-black/80">
                    {school.quote}
                  </p>
                </blockquote>
                <p className="mt-4 text-sm leading-6 text-white/55 print:text-black/65">
                  {school.ask}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/45 print:border-black/15 print:bg-transparent print:text-black/55">
              <span className="font-bold text-white/60 print:text-black/70">Signed:</span>{" "}
              {school.signatory} · {formatDate(school.letter_date)}
              <span className="block mt-1">{school.contact}</span>
            </div>
          </section>
        ))}

        {/* ── Identified learners (uniform list) ─────────── */}
        <section className="booklet-page mt-12 border-t border-white/10 pt-10 print:border-black/15">
          <div className="flex items-center gap-3">
            <Shirt className="size-6 text-ember" aria-hidden="true" />
            <h2 className="text-2xl font-black sm:text-3xl">Identified learners — uniform list</h2>
          </div>
          <p className="mt-4 leading-7 text-white/65 print:text-black/75">
            Mabumahibidu Primary School identified the following less-privileged learners for full
            school uniforms and related supplies, captured from the school's own sizing sheets.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-white/15 bg-white/10 px-4 py-2 text-left font-black print:border-black/25 print:bg-black/5">
                    #
                  </th>
                  <th className="border border-white/15 bg-white/10 px-4 py-2 text-left font-black print:border-black/25 print:bg-black/5">
                    Learner
                  </th>
                  <th className="border border-white/15 bg-white/10 px-4 py-2 text-left font-black print:border-black/25 print:bg-black/5">
                    Grade
                  </th>
                  <th className="border border-white/15 bg-white/10 px-4 py-2 text-left font-black print:border-black/25 print:bg-black/5">
                    Gender
                  </th>
                </tr>
              </thead>
              <tbody>
                {mabumahibiduLearners.map((learner, i) => (
                  <tr key={learner.name}>
                    <td className="border border-white/15 px-4 py-2 text-white/50 print:border-black/20 print:text-black/60">
                      {i + 1}
                    </td>
                    <td className="border border-white/15 px-4 py-2 print:border-black/20">
                      {learner.name}
                    </td>
                    <td className="border border-white/15 px-4 py-2 text-white/70 print:border-black/20 print:text-black/75">
                      {learner.grade}
                    </td>
                    <td className="border border-white/15 px-4 py-2 text-white/70 print:border-black/20 print:text-black/75">
                      {learner.gender}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── How to donate ──────────────────────────────── */}
        <section className="booklet-page mt-12 border-t border-white/10 pt-10 print:border-black/15">
          <div className="flex items-center gap-3">
            <Landmark className="size-6 text-gold" aria-hidden="true" />
            <h2 className="text-2xl font-black sm:text-3xl">How to donate</h2>
          </div>
          <p className="mt-4 leading-7 text-white/65 print:text-black/75">
            Contributions can be made directly into the foundation's verified bank account. Every
            donation is documented and reported back to our supporters.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              ["Bank", foundationBankDetails.bank],
              ["Branch", foundationBankDetails.branch],
              ["Account name", foundationBankDetails.accountName],
              ["Account number", foundationBankDetails.accountNumber],
              ["Branch code", foundationBankDetails.branchCode],
              ["SWIFT", foundationBankDetails.swift],
              ["Signatories", foundationBankDetails.signatories],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 print:border-black/15 print:bg-transparent"
              >
                <p className="text-xs font-black uppercase tracking-[0.16em] text-white/40 print:text-black/50">
                  {label}
                </p>
                <p className="mt-1 font-bold text-white print:text-black">{value}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => openDonation()}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-black text-midnight shadow-lg shadow-gold/20 transition hover:-translate-y-0.5 print:hidden"
          >
            <Heart className="size-4" />
            Pledge your support
          </button>
        </section>

        {/* ── Appendix: scanned letters ──────────────────── */}
        <section className="booklet-page mt-12 border-t border-white/10 pt-10 print:border-black/15">
          <div className="flex items-center gap-3">
            <FileText className="size-6 text-grove" aria-hidden="true" />
            <h2 className="text-2xl font-black sm:text-3xl">Appendix — supporting documents</h2>
          </div>
          <p className="mt-4 leading-7 text-white/65 print:text-black/75">
            The original signed and stamped letters, request forms, and banking confirmation behind
            this report.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {schoolLetterDocs.map((doc) => (
              <figure
                key={doc.src}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 print:break-inside-avoid print:border-black/15 print:bg-transparent"
              >
                <img
                  src={doc.src}
                  alt={doc.caption}
                  loading="lazy"
                  className="w-full bg-white object-contain"
                />
                <figcaption className="px-4 py-3 text-xs leading-5 text-white/55 print:text-black/65">
                  {doc.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
