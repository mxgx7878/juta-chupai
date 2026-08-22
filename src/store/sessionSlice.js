import { createSlice } from "@reduxjs/toolkit";
import { vendors, customers } from "@/data/screens";

/* Mock vendor auth. There's no real backend, so "logging in" just records which
   vendor id the vendor portal is acting as. Defaults to the first approved vendor
   so the portal is usable immediately in testing. */
const defaultVendor = vendors.find((v) => v.status === "Approved")?.id || vendors[0]?.id || null;
const defaultCustomer = customers.find((c) => c.status === "Active")?.email || customers[0]?.email || null;

const sessionSlice = createSlice({
  name: "session",
  initialState: { vendorId: defaultVendor, customerEmail: defaultCustomer },
  reducers: {
    loginAs: (s, a) => { s.vendorId = a.payload; },
    logout: (s) => { s.vendorId = null; },
    loginCustomer: (s, a) => { s.customerEmail = a.payload; },
    logoutCustomer: (s) => { s.customerEmail = null; },
  },
});

export const sessionActions = sessionSlice.actions;
export default sessionSlice.reducer;