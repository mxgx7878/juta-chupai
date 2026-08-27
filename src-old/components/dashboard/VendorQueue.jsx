import { ChevronRight, MapPin } from "lucide-react";
import { pendingVendors } from "@/data/dashboard";

const avatarTones = {
  primary: "bg-[var(--primary-soft)] text-[var(--primary)]",
  secondary: "bg-[var(--secondary-soft)] text-[var(--secondary)]",
  accent: "bg-[var(--accent-soft)] text-[var(--accent)]",
};

export default function VendorQueue() {
  return (
    <div className="divide-y divide-[var(--border)] px-5 pb-2 sm:px-6">
      {pendingVendors.map((vendor) => (
        <button key={vendor.name} type="button" className="flex w-full items-center gap-3 py-4 text-left">
          <span className={`grid size-10 shrink-0 place-items-center rounded-xl text-[10px] font-extrabold ${avatarTones[vendor.tone]}`}>{vendor.initials}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-bold text-[var(--foreground)]">{vendor.name}</span>
            <span className="mt-1 flex items-center gap-1 truncate text-[9px] text-[var(--muted)]">
              {vendor.category} <span>•</span> <MapPin size={10} /> {vendor.city}
            </span>
          </span>
          <span className="rounded-full bg-[var(--accent-soft)] px-2 py-1 text-[8px] font-bold uppercase tracking-wide text-[var(--accent)]">Review</span>
          <ChevronRight size={15} className="text-[var(--muted)]" />
        </button>
      ))}
    </div>
  );
}
