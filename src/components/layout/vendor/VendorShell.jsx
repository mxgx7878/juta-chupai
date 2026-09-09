"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import PortalShell from "@/components/layout/PortalShell";
import { accountSwitcherMenuItems } from "@/components/layout/AccountSwitcherMenu";
import { vendorNavFor } from "@/config/vendorNav";
import { vendorVertical } from "@/utils/vertical";
import { sessionActions } from "@/store";
import { notify } from "@/store/uiSlice";

export default function VendorShell({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const vendorId = useSelector((state) => state.session.vendorId);
  const vendors = useSelector((state) => state.vendors.items);
  const categories = useSelector((state) => state.categories.items);
  const inquiries = useSelector((state) => state.inquiries.items);
  const vendor = vendors.find((item) => item.id === vendorId);
  const nav = vendorNavFor(vendorVertical(vendor, categories));
  const newInquiries = inquiries.filter((item) => item.vendorId === vendorId && item.status === "New").length;

  const switchTo = (id) => {
    dispatch(sessionActions.loginAs(id));
    dispatch(notify(`Now acting as ${vendors.find((item) => item.id === id)?.name}`));
    router.push("/vendor");
  };

  const logout = () => {
    dispatch(sessionActions.logout());
    router.push("/vendor/login");
  };

  return (
    <PortalShell
      sidebar={{
        navGroups: [{ label: "Workspace", items: nav }],
        badgeFor: (href) => (href === "/vendor/inquiries" ? newInquiries : 0),
        BrandIcon: StorefrontRoundedIcon,
        brandColor: "secondary.main",
        brandLabel: "VENDOR PORTAL",
        context: { label: "Signed in as", value: vendor?.name || "—" },
        promo: {
          title: "Keep your calendar current",
          description: "Confirmed bookings block the date automatically.",
          background: "linear-gradient(135deg,#0ea5a4 0%,#2f6fed 100%)",
        },
      }}
      topbar={{
        title: "Vendor Portal",
        account: {
          name: vendor?.name || "Select vendor",
          subtitle: vendor?.city || "Vendor account",
          initials: vendor?.name?.[0] || "?",
          color: "secondary.main",
        },
        renderAccountMenu: (close) =>
          accountSwitcherMenuItems({
            label: "Switch vendor (mock)",
            items: vendors.filter((item) => item.status === "Approved").map((item) => ({ id: item.id, label: item.name })),
            activeId: vendorId,
            onSelect: (id) => { close(); switchTo(id); },
            onLogout: () => { close(); logout(); },
          }),
      }}
    >
      {children}
    </PortalShell>
  );
}
