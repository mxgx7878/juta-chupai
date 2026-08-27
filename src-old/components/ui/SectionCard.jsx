import { cn } from "@/utils/cn";

export default function SectionCard({ title, description, action, children, className }) {
  return (
    <section className={cn("soft-shadow rounded-[22px] border border-[var(--border)] bg-[var(--surface)]", className)}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-4 px-5 pb-3 pt-5 sm:px-6 sm:pt-6">
          <div>
            {title && <h2 className="m-0 text-sm font-bold tracking-[-0.01em] text-[var(--foreground)]">{title}</h2>}
            {description && <p className="mb-0 mt-1 text-[11px] text-[var(--muted)]">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
