import { useState } from "react";
import { Inbox, Trash2, Mail, Phone, MessageSquare, ChevronDown } from "lucide-react";
import { useDonations } from "../../hooks/useDonations";
import { formatDate } from "../../utils/formatDate";

const STATUS_OPTIONS = ["new", "contacted", "closed"];
const STATUS_META = {
  new:       { label: "New",       cls: "bg-ember/15 text-ember border-ember/30" },
  contacted: { label: "Contacted", cls: "bg-gold/15 text-gold border-gold/30" },
  closed:    { label: "Closed",    cls: "bg-white/8 text-white/40 border-white/15" },
};

const FILTER_OPTIONS = ["All", "new", "contacted", "closed"];

export function DonationsAdmin() {
  const { donations, loading, updateStatus, deleteInquiry } = useDonations();
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState(null);

  const visible =
    filter === "All" ? donations : donations.filter((d) => d.status === filter);

  async function handleStatus(id, status) {
    await updateStatus(id, status);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this inquiry permanently?")) return;
    await deleteInquiry(id);
    if (expanded === id) setExpanded(null);
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/30">Inbox</p>
        <h1 className="mt-2 text-2xl font-black text-white">Inquiries</h1>
        <p className="mt-1 text-sm text-white/45">
          All donations and volunteer enquiries submitted through the site.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setFilter(opt)}
            className={`rounded-full px-4 py-1.5 text-xs font-black transition ${
              filter === opt
                ? "bg-gold text-midnight"
                : "border border-white/10 bg-white/5 text-white/55 hover:bg-white/10 hover:text-white"
            }`}
          >
            {opt === "All" ? `All (${donations.length})` : `${STATUS_META[opt].label} (${donations.filter((d) => d.status === opt).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="size-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-white/8 bg-white/3 p-16 text-center">
          <Inbox className="mx-auto size-10 text-white/20" />
          <p className="mt-4 text-sm text-white/35">
            {filter === "All" ? "No inquiries yet." : `No ${filter} inquiries.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {visible.map((inq) => {
            const meta = STATUS_META[inq.status] ?? STATUS_META.new;
            const isOpen = expanded === inq.id;
            return (
              <div
                key={inq.id}
                className="rounded-2xl border border-white/8 bg-[#0a0f1a] overflow-hidden"
              >
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-black text-white">{inq.name}</p>
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-black ${meta.cls}`}>
                        {meta.label}
                      </span>
                      {inq.interest && (
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold text-white/50">
                          {inq.interest}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-white/45">
                      <span className="flex items-center gap-1">
                        <Mail className="size-3" />
                        {inq.email}
                      </span>
                      {inq.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="size-3" />
                          {inq.phone}
                        </span>
                      )}
                      {inq.pledge_amount && (
                        <span className="text-gold font-bold">
                          P{Number(inq.pledge_amount).toLocaleString()}/mo pledge
                        </span>
                      )}
                      <span>{formatDate(inq.submitted_at?.split("T")[0])}</span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <div className="relative">
                      <select
                        value={inq.status}
                        onChange={(e) => handleStatus(inq.id, e.target.value)}
                        className="appearance-none rounded-lg border border-white/10 bg-white/5 py-1.5 pl-3 pr-7 text-xs font-bold text-white/70 outline-none transition hover:bg-white/10 focus:border-gold/50"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} className="bg-midnight">
                            {STATUS_META[s].label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-white/40" />
                    </div>

                    {inq.message && (
                      <button
                        type="button"
                        title="View message"
                        onClick={() => setExpanded(isOpen ? null : inq.id)}
                        className={`grid size-8 place-items-center rounded-lg border transition ${
                          isOpen
                            ? "border-gold/40 bg-gold/10 text-gold"
                            : "border-white/10 bg-white/5 text-white/40 hover:text-white"
                        }`}
                      >
                        <MessageSquare className="size-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      title="Delete"
                      onClick={() => handleDelete(inq.id)}
                      className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/30 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                {isOpen && inq.message && (
                  <div className="border-t border-white/8 bg-white/2 px-5 py-4">
                    <p className="text-xs font-black uppercase tracking-wide text-white/30 mb-2">
                      Message
                    </p>
                    <p className="text-sm leading-6 text-white/65 whitespace-pre-wrap">
                      {inq.message}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
