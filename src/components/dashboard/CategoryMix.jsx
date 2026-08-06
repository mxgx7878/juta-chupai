import { categoryMix } from "@/data/dashboard";

export default function CategoryMix() {
  const gradient = `conic-gradient(${categoryMix
    .map((item, index) => {
      const start = categoryMix.slice(0, index).reduce((sum, current) => sum + current.value, 0);
      return `${item.color} ${start}% ${start + item.value}%`;
    })
    .join(", ")})`;

  return (
    <div className="grid items-center gap-6 px-5 pb-6 pt-2 sm:grid-cols-[150px_1fr] sm:px-6">
      <div className="relative mx-auto grid size-36 place-items-center rounded-full" style={{ background: gradient }}>
        <div className="grid size-[92px] place-items-center rounded-full bg-[var(--surface)] text-center">
          <div>
            <p className="m-0 text-xl font-extrabold tracking-[-0.04em] text-[var(--foreground)]">1,284</p>
            <p className="m-0 text-[8px] font-semibold uppercase tracking-wider text-[var(--muted)]">Vendors</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-1">
        {categoryMix.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="size-2.5 rounded-full" style={{ background: item.color }} />
            <span className="flex-1 text-[10px] font-medium text-[var(--muted-strong)]">{item.label}</span>
            <span className="text-[10px] font-bold text-[var(--foreground)]">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
