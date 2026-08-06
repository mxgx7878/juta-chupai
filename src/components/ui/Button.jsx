import { cn } from "@/utils/cn";

export default function Button({ className, children, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-xs font-bold text-[var(--primary-foreground)] shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5 hover:bg-[var(--primary-strong)] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
