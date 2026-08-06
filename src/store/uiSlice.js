import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    sidebarOpen: true,
    snackbar: { open: false, message: "", severity: "success" },
  },
  reducers: {
    toggleSidebar: (s) => {
      s.sidebarOpen = !s.sidebarOpen;
    },
    notify: (s, a) => {
      s.snackbar = {
        open: true,
        message: typeof a.payload === "string" ? a.payload : a.payload.message,
        severity: a.payload.severity || "success",
      };
    },
    closeSnackbar: (s) => {
      s.snackbar.open = false;
    },
  },
});

export const { toggleSidebar, notify, closeSnackbar } = uiSlice.actions;
export default uiSlice.reducer;
