"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import GlobalSnackbar from "@/components/ui/GlobalSnackbar";
import UserShell from "@/components/layout/user/UserShell";

export default function UserLayout({ children }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const email = useSelector((s) => s.session.customerEmail);
  const isLogin = pathname.startsWith("/user/login");

  useEffect(() => { if (!isLogin && !email) router.replace("/user/login"); }, [isLogin, email, router]);

  if (isLogin) return (<>{children}<GlobalSnackbar /></>);
  if (!email) return null;
  return <UserShell>{children}</UserShell>;
}   