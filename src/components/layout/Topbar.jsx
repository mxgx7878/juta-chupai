import { Bell, ChevronDown, Menu, Search } from "lucide-react";

export default function Topbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-[var(--border)] bg-[var(--surface)]/88 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <button type="button" aria-label="Open navigation" onClick={onMenuClick} className="grid size-10 shrink-0 place-items-center rounded-xl border border-[var(--border)] text-[var(--muted-strong)] lg:hidden">
        <Menu size={20} />
      </button>

      <label className="hidden h-10 max-w-[360px] flex-1 items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-3 text-[var(--muted)] sm:flex">
        <Search size={17} />
        <input aria-label="Search dashboard" placeholder="Search vendors, bookings..." className="min-w-0 flex-1 border-0 bg-transparent text-xs text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]" />
        <kbd className="rounded-md border border-[var(--border-strong)] bg-[var(--surface)] px-1.5 py-0.5 text-[9px] font-semibold text-[var(--muted)]">⌘ K</kbd>
      </label>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <button type="button" aria-label="Notifications" className="relative grid size-10 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted-strong)] transition-colors hover:bg-[var(--surface-subtle)]">
          <Bell size={18} />
          <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-white bg-[var(--secondary)]" />
        </button>
        <button type="button" className="flex items-center gap-2 rounded-xl border border-transparent p-1 pr-1.5 text-left transition-colors hover:border-[var(--border)] hover:bg-[var(--surface-subtle)] sm:gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--secondary))] text-xs font-bold text-white">AY</span>
          <span className="hidden sm:block">
            <span className="block text-xs font-bold text-[var(--foreground)]">Areeba Younus</span>
            <span className="block text-[10px] text-[var(--muted)]">Super admin</span>
          </span>
          <ChevronDown size={15} className="hidden text-[var(--muted)] sm:block" />
        </button>
      </div>
    </header>
  );
}
