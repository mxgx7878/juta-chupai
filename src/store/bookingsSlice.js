import { createSlice } from "@reduxjs/toolkit";
import { bookings as seed } from "@/data/marketplace";

/* Bookings carry a payments ledger, so payment actions live here rather than in
   the generic entity factory. */
const bookingsSlice = createSlice({
  name: "bookings",
  initialState: { items: seed },
  reducers: {
    add: (s, a) => {
      s.items.unshift({ payments: [], ...a.payload });
    },
    update: (s, a) => {
      const i = s.items.findIndex((b) => b.id === a.payload.id);
      if (i >= 0) s.items[i] = { ...s.items[i], ...a.payload };
    },
    remove: (s, a) => {
      s.items = s.items.filter((b) => b.id !== a.payload);
    },
    setStatus: (s, a) => {
      const b = s.items.find((x) => x.id === a.payload.id);
      if (b) b.status = a.payload.status;
    },

    /* --- payments ledger --- */
    addPayment: (s, a) => {
      const { bookingId, payment } = a.payload;
      const b = s.items.find((x) => x.id === bookingId);
      if (!b) return;
      b.payments = b.payments || [];
      b.payments.push(payment);
    },
    removePayment: (s, a) => {
      const { bookingId, paymentId } = a.payload;
      const b = s.items.find((x) => x.id === bookingId);
      if (!b) return;
      b.payments = (b.payments || []).filter((p) => p.id !== paymentId);
    },
  },
});

export const bookingsActions = bookingsSlice.actions;
export default bookingsSlice.reducer;
