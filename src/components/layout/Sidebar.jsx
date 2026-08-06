import { ArrowUpRight, Gem, Sparkles, X } from "lucide-react";
import { navigationGroups, secondaryNavigation } from "@/config/navigation";
import { cn } from "@/utils/cn";

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid size-11 shrink-0 place-items-center rounded-[15px] bg-[var(--sidebar-active)] text-white shadow-lg shadow-violet-950/25">
        <Gem size={22} strokeWidth={2.3} />
        <span className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-[var(--sidebar)] bg-[var(--accent)]" />
      </div>
      <div className="min-w-0">
        <p className="m-0 truncate text-[15px] font-bold tracking-[-0.02em] text-[var(--sidebar-text)]">Joota Chupai</p>
        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--sidebar-muted)]">Event marketplace</p>
      </div>
    </div>
  );
}

function NavItem({ item }) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      className={cn(
        "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-colors",
        item.active
          ? "bg-[var(--sidebar-active)] text-white shadow-lg shadow-violet-950/20"
          : "text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-surface)] hover:text-[var(--sidebar-text)]",
      )}
    >
      <Icon size={18} strokeWidth={item.active ? 2.3 : 1.9} />
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span className={cn(
          "rounded-full px-2 py-0.5 text-[10px] font-bold",
          item.active ? "bg-white/18 text-white" : "bg-[var(--sidebar-surface)] text-[var(--sidebar-text)]",
        )}>
          {item.badge}
        </span>
      )}
    </button>
  );
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-[var(--overlay)] backdrop-blur-[2px] transition-opacity lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside className={cn(
        "sidebar-shadow fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col overflow-y-auto border-r border-[var(--sidebar-border)] bg-[var(--sidebar)] px-4 py-5 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full",
      )}>
        <div className="flex items-center justify-between px-2">
          <Logo />
          <button type="button" aria-label="Close menu" onClick={onClose} className="grid size-9 place-items-center rounded-lg text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-surface)] hover:text-white lg:hidden">
            <X size={19} />
          </button>
        </div>

        <nav className="mt-8 flex-1 space-y-6" aria-label="Admin navigation">
          {navigationGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--sidebar-muted)]/65">{group.label}</p>
              <div className="space-y-1">
                {group.items.map((item) => <NavItem key={item.label} item={item} />)}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-6 rounded-2xl border border-white/8 bg-[var(--sidebar-surface)] p-4">
          <div className="mb-3 grid size-8 place-items-center rounded-lg bg-[var(--secondary)]/15 text-[var(--secondary)]">
            <Sparkles size={17} />
          </div>
          <p className="m-0 text-xs font-semibold text-[var(--sidebar-text)]">Make every event count</p>
          <p className="mb-3 mt-1 text-[10px] leading-4 text-[var(--sidebar-muted)]">Your marketplace is growing beautifully.</p>
          <button type="button" className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--accent)]">
            View insights <ArrowUpRight size={13} />
          </button>
        </div>

        <div className="mt-4 space-y-1 border-t border-[var(--sidebar-border)] pt-4">
          {secondaryNavigation.map((item) => <NavItem key={item.label} item={item} />)}
        </div>
      </aside>
    </>
  );
}
