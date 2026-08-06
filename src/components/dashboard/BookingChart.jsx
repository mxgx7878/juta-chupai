import { bookingTrend } from "@/data/dashboard";

export default function BookingChart() {
  return (
    <div className="px-5 pb-5 sm:px-6 sm:pb-6">
      <div className="flex items-end gap-3 border-b border-[var(--border)] pb-4">
        <span className="text-[26px] font-extrabold tracking-[-0.04em] text-[var(--foreground)]">412</span>
        <span className="mb-1 rounded-full bg-[var(--success-soft)] px-2 py-1 text-[9px] font-bold text-[var(--success)]">+14.8%</span>
      </div>
      <div className="mt-5 flex h-[170px] items-end justify-between gap-2 sm:gap-4">
        {bookingTrend.map((item, index) => (
          <div key={item.day} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
            <div className="relative flex h-full w-full items-end justify-center rounded-lg bg-[var(--surface-subtle)]">
              <div
                className="w-full max-w-8 rounded-lg bg-[linear-gradient(180deg,var(--primary),var(--primary-strong))] opacity-85 transition-all duration-300 group-hover:opacity-100"
                style={{ height: `${item.value}%` }}
              />
              {index === 5 && <span className="absolute -top-1 left-1/2 -translate-x-1/2 rounded-md bg-[var(--foreground)] px-2 py-1 text-[8px] font-bold text-white">94</span>}
            </div>
            <span className="text-[9px] font-medium text-[var(--muted)]">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
