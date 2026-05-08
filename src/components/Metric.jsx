export function Metric({ value, label }) {
  return (
    <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
      <p className="text-3xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-white/60">{label}</p>
    </div>
  );
}
