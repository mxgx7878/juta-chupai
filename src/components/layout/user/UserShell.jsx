"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import CelebrationRoundedIcon from "@mui/icons-material/CelebrationRounded";
import PortalShell from "@/components/layout/PortalShell";
import { accountSwitcherMenuItems } from "@/components/layout/AccountSwitcherMenu";
import { userNav } from "@/config/userNav";
import { sessionActions } from "@/store";
import { notify } from "@/store/uiSlice";

export default function UserShell({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const email = useSelector((state) => state.session.customerEmail);
  const customers = useSelector((state) => state.customers.items);
  const customer = customers.find((item) => item.email === email);

  const switchTo = (nextEmail) => {
    dispatch(sessionActions.loginCustomer(nextEmail));
    dispatch(notify(`Now browsing as ${customers.find((item) => item.email === nextEmail)?.name}`));
    router.push("/user");
  };

  const logout = () => {
    dispatch(sessionActions.logoutCustomer());
    router.push("/user/login");
  };

  return (
    <PortalShell
      sidebar={{
        navGroups: [{ label: "Marketplace", items: userNav }],
        BrandIcon: CelebrationRoundedIcon,
        brandLabel: "CUSTOMER PORTAL",
        context: { label: "Signed in as", value: customer?.name || "Guest" },
        promo: {
          title: "Plan everything together",
          description: "Browse vendors, manage your budget and track inquiries in one place.",
          background: "linear-gradient(135deg,#4f46e5 0%,#ec4899 100%)",
        },
      }}
      topbar={{
        title: "Customer Portal",
        account: {
          name: customer?.name || "Guest",
          subtitle: customer?.city || "Customer account",
          initials: customer?.name?.[0] || "?",
        },
        renderAccountMenu: (close) =>
          accountSwitcherMenuItems({
            label: "Switch customer (mock)",
            items: customers.filter((item) => item.status === "Active").map((item) => ({ id: item.email, label: item.name })),
            activeId: email,
            onSelect: (nextEmail) => { close(); switchTo(nextEmail); },
            onLogout: () => { close(); logout(); },
          }),
      }}
    >
      {children}
    </PortalShell>
  );
}
