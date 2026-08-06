import Sidebar from "./Sidebar";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <Sidebar />
      <main className="p-5 md:p-8">{children}</main>
    </div>
  );
}
