"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import GlobalSnackbar from "@/components/ui/GlobalSnackbar";
import VendorShell from "@/components/layout/vendor/VendorShell";

export default function VendorLayout({ children }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const vendorId = useSelector((s) => s.session.vendorId);
  const isLogin = pathname.startsWith("/vendor/login");

  useEffect(() => {
    if (!isLogin && !vendorId) router.replace("/vendor/login");
  }, [isLogin, vendorId, router]);

  // Login screen renders without the portal chrome.
  if (isLogin) {
    return (<>{children}<GlobalSnackbar /></>);
  }
  // Guarded: while redirecting (no session), render nothing.
  if (!vendorId) return null;

  return <VendorShell>{children}</VendorShell>;
}