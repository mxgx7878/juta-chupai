import { configureStore } from "@reduxjs/toolkit";
import {
  customersSlice,
  vendorsSlice,
  listingsSlice,
  inquiriesSlice,
  calendarSlice,
  citiesSlice,
  bannersSlice,
  notificationsSlice,
} from "./entities";
import categories, { categoriesActions as catActions } from "./categoriesSlice";
import messages from "./messagesSlice";
import ui from "./uiSlice";
import session, { sessionActions as sessActions } from "./sessionSlice";

export const store = configureStore({
  reducer: {
    customers: customersSlice.reducer,
    vendors: vendorsSlice.reducer,
    listings: listingsSlice.reducer,
    inquiries: inquiriesSlice.reducer,
    calendar: calendarSlice.reducer,
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
export const inquiriesActions = inquiriesSlice.actions;
export const calendarActions = calendarSlice.actions;
export const citiesActions = citiesSlice.actions;
export const bannersActions = bannersSlice.actions;
export const notificationsActions = notificationsSlice.actions;
export const categoriesActions = catActions;
export const sessionActions = sessActions;