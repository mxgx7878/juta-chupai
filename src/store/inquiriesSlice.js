import { createSlice } from "@reduxjs/toolkit";
import { inquiries as seed } from "@/data/marketplace";

/* An inquiry is a question against a listing. The vendor either rejects it or
   converts it into a booking, at which point it holds a bookingId so the trail
   back to the original request is kept. */
const inquiriesSlice = createSlice({
  name: "inquiries",
  initialState: { items: seed },
  reducers: {
    add: (s, a) => { s.items.unshift({ bookingId: null, ...a.payload }); },
    update: (s, a) => {
      const i = s.items.findIndex((q) => q.id === a.payload.id);
      if (i >= 0) s.items[i] = { ...s.items[i], ...a.payload };
    },
    remove: (s, a) => { s.items = s.items.filter((q) => q.id !== a.payload); },
    setStatus: (s, a) => {
      const q = s.items.find((x) => x.id === a.payload.id);
      if (q) q.status = a.payload.status;
    },
    /* called alongside bookings.add when a vendor converts an inquiry */
    markConverted: (s, a) => {
      const { id, bookingId } = a.payload;
      const q = s.items.find((x) => x.id === id);
      if (q) { q.status = "Converted"; q.bookingId = bookingId; }
    },
  },
});

export const inquiriesActions = inquiriesSlice.actions;
export default inquiriesSlice.reducer;
