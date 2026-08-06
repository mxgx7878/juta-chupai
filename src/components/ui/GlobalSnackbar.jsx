"use client";

import { useSelector, useDispatch } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { closeSnackbar } from "@/store/uiSlice";

export default function GlobalSnackbar() {
  const dispatch = useDispatch();
  const snackbar = useSelector((s) => s.ui.snackbar);

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={2600}
      onClose={() => dispatch(closeSnackbar())}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        severity={snackbar.severity}
        variant="filled"
        onClose={() => dispatch(closeSnackbar())}
        sx={{ borderRadius: 2, fontWeight: 600 }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
}
