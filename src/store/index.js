import { configureStore } from "@reduxjs/toolkit";
import {
  customersSlice,
  vendorsSlice,
  listingsSlice,
  citiesSlice,
  bannersSlice,
  notificationsSlice,
} from "./entities";
import categories, { categoriesActions as catActions } from "./categoriesSlice";
import inquiries, { inquiriesActions as inqActions } from "./inquiriesSlice";
import bookings, { bookingsActions as bkgActions } from "./bookingsSlice";
import messages from "./messagesSlice";
import ui from "./uiSlice";
import session, { sessionActions as sessActions } from "./sessionSlice";

export const store = configureStore({
  reducer: {
    customers: customersSlice.reducer,
    vendors: vendorsSlice.reducer,
    listings: listingsSlice.reducer,
    inquiries,
    bookings,
    categories,
    cities: citiesSlice.reducer,
    banners: bannersSlice.reducer,
    notifications: notificationsSlice.reducer,
    messages,
    ui,
    session,
  },
});

export const customersActions = customersSlice.actions;
export const vendorsActions = vendorsSlice.actions;
export const listingsActions = listingsSlice.actions;
export const inquiriesActions = inqActions;
export const bookingsActions = bkgActions;
export const citiesActions = citiesSlice.actions;
export const bannersActions = bannersSlice.actions;
export const notificationsActions = notificationsSlice.actions;
export const categoriesActions = catActions;
export const sessionActions = sessActions;
