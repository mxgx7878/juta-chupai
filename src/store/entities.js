import { createSlice } from "@reduxjs/toolkit";
import * as data from "@/data/screens";

/* Generic CRUD slice factory so every entity behaves the same. */
function entity(name, initial, idKey) {
  return createSlice({
    name,
    initialState: { items: initial },
    reducers: {
      add: (s, a) => {
        s.items.unshift(a.payload);
      },
      remove: (s, a) => {
        s.items = s.items.filter((x) => x[idKey] !== a.payload);
      },
      update: (s, a) => {
        const i = s.items.findIndex((x) => x[idKey] === a.payload[idKey]);
        if (i >= 0) s.items[i] = { ...s.items[i], ...a.payload };
      },
      toggleField: (s, a) => {
        const it = s.items.find((x) => x[idKey] === a.payload.id);
        if (it) it[a.payload.field] = !it[a.payload.field];
      },
      setStatus: (s, a) => {
        const it = s.items.find((x) => x[idKey] === a.payload.id);
        if (it) it.status = a.payload.status;
      },
    },
  });
}

export const customersSlice = entity("customers", data.customers, "email");
export const vendorsSlice = entity("vendors", data.vendors, "name");
export const listingsSlice = entity("listings", data.listings, "title");
export const categoriesSlice = entity("categories", data.categories, "name");
export const citiesSlice = entity("cities", data.cities, "name");
export const bannersSlice = entity("banners", data.banners, "title");
export const bookingsSlice = entity("bookings", data.bookings, "id");
export const notificationsSlice = entity("notifications", data.notificationsSent, "title");
