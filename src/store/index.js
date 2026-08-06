import { configureStore } from "@reduxjs/toolkit";
import {
  customersSlice,
  vendorsSlice,
  listingsSlice,
  citiesSlice,
  bannersSlice,
  bookingsSlice,
  notificationsSlice,
} from "./entities";
import categories, { categoriesActions as catActions } from "./categoriesSlice";
import messages from "./messagesSlice";
import ui from "./uiSlice";

export const store = configureStore({
  reducer: {
    customers: customersSlice.reducer,
    vendors: vendorsSlice.reducer,
    listings: listingsSlice.reducer,
    categories,
    cities: citiesSlice.reducer,
    banners: bannersSlice.reducer,
    bookings: bookingsSlice.reducer,
    notifications: notificationsSlice.reducer,
    messages,
    ui,
  },
});

export const customersActions = customersSlice.actions;
export const vendorsActions = vendorsSlice.actions;
export const listingsActions = listingsSlice.actions;
export const citiesActions = citiesSlice.actions;
export const bannersActions = bannersSlice.actions;
export const bookingsActions = bookingsSlice.actions;
export const notificationsActions = notificationsSlice.actions;
export const categoriesActions = catActions;
