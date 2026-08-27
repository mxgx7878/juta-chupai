import { ArrowUpRight } from "lucide-react";

const toneStyles = {
  primary: "bg-[var(--primary-soft)] text-[var(--primary)]",
  secondary: "bg-[var(--secondary-soft)] text-[var(--secondary)]",
  info: "bg-[var(--info-soft)] text-[var(--info)]",
  accent: "bg-[var(--accent-soft)] text-[var(--accent)]",
};

export default function StatCard({ item }) {
  const Icon = item.icon;

  return (
    <article className="soft-shadow group rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-4 transition-transform duration-300 hover:-translate-y-1 sm:p-5">
      <div className="flex items-start justify-between">
        <div className={`grid size-10 place-items-center rounded-xl ${toneStyles[item.tone]}`}>
          <Icon size={19} strokeWidth={2.1} />
        </div>
        <span className="flex items-center gap-0.5 rounded-full bg-[var(--success-soft)] px-2 py-1 text-[9px] font-bold text-[var(--success)]">
          {item.change} <ArrowUpRight size={11} />
        </span>
      </div>
      <p className="mb-0 mt-5 text-[11px] font-medium text-[var(--muted)]">{item.label}</p>
      <div className="mt-1 flex flex-wrap items-end gap-x-2 gap-y-0.5">
        <p className="m-0 text-[22px] font-extrabold tracking-[-0.04em] text-[var(--foreground)] sm:text-2xl">{item.value}</p>
        <span className="pb-0.5 text-[9px] text-[var(--muted)]">{item.note}</span>
      </div>
    </article>
  );
}
