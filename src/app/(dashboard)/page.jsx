import { ArrowRight, CalendarPlus, ChevronDown, MoreHorizontal } from "lucide-react";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import BookingChart from "@/components/dashboard/BookingChart";
import CategoryMix from "@/components/dashboard/CategoryMix";
import StatCard from "@/components/dashboard/StatCard";
import VendorQueue from "@/components/dashboard/VendorQueue";
import { Button, SectionCard } from "@/components/ui";
import { dashboardStats } from "@/data/dashboard";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-[var(--primary-soft)] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--primary)]">Live overview</span>
            <span className="text-[10px] text-[var(--muted)]">Thursday, 6 August</span>
          </div>
          <h1 className="m-0 text-2xl font-extrabold tracking-[-0.04em] text-[var(--foreground)] sm:text-[28px]">Good morning, Areeba <span aria-hidden="true">👋</span></h1>
          <p className="mb-0 mt-1.5 text-xs text-[var(--muted)]">Here&apos;s what&apos;s happening across your event marketplace today.</p>
        </div>
        <Button><CalendarPlus size={16} /> Create booking</Button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((item) => <StatCard key={item.label} item={item} />)}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]">
        <SectionCard
          title="Booking momentum"
          description="Confirmed bookings over the last 7 days"
          action={<button type="button" className="flex items-center gap-1 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-[9px] font-semibold text-[var(--muted-strong)]">This week <ChevronDown size={12} /></button>}
        >
          <BookingChart />
        </SectionCard>

        <SectionCard
          title="Vendor approvals"
          description="3 applications need your attention"
          action={<button type="button" className="flex items-center gap-1 text-[9px] font-bold text-[var(--primary)]">View all <ArrowRight size={12} /></button>}
        >
          <VendorQueue />
        </SectionCard>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.8fr)_minmax(280px,0.8fr)]">
        <SectionCard
          title="Marketplace mix"
          description="Active vendors by popular category"
          action={<button type="button" aria-label="More category options" className="text-[var(--muted)]"><MoreHorizontal size={18} /></button>}
        >
          <CategoryMix />
        </SectionCard>

        <SectionCard title="Recent activity" description="Latest marketplace updates">
          <ActivityFeed />
        </SectionCard>

        <section className="soft-shadow relative overflow-hidden rounded-[22px] bg-[var(--sidebar)] p-5 text-white sm:p-6">
          <div className="absolute -right-12 -top-12 size-40 rounded-full bg-[var(--primary)]/30 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 size-32 rounded-full bg-[var(--secondary)]/20 blur-2xl" />
          <div className="relative flex h-full min-h-[210px] flex-col">
            <span className="mb-6 grid size-10 place-items-center rounded-xl bg-white/10 text-[var(--accent)]"><CalendarPlus size={19} /></span>
            <p className="m-0 text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--sidebar-muted)]">Today&apos;s snapshot</p>
            <h2 className="mb-2 mt-2 max-w-[230px] text-xl font-extrabold leading-tight tracking-[-0.03em]">18 celebrations are coming to life.</h2>
            <p className="m-0 max-w-[250px] text-[10px] leading-4 text-[var(--sidebar-muted)]">You have 7 new requests and 4 vendor responses waiting.</p>
            <button type="button" className="mt-auto flex items-center gap-2 pt-5 text-[10px] font-bold text-white">Open booking calendar <ArrowRight size={13} /></button>
          </div>
        </section>
      </div>
    </div>
  );
}
