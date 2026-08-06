import { activityFeed } from "@/data/dashboard";

const dotTones = {
  primary: "bg-[var(--primary)] ring-[var(--primary-soft)]",
  success: "bg-[var(--success)] ring-[var(--success-soft)]",
  danger: "bg-[var(--danger)] ring-[var(--danger-soft)]",
  accent: "bg-[var(--accent)] ring-[var(--accent-soft)]",
};

export default function ActivityFeed() {
  return (
    <div className="px-5 pb-4 sm:px-6">
      {activityFeed.map((activity, index) => (
        <div key={activity.title} className="relative flex gap-3 pb-5 last:pb-1">
          {index < activityFeed.length - 1 && <span className="absolute left-[5px] top-4 h-[calc(100%-8px)] w-px bg-[var(--border)]" />}
          <span className={`relative mt-1.5 size-2.5 shrink-0 rounded-full ring-4 ${dotTones[activity.tone]}`} />
          <div className="min-w-0 flex-1">
            <p className="m-0 text-[11px] font-bold text-[var(--foreground)]">{activity.title}</p>
            <p className="mb-0 mt-1 truncate text-[9px] text-[var(--muted)]">{activity.detail}</p>
          </div>
          <span className="shrink-0 text-[8px] font-medium text-[var(--muted)]">{activity.time}</span>
        </div>
      ))}
    </div>
  );
}
